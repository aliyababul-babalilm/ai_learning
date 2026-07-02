import { prisma } from "@/lib/db";
import {
  calculateDMI,
  calculatePAS,
  calculateCARI,
  calculateOARS,
} from "@/lib/assessment-scoring";
import {
  generateDMINarrative,
  generatePASNarrative,
  generateCARINarrative,
  generateExecutiveSummary,
  generateRecommendations,
} from "@/lib/assessment-narratives";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // Fetch all assessment responses for this user
    const assessments = await prisma.assessmentResponse.findMany({
      where: { userId },
    });

    const sections = ["registration", "data_maturity", "personal_ai", "company_ai"];
    const completedSections = sections.filter((s) => {
      const a = assessments.find((a) => a.section === s);
      return !!a?.completedAt;
    });

    if (completedSections.length < 4) {
      return Response.json(
        {
          error: "INCOMPLETE",
          message: "All four assessment sections must be completed before viewing results.",
          completedCount: completedSections.length,
        },
        { status: 400 }
      );
    }

    // Get individual section data
    const registration = assessments.find((a) => a.section === "registration");
    const dataMaturity = assessments.find((a) => a.section === "data_maturity");
    const personalAi = assessments.find((a) => a.section === "personal_ai");
    const companyAi = assessments.find((a) => a.section === "company_ai");

    if (!registration || !dataMaturity || !personalAi || !companyAi) {
      return Response.json(
        { error: "Missing assessment data" },
        { status: 500 }
      );
    }

    const regResponses = registration.responses as Record<string, any>;
    const dmResponses = dataMaturity.responses as Record<string, any>;
    const paResponses = personalAi.responses as Record<string, any>;
    const caResponses = companyAi.responses as Record<string, any>;

    // Recalculate scores (or use stored)
    const dmiResult = calculateDMI(dmResponses);
    const pasResult = calculatePAS(paResponses);
    const cariResult = calculateCARI(caResponses);
    const oarsResult = calculateOARS(
      dmiResult.dmiScore,
      pasResult.pasScore,
      cariResult.cariScore
    );

    // Build company context from registration responses
    const companyContext = [
      regResponses.REG_COMPANY ? `Company: ${regResponses.REG_COMPANY}` : "",
      regResponses.REG_INDUSTRY ? `Industry: ${regResponses.REG_INDUSTRY}` : "",
      regResponses.REG_EMPLOYEES ? `Size: ${regResponses.REG_EMPLOYEES}` : "",
      regResponses.REG_ORG_DESC ? `Description: ${regResponses.REG_ORG_DESC}` : "",
      regResponses.REG_CHALLENGES ? `Challenges: ${regResponses.REG_CHALLENGES}` : "",
      regResponses.REG_PRIORITIES ? `Priorities: ${regResponses.REG_PRIORITIES}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const roleContext = [
      regResponses.REG_ROLE ? `Role: ${regResponses.REG_ROLE}` : "",
      regResponses.REG_FUNCTION ? `Function: ${regResponses.REG_FUNCTION}` : "",
      regResponses.REG_COMPANY ? `Company: ${regResponses.REG_COMPANY}` : "",
      regResponses.REG_INDUSTRY ? `Industry: ${regResponses.REG_INDUSTRY}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Generate narratives lazily — only if not already stored
    const narrativePromises: Promise<void>[] = [];

    let dmiNarrative = dataMaturity.narrative;
    let pasNarrative = personalAi.narrative;
    let cariNarrative = companyAi.narrative;
    let execSummary = registration.narrative; // Store executive summary on registration record
    let recommendations: string[] = [];

    // Generate DMI narrative if missing
    if (!dmiNarrative) {
      narrativePromises.push(
        generateDMINarrative(
          dmiResult.dimensions as unknown as Record<string, number>,
          dmiResult.dmiScore,
          companyContext
        )
          .then(async (narrative) => {
            dmiNarrative = narrative;
            await prisma.assessmentResponse.update({
              where: { userId_section: { userId, section: "data_maturity" } },
              data: { narrative },
            });
          })
          .catch((err) => {
            console.error("Failed to generate DMI narrative:", err);
          })
      );
    }

    // Generate PAS narrative if missing
    if (!pasNarrative) {
      narrativePromises.push(
        generatePASNarrative(
          pasResult.dimensions as unknown as Record<string, number>,
          pasResult.pasScore,
          roleContext
        )
          .then(async (narrative) => {
            pasNarrative = narrative;
            await prisma.assessmentResponse.update({
              where: { userId_section: { userId, section: "personal_ai" } },
              data: { narrative },
            });
          })
          .catch((err) => {
            console.error("Failed to generate PAS narrative:", err);
          })
      );
    }

    // Generate CARI narrative if missing
    if (!cariNarrative) {
      narrativePromises.push(
        generateCARINarrative(
          cariResult.dimensions as unknown as Record<string, number>,
          cariResult.cariScore,
          companyContext
        )
          .then(async (narrative) => {
            cariNarrative = narrative;
            await prisma.assessmentResponse.update({
              where: { userId_section: { userId, section: "company_ai" } },
              data: { narrative },
            });
          })
          .catch((err) => {
            console.error("Failed to generate CARI narrative:", err);
          })
      );
    }

    // Generate executive summary if missing
    if (!execSummary) {
      narrativePromises.push(
        generateExecutiveSummary(
          dmiResult.dmiScore,
          pasResult.pasScore,
          cariResult.cariScore,
          oarsResult.score,
          companyContext
        )
          .then(async (summary) => {
            execSummary = summary;
            await prisma.assessmentResponse.update({
              where: { userId_section: { userId, section: "registration" } },
              data: { narrative: summary },
            });
          })
          .catch((err) => {
            console.error("Failed to generate executive summary:", err);
          })
      );
    }

    // Generate recommendations
    narrativePromises.push(
      generateRecommendations(
        dmiResult.dmiScore,
        pasResult.pasScore,
        cariResult.cariScore,
        oarsResult.score,
        companyContext
      )
        .then((recs) => {
          recommendations = recs;
        })
        .catch((err) => {
          console.error("Failed to generate recommendations:", err);
        })
    );

    // Wait for all narrative generation to complete
    await Promise.all(narrativePromises);

    return Response.json({
      completedAt: dataMaturity.completedAt,
      companyName: regResponses.REG_COMPANY || "Your Organisation",
      scores: {
        dmi: {
          score: dmiResult.dmiScore,
          tier: dmiResult.tier,
          dimensions: dmiResult.dimensions,
        },
        pas: {
          score: pasResult.pasScore,
          tier: pasResult.tier,
          dimensions: pasResult.dimensions,
        },
        cari: {
          score: cariResult.cariScore,
          tier: cariResult.tier,
          dimensions: cariResult.dimensions,
        },
        oars: {
          score: oarsResult.score,
          tier: oarsResult.tier,
        },
      },
      narratives: {
        dmi: dmiNarrative || null,
        pas: pasNarrative || null,
        cari: cariNarrative || null,
        executiveSummary: execSummary || null,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Failed to fetch assessment results:", error);
    return Response.json(
      { error: "Failed to fetch assessment results" },
      { status: 500 }
    );
  }
}
