import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { calculateDMI, calculatePAS, calculateCARI } from "@/lib/assessment-scoring";

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

    const sections = [
      "registration",
      "data_maturity",
      "personal_ai",
      "company_ai",
    ];
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
    const { userId, section, responses } = body;

    if (!userId || !section) {
      return Response.json(
        { error: "userId and section are required" },
        { status: 400 }
      );
    }

    // Calculate scores based on section
    let scores: Record<string, number> | null = null;
    let compositScore: number | null = null;
    let tier: string | null = null;

    if (section === "data_maturity") {
      const result = calculateDMI(responses);
      scores = result.dimensions as unknown as Record<string, number>;
      compositScore = result.dmiScore;
      tier = result.tier;
    } else if (section === "personal_ai") {
      const result = calculatePAS(responses);
      scores = result.dimensions as unknown as Record<string, number>;
      compositScore = result.pasScore;
      tier = result.tier;
    } else if (section === "company_ai") {
      const result = calculateCARI(responses);
      scores = {
        ...result.dimensions,
        visibilityWeight: result.visibilityWeight,
      } as unknown as Record<string, number>;
      compositScore = result.cariScore;
      tier = result.tier;
    }
    // registration section has no scores — it is contextual only

    const scoresValue = scores ?? Prisma.DbNull;
    const assessment = await prisma.assessmentResponse.upsert({
      where: {
        userId_section: { userId, section },
      },
      create: {
        userId,
        section,
        responses,
        scores: scoresValue,
        compositScore: compositScore || null,
        tier: tier || null,
        completedAt: new Date(),
      },
      update: {
        responses,
        scores: scoresValue,
        compositScore: compositScore || null,
        tier: tier || null,
        completedAt: new Date(),
      },
    });

    return Response.json({
      ...assessment,
      calculatedScores: scores,
      calculatedCompositeScore: compositScore,
      calculatedTier: tier,
    });
  } catch (error) {
    console.error("Failed to save assessment:", error);
    return Response.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}
