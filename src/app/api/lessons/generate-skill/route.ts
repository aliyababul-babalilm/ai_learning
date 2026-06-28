import { generateSkillFile } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skillDescription, userId } = body;

    if (!skillDescription) {
      return Response.json(
        { error: "skillDescription is required" },
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

    const skillContent = await generateSkillFile(skillDescription, jobContext);

    return Response.json({ skillContent });
  } catch (error) {
    console.error("Failed to generate skill:", error);
    return Response.json(
      { error: "Failed to generate skill file" },
      { status: 500 }
    );
  }
}
