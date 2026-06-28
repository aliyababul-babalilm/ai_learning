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

export async function evaluatePrompt(
  userPrompt: string,
  technique: string,
  lessonTitle: string,
  jobContext: string
): Promise<EvaluationResult> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are an expert prompt engineering instructor evaluating a learner's prompt.

The learner is practicing the technique: "${technique}" (Lesson: "${lessonTitle}")
Their job context: ${jobContext || "Not provided"}

Their prompt attempt:
"""
${userPrompt}
"""

Evaluate this prompt and respond in JSON format:
{
  "score": <number 0-100>,
  "feedback": "<specific feedback on what they did well and what to improve regarding the ${technique} technique>",
  "improvedPrompt": "<an improved version of their prompt that demonstrates the ${technique} technique effectively, personalized to their job context>"
}

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
    const result = JSON.parse(content.text);
    return {
      score: Math.min(100, Math.max(0, result.score)),
      feedback: result.feedback,
      improvedPrompt: result.improvedPrompt,
    };
  } catch {
    throw new Error("Failed to parse AI evaluation response");
  }
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
        content: `You are designing onboarding questions for an AI learning platform.

Company: ${companyName}
Industry: ${industry || "Not specified"}
Description: ${companyDescription}

Generate 6-8 questions to understand the learners' job context so the platform can personalize their AI training. The questions should cover:
- Their specific role and daily tasks
- Tools and software they currently use
- Key workflows they want to improve with AI
- Information sources they rely on
- Types of research or analysis they perform
- What they hope to achieve with AI skills

Respond in JSON format as an array:
[
  { "text": "<question text>", "category": "<one of: job_context, tools, workflow, research>" }
]

Make the questions specific to the company's industry and description. Be conversational and professional.
Respond ONLY with the JSON array.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    return JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse AI question generation response");
  }
}
