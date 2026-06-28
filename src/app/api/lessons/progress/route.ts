import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  try {
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
    const { userId, lessonSlug, status } = body;

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
        ...(status === "completed" ? { completedAt: new Date() } : {}),
      },
      create: {
        userId,
        lessonId: lesson.id,
        status: status || "in_progress",
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
