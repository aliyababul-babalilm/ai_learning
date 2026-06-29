import { prisma } from "@/lib/db";
import { generateExample } from "@/lib/ai";
import { lessons } from "@/lib/lessons-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, companyId, responses } = body as {
      name: string;
      email: string;
      companyId: string;
      responses: Array<{ questionId: string; category: string; answer: string }>;
    };

    if (!name || !email || !companyId) {
      return Response.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, companyId },
      create: { name, email, companyId, role: "learner" },
    });

    // Save responses
    if (responses && responses.length > 0) {
      // Delete existing responses for this user
      await prisma.userResponse.deleteMany({ where: { userId: user.id } });

      await Promise.all(
        responses.map((r) =>
          prisma.userResponse.create({
            data: {
              userId: user.id,
              questionId: r.questionId,
              category: r.category,
              answer: r.answer,
            },
          })
        )
      );
    }

    const jobContext = (responses || [])
      .map((r) => `${r.category}: ${r.answer}`)
      .join("\n");

    if (jobContext.trim()) {
      const exampleResults = await Promise.allSettled(
        lessons.map(async (lesson) => {
          const example = await generateExample(lesson.title, lesson.title, jobContext);
          await prisma.personalizedExample.upsert({
            where: {
              userId_lessonSlug: { userId: user.id, lessonSlug: lesson.slug },
            },
            update: example,
            create: {
              userId: user.id,
              lessonSlug: lesson.slug,
              ...example,
            },
          });
        })
      );

      const failedExamples = exampleResults.filter(
        (result) => result.status === "rejected"
      ).length;
      if (failedExamples > 0) {
        console.error(`Failed to generate ${failedExamples} personalized examples`);
      }
    }

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Failed to save onboarding:", error);
    return Response.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
