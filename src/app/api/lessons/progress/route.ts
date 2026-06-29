import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const lessonSlug = request.nextUrl.searchParams.get("lessonSlug");

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    if (lessonSlug) {
      const progress = await prisma.lessonProgress.findFirst({
        where: { userId, lesson: { slug: lessonSlug } },
        include: { lesson: { include: { module: true } } },
      });

      return Response.json({ progress });
    }

    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: { lesson: { include: { module: true } } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(progress);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return Response.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      lessonSlug,
      status,
      userPrompt,
      aiFeedback,
      improvedPrompt,
      score,
      finalSkillFile,
    } = body;

    if (!userId || !lessonSlug) {
      return Response.json(
        { error: "userId and lessonSlug are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { slug: lessonSlug },
    });

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      update: {
        status: status || "in_progress",
        ...(typeof userPrompt === "string" ? { userPrompt } : {}),
        ...(typeof aiFeedback === "string" ? { aiFeedback } : {}),
        ...(typeof improvedPrompt === "string" ? { improvedPrompt } : {}),
        ...(typeof score === "number" ? { score } : {}),
        ...(typeof finalSkillFile === "string" ? { finalSkillFile } : {}),
        ...(status === "completed" ? { completedAt: new Date() } : {}),
      },
      create: {
        userId,
        lessonId: lesson.id,
        status: status || "in_progress",
        ...(typeof userPrompt === "string" ? { userPrompt } : {}),
        ...(typeof aiFeedback === "string" ? { aiFeedback } : {}),
        ...(typeof improvedPrompt === "string" ? { improvedPrompt } : {}),
        ...(typeof score === "number" ? { score } : {}),
        ...(typeof finalSkillFile === "string" ? { finalSkillFile } : {}),
        ...(status === "completed" ? { completedAt: new Date() } : {}),
      },
    });

    return Response.json(progress);
  } catch (error) {
    console.error("Failed to save progress:", error);
    return Response.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
