import { runUserPrompt } from "@/lib/ai";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, userId } = body as { prompt?: string; userId?: string };

    if (!prompt?.trim()) {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }

    let jobContext = "";
    if (userId) {
      const responses = await prisma.userResponse.findMany({
        where: { userId },
      });
      jobContext = responses
        .map((r) => `${r.category}: ${r.answer}`)
        .join("\n");
    }

    const answer = await runUserPrompt(prompt, jobContext);
    return Response.json({ answer });
  } catch (error) {
    console.error("Failed to run prompt:", error);
    return Response.json(
      { error: "Failed to run prompt" },
      { status: 500 }
    );
  }
}
