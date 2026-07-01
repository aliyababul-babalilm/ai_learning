import { generateExample } from "@/lib/ai";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const SKILL_LESSON_PROMPTS: Record<string, string> = {
  "what-are-skills": `Generate a personalized YAML header example for a Claude Skill that this learner would actually use in their daily work.

The "before" should show what they currently do — manually typing a prompt every time for a repeatable task relevant to their job.

The "after" should show a proper YAML skill header with:
- A kebab-case name specific to their role and task
- A "pushy" description (2-3 sentences) that includes trigger phrases they would naturally use
- A trigger command

Format the "after" EXACTLY like this (with the --- delimiters):
---
name: [relevant-skill-name]
description: >
  [Pushy description with multiple trigger phrases relevant to their actual job]
---

Trigger: /[trigger-command] or "[natural phrase they would say]"`,

  "anatomy-of-a-skill": `Generate a personalized Role and Input Specification example for a Claude Skill relevant to this learner's actual job.

The "before" should show a vague, generic role like "You are a helpful assistant" with no input spec.

The "after" should show:

## YOUR ROLE
A detailed expert role definition specific to their actual products, markets, geographies, seniority level, and who they advise. Include the specific domain expertise that makes this role valuable.

## INPUT
A clear input specification describing exactly what data/context the user would provide for their most common task, what format it should be in, and what happens when the input is incomplete.

Make both sections deeply specific to their actual work — reference their products, markets, data sources, and workflow.`,

  "build-your-first-skill": `Generate a personalized Analysis Framework and Output Specification example for a Claude Skill relevant to this learner's actual job.

The "before" should show a generic instruction like "Analyze this data and give me insights" — no structure, no steps, no output format.

The "after" should show:

## ANALYSIS FRAMEWORK
A numbered, multi-step (4-8 steps) analysis process specific to their actual work. Each step should:
- Name what to analyze (using their actual products/markets)
- Reference their actual data sources
- State what conclusion to draw before the next step
- Explain WHY this step matters

## OUTPUT SPECIFICATION
- Exact sections in order
- Format per section (table, bullets, paragraphs)
- Length guidelines
- Tone and audience
- What to bold/emphasize

Make everything specific to their commodities, geographies, and daily tasks.`,

  "download-and-use": `Generate personalized Edge Cases and Constraints for a Claude Skill relevant to this learner's actual job.

The "before" should show a skill with no error handling — assumes perfect data, no uncertainty flags, no constraints.

The "after" should show:

## EDGE CASES
Specific scenarios relevant to their work:
- What to do when data is missing (specific to their data sources)
- What to do when market signals are contradictory
- How to handle stale or outdated data

## CONSTRAINTS
Numbered rules with reasoning:
1. [Constraint specific to their role] — because [reason]
2. [Data citation rule for their sources] — because [reason]
3. [Uncertainty flagging rule] — because [reason]
4-5. [Additional constraints relevant to their domain]

Make everything specific to their actual products, markets, and data sources.`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { technique, lessonTitle, userId, lessonSlug, moduleSlug } = body;

    if (!technique || !lessonTitle) {
      return Response.json(
        { error: "technique and lessonTitle are required" },
        { status: 400 }
      );
    }

    // Get user's job context if available
    let jobContext = "";
    if (userId) {
      const responses = await prisma.userResponse.findMany({
        where: { userId },
      });
      jobContext = responses
        .map((r: { category: string; answer: string }) => `${r.category}: ${r.answer}`)
        .join("\n");
    }

    // For skills/projects lessons, use lesson-specific prompts
    if (moduleSlug && (moduleSlug === "claude-skills" || moduleSlug === "claude-projects") && lessonSlug) {
      const skillPrompt = SKILL_LESSON_PROMPTS[lessonSlug];
      if (skillPrompt && jobContext) {
        const message = await anthropic.messages.create({
          model,
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `You are creating a personalized skill-building example for a professional learner.

Lesson: "${lessonTitle}" (${lessonSlug})
Module: ${moduleSlug}

LEARNER'S JOB CONTEXT:
${jobContext}

${skillPrompt}

Respond in JSON format:
{
  "before": "<The weak/generic version — what they do now without a proper skill>",
  "after": "<The strong/specific version — a real, detailed example personalized to their actual job, products, markets, and workflow>",
  "explanation": "<2-3 sentences explaining why this matters for their specific role>"
}

Respond ONLY with the JSON object.`,
            },
          ],
        });

        const content = message.content[0];
        if (content.type === "text") {
          const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          return Response.json(JSON.parse(cleaned));
        }
      }
    }

    // Default: use the standard prompt engineering example generator
    const result = await generateExample(technique, lessonTitle, jobContext);
    return Response.json(result);
  } catch (error) {
    console.error("Failed to generate example:", error);
    return Response.json(
      { error: "Failed to generate personalized example" },
      { status: 500 }
    );
  }
}
