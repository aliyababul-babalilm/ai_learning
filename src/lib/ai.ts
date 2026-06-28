import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export interface EvaluationResult {
  score: number;
  feedback: string;
  improvedPrompt: string;
}

export interface GeneratedExample {
  before: string;
  after: string;
  explanation: string;
}

function buildJobContextString(jobContext: string): string {
  if (!jobContext || jobContext.trim() === "") {
    return "No specific job context provided. Use commodities trading as a default industry context.";
  }
  return jobContext;
}

export async function evaluatePrompt(
  userPrompt: string,
  technique: string,
  lessonTitle: string,
  jobContext: string
): Promise<EvaluationResult> {
  const contextStr = buildJobContextString(jobContext);

  const message = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an expert prompt engineering instructor at a McKinsey-calibre AI training programme called "Bab Al Ilm" (Gate of Knowledge). You are evaluating a professional learner's prompt attempt.

The learner is practicing the technique: "${technique}" (Lesson: "${lessonTitle}")

LEARNER'S JOB CONTEXT (use this to personalize all feedback):
${contextStr}

Their prompt attempt:
"""
${userPrompt}
"""

Evaluate this prompt with deep, personalized feedback. Your evaluation should reference their specific industry, role, commodities, tools, and workflows wherever possible.

Respond in JSON format:
{
  "score": <number 0-100>,
  "feedback": "<2-3 paragraphs of specific, constructive feedback. Start with what they did well regarding the ${technique} technique. Then identify 2-3 specific improvements, referencing their actual work context. Use professional, encouraging tone.>",
  "improvedPrompt": "<A significantly improved version of their prompt that masterfully demonstrates the ${technique} technique, deeply personalized to their job context — referencing their specific commodities, markets, tools, data sources, and workflows. This should be a prompt they could use immediately at work.>"
}

Scoring guide:
- 90-100: Masterful application of the technique with rich, relevant detail
- 70-89: Good application with minor gaps in specificity or technique usage
- 50-69: Acceptable attempt but significant room for improvement
- 30-49: Shows understanding but poor execution
- 0-29: Minimal effort or fundamentally misunderstands the technique

Be encouraging but specific. If the prompt is empty or irrelevant, score it low and explain why.
Respond ONLY with the JSON object.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);
    return {
      score: Math.min(100, Math.max(0, result.score)),
      feedback: result.feedback,
      improvedPrompt: result.improvedPrompt,
    };
  } catch {
    throw new Error("Failed to parse AI evaluation response");
  }
}

export async function generateExample(
  technique: string,
  lessonTitle: string,
  jobContext: string
): Promise<GeneratedExample> {
  const contextStr = buildJobContextString(jobContext);

  const message = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an expert prompt engineering instructor creating personalized before/after examples for a professional learner.

Technique being taught: "${technique}" (Lesson: "${lessonTitle}")

LEARNER'S JOB CONTEXT:
${contextStr}

Generate a compelling before/after prompt example that demonstrates the "${technique}" technique, deeply personalized to this learner's actual job. The examples should reference their specific role, commodities, markets, tools, data sources, and daily tasks.

The "before" prompt should be something they might actually write — realistic but weak.
The "after" prompt should be a masterful application of the technique that they could use immediately at work.

Respond in JSON format:
{
  "before": "<A realistic weak prompt this professional might write — generic, missing the technique>",
  "after": "<A masterful prompt applying the ${technique} technique, deeply personalized with their specific commodities, markets, tools, data sources, and workflows. Should be immediately useful in their actual work.>",
  "explanation": "<2-3 sentences explaining specifically how the technique transforms the output, referencing their work context>"
}

Respond ONLY with the JSON object.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI example generation response");
  }
}

export async function generateSkillFile(
  skillDescription: string,
  jobContext: string
): Promise<string> {
  const contextStr = buildJobContextString(jobContext);

  const message = await anthropic.messages.create({
    model,
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are an expert AI workflow designer creating a production-ready Claude skill file for a professional user.

LEARNER'S JOB CONTEXT:
${contextStr}

LEARNER'S SKILL DESCRIPTION/DRAFT:
${skillDescription}

Generate a complete, polished, production-ready .skill file based on their description. The skill should be deeply personalized to their job context and immediately useful.

Format the output as a complete .skill file with:
1. YAML-style header (name, version, author, description, trigger)
2. Detailed role and context instructions
3. Step-by-step process for Claude to follow
4. Output format specification
5. Rules and constraints

The skill should incorporate prompt engineering best practices: clear role setting, specific output formatting, chain of thought reasoning where appropriate, and relevant examples.

Return ONLY the skill file content, ready to be saved and imported. Do not wrap in code blocks or add any commentary.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text.trim();
}

export async function generateBlueprint(
  userInputs: string,
  jobContext: string
): Promise<string> {
  const contextStr = buildJobContextString(jobContext);

  const message = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are a McKinsey-calibre AI productivity consultant creating a comprehensive Claude Desktop setup blueprint for a professional user.

LEARNER'S JOB CONTEXT:
${contextStr}

LEARNER'S BLUEPRINT DRAFT/INPUTS:
${userInputs}

Generate a complete, polished Claude Desktop Blueprint that this professional can implement immediately. The blueprint should be deeply personalized to their specific role, workflows, and daily tasks.

Structure the blueprint as follows:

# CLAUDE DESKTOP BLUEPRINT — [Their Role/Title]

For each project (recommend 3-5):

## PROJECT [N]: "[Name]"
**Purpose:** [1-2 sentences]

**Custom Instructions:**
IDENTITY: [specific role for Claude in this project]
CONTEXT: [key domain knowledge, markets, tools]
BEHAVIOR: [output preferences, format, tone]
CONSTRAINTS: [what to avoid, compliance notes]

**Recommended Skills:**
- [Skill 1]: [brief description]
- [Skill 2]: [brief description]

**Conversation Naming Convention:** [pattern]

**Example Conversations:**
- [Example title 1]
- [Example title 2]

---

## IMPLEMENTATION ROADMAP
Week 1: [specific setup tasks]
Week 2: [skill building]
Week 3: [expansion]
Week 4: [optimization]

## DAILY WORKFLOW
- Morning: [routine]
- Midday: [routine]
- End of day: [routine]

Make it specific, actionable, and professional. This should read like a consulting deliverable.

Return ONLY the blueprint content. Do not wrap in code blocks.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text.trim();
}

export async function generateQuestions(
  companyName: string,
  companyDescription: string,
  industry: string
): Promise<Array<{ text: string; category: string }>> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are designing onboarding questions for an AI mastery programme called "Bab Al Ilm" (Gate of Knowledge).

Company: ${companyName}
Industry: ${industry || "Not specified"}
Description: ${companyDescription}

Generate 8 conversational, professional onboarding questions to deeply understand the learners' job context so the platform can personalize their AI training. The questions should cover:
1. Their specific role and responsibilities
2. Which specific products/commodities/markets they work with
3. Geographic focus areas
4. Daily information sources and publications
5. What specific information they look for in daily research
6. Their typical daily workflow from start to finish
7. Analysis they personally conduct vs. receive from others
8. Tools and platforms they currently use

Respond in JSON format as an array:
[
  { "text": "<question text>", "category": "<one of: role, products, geography, sources, research_focus, workflow, analysis, tools>" }
]

Make the questions conversational and specific to the company's industry. They should feel like a smart interview, not a form.
Respond ONLY with the JSON array.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI question generation response");
  }
}
