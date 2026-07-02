import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        progress: {
          include: { lesson: { include: { module: true } } },
        },
        assessments: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate learning progress
    const completedLessons = user.progress.filter(
      (p) => p.status === "completed"
    ).length;
    const totalLessonsAttempted = user.progress.length;

    // Calculate assessment progress
    const assessmentSections = [
      "registration",
      "data_maturity",
      "personal_ai",
      "company_ai",
    ];
    const completedAssessments = user.assessments.filter(
      (a) => a.completedAt
    ).length;

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
      },
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            modules: user.company.modules,
          }
        : null,
      moduleProgress: {
        learning: {
          completedLessons,
          totalLessonsAttempted,
        },
        assessment: {
          completedSections: completedAssessments,
          totalSections: assessmentSections.length,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
