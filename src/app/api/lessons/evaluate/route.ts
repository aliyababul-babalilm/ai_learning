import { evaluatePrompt, evaluateSkill } from "@/lib/ai";
import { prisma } from "@/lib/db";

const CLAUDE_SKILLS_SLUGS = [
  "what-are-skills",
  "anatomy-of-a-skill",
  "build-your-first-skill",
  "download-and-use",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userPrompt, technique, lessonTitle, userId, lessonSlug } = body;

    if (!userPrompt || !technique || !lessonTitle) {
      return Response.json(
        { error: "userPrompt, technique, and lessonTitle are required" },
        { status: 400 }
      );
    }

    // Get user's job context if available
    let jobContext = "";
    if (userId) {
      const responses = await prisma.userResponse.findMany({
        where: { userId },
      });
      jobContext = responses.map((r: { category: string; answer: string }) => `${r.category}: ${r.answer}`).join("\n");
    }

    // Also get builder state from previous skill lessons for additional context
    let builderContext = "";
    if (userId && lessonSlug && CLAUDE_SKILLS_SLUGS.includes(lessonSlug)) {
      try {
        const progressRecords = await prisma.lessonProgress.findMany({
          where: {
            userId,
            lesson: {
              module: {
                slug: "claude-skills",
              },
            },
          },
          include: {
            lesson: true,
          },
        });

        const contextParts: string[] = [];
        for (const record of progressRecords) {
          const recSlug = record.lesson.slug;
          if (recSlug !== lessonSlug) {
            // Include the improved version or user's original from prior lessons
            const content = record.improvedPrompt || record.userPrompt;
            if (content) {
              contextParts.push(`[Previous lesson "${recSlug}"]: ${content}`);
            }
          }
          // Also check builderState JSON for accumulated work
          if (record.builderState && typeof record.builderState === "object") {
            const state = record.builderState as Record<string, any>;
            for (const key of CLAUDE_SKILLS_SLUGS) {
              if (key !== lessonSlug && state[key]) {
                const data = state[key] as { userPrompt?: string; improved?: string };
                const val = data.improved || data.userPrompt;
                if (val && !contextParts.some(p => p.includes(`"${key}"`))) {
                  contextParts.push(`[Previous lesson "${key}"]: ${val}`);
                }
              }
            }
          }
        }
        if (contextParts.length > 0) {
          builderContext = "\n\nLEARNER'S PREVIOUS WORK IN THIS MODULE:\n" + contextParts.join("\n\n");
        }
      } catch {
        // Builder state may not exist yet — that is fine
      }
    }

    // Also pull in their prompt engineering work for richer context
    const isSkillLesson = lessonSlug && CLAUDE_SKILLS_SLUGS.includes(lessonSlug);
    let promptEngContext = "";
    if (userId && isSkillLesson) {
      try {
        const peRecords = await prisma.lessonProgress.findMany({
          where: {
            userId,
            lesson: {
              module: {
                slug: "prompt-engineering",
              },
            },
            status: "completed",
          },
          include: { lesson: true },
        });
        const peParts: string[] = [];
        for (const rec of peRecords) {
          const content = rec.improvedPrompt || rec.userPrompt;
          if (content) {
            peParts.push(`[Prompt Engineering - "${rec.lesson.title}"]: ${content}`);
          }
        }
        if (peParts.length > 0) {
          promptEngContext = "\n\nLEARNER'S PROMPT ENGINEERING WORK (use these as context for their skill level and domain):\n" + peParts.join("\n\n");
        }
      } catch {
        // Fine if no prompt engineering progress exists
      }
    }

    const fullJobContext = jobContext + builderContext + promptEngContext;

    // Use evaluateSkill for claude-skills module lessons, evaluatePrompt for everything else
    const result = isSkillLesson
      ? await evaluateSkill(userPrompt, lessonSlug, fullJobContext)
      : await evaluatePrompt(userPrompt, technique, lessonTitle, jobContext);

    // Save progress if we have user and lesson info
    if (userId && lessonSlug) {
      const lesson = await prisma.lesson.findUnique({
        where: { slug: lessonSlug },
      });

      if (lesson) {
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId: lesson.id },
          },
          update: {
            userPrompt,
            aiFeedback: result.feedback,
            improvedPrompt: result.improvedPrompt,
            score: result.score,
            status: "completed",
            completedAt: new Date(),
          },
          create: {
            userId,
            lessonId: lesson.id,
            userPrompt,
            aiFeedback: result.feedback,
            improvedPrompt: result.improvedPrompt,
            score: result.score,
            status: "completed",
            completedAt: new Date(),
          },
        });
      }
    }

    return Response.json(result);
  } catch (error) {
    console.error("Failed to evaluate prompt:", error);
    return Response.json(
      { error: "Failed to evaluate prompt" },
      { status: 500 }
    );
  }
}
