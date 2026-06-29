import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const moduleSlug = request.nextUrl.searchParams.get("moduleSlug");

  if (!userId || !moduleSlug) {
    return Response.json(
      { error: "userId and moduleSlug are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all LessonProgress records for this user in this module
    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          module: {
            slug: moduleSlug,
          },
        },
      },
      include: {
        lesson: true,
      },
    });

    // Merge all builderState JSON into one accumulated object
    const mergedState: Record<string, unknown> = {};
    for (const record of progressRecords) {
      if (record.builderState && typeof record.builderState === "object") {
        const state = record.builderState as Record<string, unknown>;
        Object.assign(mergedState, state);
      }
    }

    return Response.json({ state: mergedState });
  } catch (error) {
    console.error("Failed to fetch builder state:", error);
    return Response.json(
      { error: "Failed to fetch builder state" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, builderState } = body;

    if (!userId || !lessonId) {
      return Response.json(
        { error: "userId and lessonId are required" },
        { status: 400 }
      );
    }

    // Look up the lesson — lessonId might be a slug (from the client) or a UUID
    let lesson;
    // Try as slug first
    lesson = await prisma.lesson.findUnique({
      where: { slug: lessonId },
    });
    // If not found by slug, try as id
    if (!lesson) {
      lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });
    }

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      update: {
        builderState: builderState,
      },
      create: {
        userId,
        lessonId: lesson.id,
        status: "in_progress",
        builderState: builderState,
      },
    });

    return Response.json(progress);
  } catch (error) {
    console.error("Failed to save builder state:", error);
    return Response.json(
      { error: "Failed to save builder state" },
      { status: 500 }
    );
  }
}
