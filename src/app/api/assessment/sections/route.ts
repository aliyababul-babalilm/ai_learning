import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // If sections already assigned, return them
    if (user.assessmentSections && user.assessmentSections.length > 0) {
      return Response.json({ sections: user.assessmentSections });
    }

    // Check if registration is complete
    const registration = await prisma.assessmentResponse.findUnique({
      where: { userId_section: { userId, section: "registration" } },
    });

    if (!registration?.completedAt) {
      // Registration not complete — only show registration
      return Response.json({ sections: ["registration"] });
    }

    // Extract role/department from registration responses
    const regResponses = registration.responses as Record<string, any>;
    const role = regResponses.REG_ROLE || "";
    const department = regResponses.REG_FUNCTION || "";
    const companyContext = regResponses.REG_ORG_DESC || "";

    // Check if admin has defined sections for this user's department
    let assignedSections: string[] = [];

    if (user.companyId) {
      // Look for department templates with assessment sections configured
      const deptTemplates = await prisma.departmentTemplate.findMany({
        where: { companyId: user.companyId },
      });

      // Try to match user's department/function to a template
      const matchedTemplate = deptTemplates.find((t) => {
        const tName = t.name.toLowerCase();
        const deptLower = department.toLowerCase();
        const roleLower = role.toLowerCase();
        return (
          deptLower.includes(tName) ||
          tName.includes(deptLower.split(" ")[0]) ||
          roleLower.includes(tName) ||
          tName.includes(roleLower.split(" ")[0])
        );
      });

      if (matchedTemplate && matchedTemplate.assessmentSections.length > 0) {
        // Admin override: use admin-defined sections
        assignedSections = [
          "registration",
          "personal_ai",
          ...matchedTemplate.assessmentSections.filter(
            (s) => s !== "registration" && s !== "personal_ai"
          ),
        ];
      }
    }

    // If no admin override, use AI inference
    if (assignedSections.length === 0) {
      try {
        const inferredSections = await inferSectionsWithAI(
          role,
          department,
          companyContext
        );
        assignedSections = [
          "registration",
          "personal_ai",
          ...inferredSections.filter(
            (s) => s !== "registration" && s !== "personal_ai"
          ),
        ];
      } catch (err) {
        console.error("AI inference failed, defaulting to all sections:", err);
        // Fallback: give all sections
        assignedSections = [
          "registration",
          "data_maturity",
          "personal_ai",
          "company_ai",
        ];
      }
    }

    // Save assigned sections to user
    await prisma.user.update({
      where: { id: userId },
      data: { assessmentSections: assignedSections },
    });

    return Response.json({ sections: assignedSections });
  } catch (error) {
    console.error("Failed to determine assessment sections:", error);
    return Response.json(
      { error: "Failed to determine assessment sections" },
      { status: 500 }
    );
  }
}

async function inferSectionsWithAI(
  role: string,
  department: string,
  companyContext: string
): Promise<string[]> {
  const prompt = `Given this person's role and department, determine which AI assessment sections are relevant.

Role: ${role}
Department: ${department || "not specified"}
Company context: ${companyContext || "not specified"}

The available sections are:
1. "data_maturity" — Questions about data infrastructure, data quality, data governance, data tools. Relevant for roles that work directly with data systems, analytics, technology infrastructure, or make decisions about data strategy.
2. "company_ai" — Questions about organizational AI strategy, AI governance, AI infrastructure, AI talent. Relevant for roles with strategic visibility into the organization — leadership, senior management, department heads, or anyone who influences AI adoption decisions.

"registration" and "personal_ai" are ALWAYS included — do not list them.

Return ONLY a JSON array of additional section keys to include. Examples:
- For a "Head of Trading": ["data_maturity", "company_ai"]
- For an "HR Manager": ["company_ai"]
- For a "Junior Analyst": []
- For a "CTO": ["data_maturity", "company_ai"]
- For a "Compliance Officer": ["company_ai"]

Return ONLY the JSON array, nothing else.`;

  const message = await anthropic.messages.create({
    model,
    max_tokens: 100,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const parsed = JSON.parse(content.text.trim());
  if (!Array.isArray(parsed)) {
    throw new Error("AI did not return an array");
  }

  // Validate section keys
  const validSections = ["data_maturity", "company_ai"];
  return parsed.filter((s: string) => validSections.includes(s));
}
