import { evaluatePrompt } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userPrompt, technique, lessonTitle, userId, lessonSlug } = body;

    if (!userPrompt || !technique || !lessonTitle) {
      return Response.json(
        { error: "userPrompt, technique, and lessonTitle are required" },
        { status: 400 }
      );
    }

    // Get user's job context if available
    let jobContext = "";
    if (userId) {
      const responses = await prisma.userResponse.findMany({
        where: { userId },
      });
      jobContext = responses.map((r: { category: string; answer: string }) => `${r.category}: ${r.answer}`).join("\n");
    }

    const result = await evaluatePrompt(
      userPrompt,
      technique,
      lessonTitle,
      jobContext
    );

    // Save progress if we have user and lesson info
    if (userId && lessonSlug) {
      const lesson = await prisma.lesson.findUnique({
        where: { slug: lessonSlug },
      });

      if (lesson) {
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId: lesson.id },
          },
          update: {
            userPrompt,
            aiFeedback: result.feedback,
            improvedPrompt: result.improvedPrompt,
            score: result.score,
            status: "completed",
            completedAt: new Date(),
          },
          create: {
            userId,
            lessonId: lesson.id,
            userPrompt,
            aiFeedback: result.feedback,
            improvedPrompt: result.improvedPrompt,
            score: result.score,
            status: "completed",
            completedAt: new Date(),
          },
        });
      }
    }

    return Response.json(result);
  } catch (error) {
    console.error("Failed to evaluate prompt:", error);
    return Response.json(
      { error: "Failed to evaluate prompt" },
      { status: 500 }
    );
  }
}
