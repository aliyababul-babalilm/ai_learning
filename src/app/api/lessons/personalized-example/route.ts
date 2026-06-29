import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const lessonSlug = request.nextUrl.searchParams.get("lessonSlug");

  if (!userId || !lessonSlug) {
    return Response.json(
      { error: "userId and lessonSlug are required" },
      { status: 400 }
    );
  }

  try {
    const example = await prisma.personalizedExample.findUnique({
      where: {
        userId_lessonSlug: { userId, lessonSlug },
      },
    });

    if (!example) {
      return Response.json({ example: null }, { status: 404 });
    }

    return Response.json({
      before: example.before,
      after: example.after,
      explanation: example.explanation,
    });
  } catch (error) {
    console.error("Failed to fetch personalized example:", error);
    return Response.json(
      { error: "Failed to fetch personalized example" },
      { status: 500 }
    );
  }
}
