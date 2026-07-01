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
    return "No specific job context was provided. Keep the response professional and broadly applicable without inventing an industry, role, market, tools, or workflow.";
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

export async function runUserPrompt(
  prompt: string,
  jobContext: string
): Promise<string> {
  const contextStr = buildJobContextString(jobContext);

  const message = await anthropic.messages.create({
    model,
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are executing a learner's prompt so they can see what kind of answer it produces, even if they do not have their own Claude account.

LEARNER'S JOB CONTEXT:
${contextStr}

Run the prompt below exactly as a helpful Claude-style assistant. Use the job context only when it is relevant to the prompt. Do not critique the prompt; just answer it.

PROMPT TO RUN:
"""
${prompt}
"""`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text.trim();
}

export async function evaluateSkill(
  userSkill: string,
  lessonSlug: string,
  jobContext: string
): Promise<EvaluationResult> {
  const contextStr = buildJobContextString(jobContext);

  // Determine what aspect of skill-building this lesson focuses on
  let evaluationFocus = "";
  let scoringCriteria = "";

  switch (lessonSlug) {
    case "what-are-skills":
      evaluationFocus = `The learner was asked to answer a structured interview about a task they want to automate. Evaluate how thoroughly and specifically they described their task, inputs, outputs, edge cases, and audience. A great response has concrete, specific answers — naming exact data sources, describing exact output sections, identifying real edge cases from their work.`;
      scoringCriteria = `
- 90-100: Every question answered with specific, concrete detail drawn from their actual work. Named exact data sources, described precise output format, identified non-obvious edge cases.
- 70-89: Most questions answered well but some are vague or generic. Good foundation but needs more specificity in 2-3 areas.
- 50-69: Answers are present but mostly generic. Could apply to almost anyone — not enough detail about their specific workflow.
- 30-49: Several questions skipped or answered with one-word responses. Shows understanding of the concept but minimal effort on specifics.
- 0-29: Minimal effort, most questions unanswered, or completely off-topic.`;
      break;

    case "anatomy-of-a-skill":
      evaluationFocus = `The learner was asked to write the YAML frontmatter (name and description) for their skill. The description field is THE most important part because it determines when Claude activates the skill. Evaluate whether:
1. The name is in kebab-case and descriptive
2. The description clearly states what the skill does
3. The description includes specific trigger phrases in quotes
4. The description covers multiple situations/scenarios that should activate the skill
5. The description is "pushy" — aggressively telling Claude when to use the skill
A weak description is one sentence. A strong description is 3-5 sentences with multiple trigger phrases and scenarios.`;
      scoringCriteria = `
- 90-100: Proper YAML format, descriptive kebab-case name, description with 3+ trigger phrases, multiple activation scenarios, and aggressive about when to trigger. Description is 3-5 sentences and covers edge triggers.
- 70-89: Good YAML format, reasonable name, description has some trigger phrases but could be pushier. Missing some scenarios where the skill should activate.
- 50-69: Has the basic structure but description is only 1-2 sentences, lacks trigger phrases, or is too vague about when to activate.
- 30-49: Attempted the format but missing key elements. Description does not include any trigger phrases or is generic.
- 0-29: No YAML format attempted or completely misunderstands the task.`;
      break;

    case "build-your-first-skill":
      evaluationFocus = `The learner was asked to write a COMPLETE, production-ready skill file. This is the core deliverable of the entire module. Evaluate rigorously against ALL of these criteria:

1. **YAML Frontmatter**: Does it have proper --- delimiters, a name field, and a pushy description with trigger phrases?
2. **Role Setting** (Technique 1): Is there a specific expert role with seniority, domain, and perspective?
3. **Input Specification**: Does it clearly state what data/context the user will provide and what to do when input is incomplete?
4. **Analysis Framework** (Technique 5 - Chain of Thought): Is there a numbered, step-by-step process? Does each step explain what to analyze, what to reference, and what conclusion to draw? Are there 4+ substantive steps?
5. **Output Specification** (Technique 6): Are exact sections defined with format, length, tone, and audience? Is it precise enough to produce output that needs no reformatting?
6. **Edge Cases and Constraints**: Are there explicit instructions for missing data, ambiguous inputs, and things to avoid? Do constraints include WHY (not just rules)?
7. **Overall Quality**: Is this 40+ lines of substantive instructions? Would it produce consistent, high-quality output across different inputs? Would a professional actually use this?

A great skill reads like a detailed brief for a brilliant new hire — not a vague wish list.`;
      scoringCriteria = `
- 90-100: All 7 criteria met at a high level. Complete YAML, specific role, detailed analysis framework with 4+ steps, precise output spec, edge cases with reasoning. 40+ lines of real instructions. Production-ready — could be used immediately.
- 70-89: Most criteria met but 1-2 areas need strengthening. Maybe the analysis framework is solid but edge cases are thin, or the output spec lacks precision. Good skill that needs one more iteration.
- 50-69: Has the right structure but multiple areas are underdeveloped. Analysis framework might be only 2-3 vague steps, or output spec says "be professional" instead of defining exact sections. Needs significant revision.
- 30-49: Attempted a skill file but it is too short (<20 lines) or too vague. Missing 3+ of the 7 criteria. More of a prompt than a skill.
- 0-29: Minimal effort, no structure, or fundamentally misunderstands what a skill file is.`;
      break;

    case "download-and-use":
      evaluationFocus = `The learner was asked to write 3 test scenarios for their skill: a normal case, an edge case, and a stress test. Evaluate whether:
1. Each test scenario has a concrete, realistic input description (not vague)
2. Expected outputs are specific (not just "a good analysis")
3. Failure criteria are defined for each test (what would make the output wrong)
4. The tests actually exercise different aspects of the skill
5. The iteration strategy shows understanding of how to improve skill instructions based on test failures
Great test scenarios use real examples from the learner's work, not hypothetical abstractions.`;
      scoringCriteria = `
- 90-100: All 3 tests are concrete with real-world examples, specific expected outputs, and clear failure criteria. Tests exercise genuinely different aspects. Iteration strategy maps specific output problems to specific instruction changes.
- 70-89: Tests are present and mostly specific but 1-2 could be more concrete. Failure criteria exist but could be sharper. Good iteration thinking.
- 50-69: Tests exist but are vague or generic. Expected outputs say things like "a good report" instead of specifying sections and content. Limited iteration strategy.
- 30-49: Only 1-2 tests provided, or tests are so vague they would not actually help identify skill gaps.
- 0-29: Minimal effort, no real test scenarios, or misunderstands the testing concept.`;
      break;

    default:
      evaluationFocus = "General skill-building evaluation.";
      scoringCriteria = `
- 90-100: Excellent, thorough, production-ready work
- 70-89: Good with minor improvements needed
- 50-69: Acceptable but needs significant improvement
- 30-49: Shows understanding but poor execution
- 0-29: Minimal effort`;
  }

  const message = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are an expert AI skills architect and instructor at a premium corporate training programme called "Bab Al Ilm" (Gate of Knowledge). You are evaluating a professional learner's work on building a Claude skill.

LESSON: "${lessonSlug}"

EVALUATION FOCUS:
${evaluationFocus}

SCORING CRITERIA:
${scoringCriteria}

LEARNER'S JOB CONTEXT (use this to personalize all feedback):
${contextStr}

Their submission:
"""
${userSkill}
"""

Evaluate this submission with deep, specific feedback. Reference their industry, role, and workflow wherever possible.

For the improvedPrompt field:
${lessonSlug === "build-your-first-skill" ? `Generate a COMPLETE, production-ready skill file that is significantly better than what they submitted. This must be a full skill file with:
- Proper YAML frontmatter (--- delimiters, name, pushy description with trigger phrases)
- Specific expert role
- Detailed input specification
- Numbered analysis framework with 4-6 substantive steps (each explaining what to analyze, what to reference, and what to conclude)
- Precise output specification (exact sections, format, length, tone)
- Edge cases and constraints with reasoning
The improved skill should be 50-80 lines of substantive instructions, deeply personalized to their job context. This is the skill they will actually download and use — make it genuinely excellent.` :
lessonSlug === "anatomy-of-a-skill" ? `Generate an improved YAML frontmatter (name and description only, wrapped in --- delimiters) that is pushier, includes more trigger phrases, and covers more activation scenarios. The description should be 4-6 sentences and aggressively tell Claude when to use this skill.` :
lessonSlug === "download-and-use" ? `Generate improved test scenarios that are more concrete, more specific to their work, and include sharper failure criteria. Also include a detailed iteration strategy that maps common output problems to specific instruction fixes.` :
`Generate an improved version of their submission that addresses all the feedback points and is deeply personalized to their job context.`}

Respond in JSON format:
{
  "score": <number 0-100>,
  "feedback": "<2-3 paragraphs of specific, constructive feedback. Start with what they did well. Then identify 2-3 specific improvements with concrete suggestions, referencing their actual work context. Use professional, encouraging tone.>",
  "improvedPrompt": "<The improved version as described above. Make it complete, detailed, and production-ready.>"
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
    const result = JSON.parse(cleaned);
    return {
      score: Math.min(100, Math.max(0, result.score)),
      feedback: result.feedback,
      improvedPrompt: result.improvedPrompt,
    };
  } catch {
    throw new Error("Failed to parse AI skill evaluation response");
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
