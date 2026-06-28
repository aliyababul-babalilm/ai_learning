import { generateExample } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { technique, lessonTitle, userId } = body;

    if (!technique || !lessonTitle) {
      return Response.json(
        { error: "technique and lessonTitle are required" },
        { status: 400 }
      );
    }

    // Get user's job context if available
    let jobContext = "";
    if (userId) {
      const responses = await prisma.userResponse.findMany({
        where: { userId },
      });
      jobContext = responses
        .map((r: { category: string; answer: string }) => `${r.category}: ${r.answer}`)
        .join("\n");
    }

    const result = await generateExample(technique, lessonTitle, jobContext);

    return Response.json(result);
  } catch (error) {
    console.error("Failed to generate example:", error);
    return Response.json(
      { error: "Failed to generate personalized example" },
      { status: 500 }
    );
  }
}
