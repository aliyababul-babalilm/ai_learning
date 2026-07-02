import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const assessments = await prisma.assessmentResponse.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const sections = ["registration", "data_maturity", "personal_ai", "company_ai"];
    const progress = sections.map((section) => {
      const assessment = assessments.find((a) => a.section === section);
      return {
        section,
        completed: !!assessment?.completedAt,
        scores: assessment?.scores || null,
        compositScore: assessment?.compositScore || null,
        tier: assessment?.tier || null,
      };
    });

    return Response.json({ progress, assessments });
  } catch (error) {
    console.error("Failed to fetch assessment progress:", error);
    return Response.json(
      { error: "Failed to fetch assessment progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, section, responses, scores, compositScore, tier, narrative } = body;

    if (!userId || !section) {
      return Response.json(
        { error: "userId and section are required" },
        { status: 400 }
      );
    }

    const assessment = await prisma.assessmentResponse.upsert({
      where: {
        userId_section: { userId, section },
      },
      create: {
        userId,
        section,
        responses,
        scores: scores || null,
        compositScore: compositScore || null,
        tier: tier || null,
        narrative: narrative || null,
        completedAt: new Date(),
      },
      update: {
        responses,
        scores: scores || null,
        compositScore: compositScore || null,
        tier: tier || null,
        narrative: narrative || null,
        completedAt: new Date(),
      },
    });

    return Response.json(assessment);
  } catch (error) {
    console.error("Failed to save assessment:", error);
    return Response.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}
