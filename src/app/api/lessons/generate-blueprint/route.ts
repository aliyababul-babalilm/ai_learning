import { generateBlueprint } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInputs, userId } = body;

    if (!userInputs) {
      return Response.json(
        { error: "userInputs is required" },
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

    const blueprint = await generateBlueprint(userInputs, jobContext);

    return Response.json({ blueprint });
  } catch (error) {
    console.error("Failed to generate blueprint:", error);
    return Response.json(
      { error: "Failed to generate blueprint" },
      { status: 500 }
    );
  }
}
