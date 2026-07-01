export interface LessonStep {
  type: "explain" | "example" | "practice" | "feedback" | "improved";
  title: string;
  content?: string;
  before?: string;
  after?: string;
  explanation?: string;
  instruction?: string;
  placeholder?: string;
}

export interface LessonData {
  moduleSlug: string;
  moduleTitle: string;
  moduleDescription: string;
  moduleOrder: number;
  slug: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export const lessons: LessonData[] = [
  // ─── MODULE 1: PROMPT ENGINEERING (6 lessons) ─────────────────────────────────
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback. Each lesson teaches a technique, shows personalized before/after examples, and lets you practice with your real work scenarios.",
    moduleOrder: 1,
    slug: "set-a-role",
    title: "Set a Role",
    description:
      "Learn how to define a specific persona or role for Claude to dramatically improve response quality and relevance.",
    steps: [
      {
        type: "explain",
        title: "Why Roles Matter",
        content: `One of the most powerful techniques in prompt engineering is telling the AI who it should be. When you set a role, you activate a specific knowledge domain, communication style, and perspective that shapes every part of the response. This is not merely cosmetic — it fundamentally changes the depth, terminology, and decision-making framework Claude uses.

Think of it like this: if you ask a general question to a room full of people, you will get general answers. But if you ask the same question specifically to the financial analyst in the room, you will get a focused, expert-level answer drawn from years of domain experience. The analyst will use industry terminology naturally, consider factors that a generalist would miss, and structure advice the way a real expert would.

When you tell Claude "You are a senior commodities trader with 15 years of experience in energy markets," Claude will draw on patterns from that domain — using the right terminology, considering the right factors, and structuring advice the way an experienced trader would. The role also implicitly sets the audience level: Claude will not over-explain basics to someone who is framed as having deep expertise.`,
      },
      {
        type: "example",
        title: "Role in Action",
        before: `What are some things to consider when looking at oil prices?`,
        after: `You are a senior energy commodities analyst with 15 years of experience covering crude oil markets. You advise institutional trading desks on market positioning.

What are the key fundamental and technical factors I should monitor daily to anticipate short-term crude oil price movements?`,
        explanation: `The "before" prompt gets a generic, surface-level answer that could come from a Wikipedia article. The "after" prompt sets a specific expert role with defined experience, domain, and audience — which causes Claude to respond with the depth, terminology, and actionable detail that a real senior analyst would provide. Notice how the role also implicitly sets the audience level — Claude will not over-explain basics to someone who is framed as working with institutional desks.`,
      },
      {
        type: "practice",
        title: "Write Your Own Role Prompt",
        instruction: `Now it is your turn. Think about a task you do at work. Write a prompt that starts by setting a clear, specific role for Claude. Include:

1. The role title (be specific — not just "expert" but what kind of expert)
2. Years of experience or seniority level
3. The specific domain or industry
4. Who the role typically advises or works with

Then ask a question relevant to your work.`,
        placeholder:
          "You are a [specific role] with [experience] in [domain]...\n\n[Your question here]",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback.",
    moduleOrder: 1,
    slug: "be-specific",
    title: "Be Specific",
    description:
      "Master the art of precise, detailed instructions that eliminate ambiguity and get exactly the output you need.",
    steps: [
      {
        type: "explain",
        title: "The Power of Precision",
        content: `Vague prompts produce vague results. This is the single most common mistake people make with AI — they write prompts the way they would start a casual conversation, leaving Claude to guess what they actually want. Every guess Claude makes is a point where the output might diverge from what you need.

Specificity means answering the implicit questions before Claude has to guess: How long should the output be? What format? What level of detail? Who is the audience? What should be included or excluded? What decisions will be made based on this output? The more of these you answer upfront, the less Claude has to assume — and assumptions are where quality breaks down.

A useful mental model is to imagine you are writing instructions for a brilliant new hire on their first day. They have all the skills, but they do not know your preferences, your context, or your standards yet. The more specific your brief, the closer their first draft will be to what you actually want — saving rounds of revision. In professional settings, this difference between a vague prompt and a specific prompt can mean the difference between an output you can use immediately and one that requires thirty minutes of editing.`,
      },
      {
        type: "example",
        title: "Vague vs. Specific",
        before: `Write me a market summary for natural gas.`,
        after: `Write a 300-word market summary for North American natural gas (Henry Hub) covering today's price action. Include:

1. Current price and daily change (% and absolute)
2. Key drivers behind today's move (weather forecasts, storage data, production changes)
3. Technical levels: nearest support and resistance
4. One-sentence outlook for the coming week

Format as a professional morning briefing suitable for a trading desk. Use bullet points for drivers. Tone should be concise and analytical — no filler language.`,
        explanation: `The vague prompt could produce anything from a Wikipedia-style overview to a 2,000-word essay. The specific prompt defines exactly what "market summary" means: the product, the length, the structure, the content elements, the format, the audience, and the tone. Claude can now deliver something immediately useful without guessing.`,
      },
      {
        type: "practice",
        title: "Make It Specific",
        instruction: `Think of a task you have recently asked AI to help with (or would like to). Write a prompt that is highly specific. Include at minimum:

1. Exact deliverable (what you want produced)
2. Length or scope constraints
3. Format requirements (bullets, paragraphs, table, etc.)
4. Audience or use case
5. What to include and what to exclude
6. Tone or style guidance`,
        placeholder:
          "Write a [specific deliverable] that is [length/scope]...\n\nInclude:\n- ...\n- ...\n\nFormat: ...\nTone: ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback.",
    moduleOrder: 1,
    slug: "provide-context",
    title: "Provide Context",
    description:
      "Learn to give Claude the background information it needs to produce relevant, tailored responses for your specific situation.",
    steps: [
      {
        type: "explain",
        title: "Context is Everything",
        content: `Claude is incredibly capable, but it does not know your specific situation unless you tell it. Context is the bridge between Claude's general knowledge and your particular needs. Without it, even a well-structured prompt will produce generic results that require significant rework before they are useful in your workflow.

There are several types of context you can provide: your industry and company background, the specific problem you are trying to solve, constraints you are working under (budget, timeline, regulatory requirements), what you have already tried, who will consume the output, and what decisions will be made based on it. You can also paste in documents, data, previous analyses, or emails to give Claude even richer context to work with.

The key insight is that context does not have to be long — it has to be relevant. A few well-chosen sentences about your situation can completely transform the output. Think about what information would change the advice you would give if you were the expert. That is the context Claude needs. Professional users who master context-setting consistently report that Claude's outputs go from "interesting but generic" to "immediately actionable" — often eliminating entire rounds of revision.`,
      },
      {
        type: "example",
        title: "Without vs. With Context",
        before: `What are the risks of trading wheat futures?`,
        after: `I am a junior trader at a commodities firm that specializes in agricultural products. Our desk primarily trades soft commodities in the CBOT market. I have been asked to prepare a risk assessment for our wheat futures positions ahead of the USDA WASDE report next week.

Our current position: long 500 contracts of CBOT wheat (ZW), average entry at $6.20/bushel. The position was taken based on drought concerns in the US Southern Plains.

What are the key risks to this position, specifically in the context of the upcoming WASDE report? Include both fundamental and positioning risks.`,
        explanation: `The first prompt gets a textbook answer about general wheat trading risks. The second prompt gives Claude the trader's role, firm type, specific position, rationale, and the upcoming event — so Claude can analyze the actual risks to this specific trade, not just generic risks. The response will address WASDE-specific scenarios, position sizing concerns, and how the drought thesis could be challenged by the report data.`,
      },
      {
        type: "practice",
        title: "Add Your Context",
        instruction: `Write a prompt that includes rich, relevant context about your work situation. Structure it as:

1. Who you are (role, team, company type)
2. What you are working on (specific project or task)
3. Key constraints or parameters
4. What has already been done or decided
5. The specific question or request

Do not worry about length — focus on giving Claude everything it would need to give you advice as good as a colleague who knows your situation intimately.`,
        placeholder:
          "I am a [role] at [company type]. I am currently working on [specific task]...\n\nContext:\n- ...\n- ...\n\n[Your specific question]",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback.",
    moduleOrder: 1,
    slug: "use-examples",
    title: "Use Examples",
    description:
      "Harness few-shot prompting by showing Claude examples of what you want, so it can match your exact style and format.",
    steps: [
      {
        type: "explain",
        title: "Show, Don't Just Tell",
        content: `Few-shot prompting is one of the most reliable techniques in prompt engineering. Instead of just describing what you want, you show Claude examples of the desired output. This is especially powerful for tasks where the format, style, or logic is hard to describe in words but easy to demonstrate.

The technique works because Claude can identify patterns in your examples and apply them to new inputs. If you show it three customer emails and the responses you would write, it learns your tone, length, structure, and decision-making logic all at once — things that would take paragraphs to describe explicitly. This makes few-shot prompting particularly valuable for tasks that involve subjective judgment, house style, or domain-specific conventions.

Best practices for few-shot prompting: use 2-4 examples (more is not always better), make your examples diverse enough to cover edge cases, ensure your examples are consistent with each other (do not show conflicting patterns), and clearly label input vs. output in each example. The format "Input: ... Output: ..." or "Example 1: ... Response: ..." works well. The quality of your examples matters more than quantity — two excellent examples will outperform six mediocre ones.`,
      },
      {
        type: "example",
        title: "Few-Shot in Practice",
        before: `Summarize these market events in a concise way suitable for our daily report.`,
        after: `Summarize market events for our daily trading report. Match the style and format shown in these examples:

Example 1:
Event: EIA weekly natural gas storage report showed a draw of 92 Bcf vs. consensus of 85 Bcf
Summary: "NG storage: -92 Bcf (cons. -85). Bullish surprise drove front-month +3.2% to $2.84. Widening deficit to 5Y avg now at -12.8%."

Example 2:
Event: OPEC+ agreed to extend voluntary production cuts of 2.2 million bpd through Q1 2025
Summary: "OPEC+ extends 2.2M bpd voluntary cuts thru Q1-25. Market reaction muted (Brent +0.4%) as widely expected. Focus shifts to compliance monitoring."

Now summarize this event:
Event: US weekly crude oil inventories fell by 4.2 million barrels, exceeding analyst expectations of a 1.8 million barrel draw, while gasoline stocks rose by 2.1 million barrels.`,
        explanation: `Without examples, Claude would write a summary in its default style — probably too long, too formal, and not formatted for a trading desk. The two examples show Claude exactly what "concise" means here: the specific abbreviation conventions, the data points to highlight, the parenthetical format for consensus, and the one-sentence analytical comment at the end. Claude will now match this pattern precisely.`,
      },
      {
        type: "practice",
        title: "Create a Few-Shot Prompt",
        instruction: `Think of a task where you would want consistent formatting or style — something you do repeatedly at work. Create a prompt that includes 2-3 examples of the input and desired output, then provide a new input for Claude to process in the same way.

Tips:
- Use clear labels (Input/Output, Example/Response, etc.)
- Make examples realistic and representative
- Show the exact format, length, and style you want
- End with the new item for Claude to process`,
        placeholder:
          "I need you to [task]. Here are examples of the format I want:\n\nExample 1:\nInput: ...\nOutput: ...\n\nExample 2:\nInput: ...\nOutput: ...\n\nNow process this:\nInput: ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback.",
    moduleOrder: 1,
    slug: "chain-of-thought",
    title: "Chain of Thought",
    description:
      "Guide Claude through step-by-step reasoning for complex analysis, calculations, and multi-factor decisions.",
    steps: [
      {
        type: "explain",
        title: "Think Step by Step",
        content: `Chain of thought prompting asks Claude to show its reasoning process rather than jumping straight to a conclusion. This dramatically improves accuracy for complex tasks involving math, logic, multi-step analysis, or decisions with many factors. It is arguably the most important technique for any professional who needs to trust Claude's analysis.

Why does this work? When Claude "thinks out loud," each step builds on the previous one, creating a logical chain that is more likely to arrive at the correct answer. Without chain of thought, Claude might skip steps, make implicit assumptions, or take mental shortcuts that lead to errors — just like humans do when they try to solve complex problems in their head. The explicit reasoning also gives you an audit trail: you can verify each step independently.

You can invoke chain of thought in several ways: explicitly ask Claude to "think step by step" or "walk through your reasoning," structure your prompt with numbered steps Claude should follow, or ask Claude to consider each factor separately before reaching a conclusion. This is especially valuable for financial analysis, risk assessment, troubleshooting, and any task where you need to trust — and audit — the reasoning, not just the answer.`,
      },
      {
        type: "example",
        title: "Direct Answer vs. Chain of Thought",
        before: `Should we increase our copper position given current market conditions?`,
        after: `I need to decide whether to increase our copper futures position. Walk me through the analysis step by step:

Step 1: Assess the current supply picture — global mine production, inventory levels at LME/COMEX/SHFE warehouses, and any supply disruptions.

Step 2: Evaluate demand factors — Chinese manufacturing PMI trends, global EV production ramp, construction activity in key markets.

Step 3: Analyze the technical picture — price trend, key support/resistance levels, positioning data from COT reports.

Step 4: Consider macro factors — USD strength, interest rate expectations, recession probability.

Step 5: Identify key risks to a long position.

Step 6: Based on steps 1-5, provide your recommendation with confidence level and suggested position sizing approach.

For each step, clearly state what the data suggests (bullish, bearish, or neutral for copper) before moving to the next.`,
        explanation: `The first prompt invites a quick opinion. The second prompt forces systematic analysis — each factor is considered independently before a conclusion is drawn. This produces a more thorough, balanced analysis where you can see exactly how the recommendation was reached and challenge any individual step. It also prevents Claude from anchoring on one factor and ignoring others.`,
      },
      {
        type: "practice",
        title: "Build a Reasoning Chain",
        instruction: `Choose a complex decision or analysis task from your work. Write a prompt that breaks it into explicit reasoning steps. Each step should:

1. Focus on one factor or consideration
2. Ask Claude to state its assessment for that step
3. Build logically toward a conclusion

Aim for 4-6 steps that cover the key dimensions of the decision. End with a step that synthesizes all previous steps into a recommendation.`,
        placeholder:
          "I need to [complex decision]. Walk through this analysis step by step:\n\nStep 1: [First factor to analyze]\nStep 2: [Second factor]\n...\nFinal Step: Based on the above, [synthesize and recommend]",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleDescription:
      "Master six essential prompt engineering techniques with hands-on practice and AI-powered feedback.",
    moduleOrder: 1,
    slug: "output-format",
    title: "Output Format",
    description:
      "Control exactly how Claude structures its response — tables, bullet points, JSON, reports, and more.",
    steps: [
      {
        type: "explain",
        title: "Structure Your Output",
        content: `The format of Claude's response matters as much as its content. A brilliant analysis buried in a wall of text is less useful than a good analysis presented in a clean, scannable format. Output format instructions tell Claude exactly how to structure its response so it is immediately usable in your workflow — no reformatting required.

Common format specifications include: bullet points vs. paragraphs, tables for comparative data, numbered lists for sequential items, headers and sections for longer documents, JSON or structured data for programmatic use, specific templates you need to fill (email drafts, report sections, meeting notes). The format should match how the output will actually be consumed.

You can also control meta-aspects of the format: length constraints ("keep it under 200 words"), what to include and exclude ("no introductory preamble, start directly with the analysis"), tone markers ("professional but conversational"), and conditional formatting ("if the answer is complex, use a table; if simple, use a one-liner"). Being explicit about format saves you from reformatting Claude's output every time and makes it immediately usable in your workflow. For professionals, this is often the difference between an output you can paste directly into a report and one that needs twenty minutes of editing.`,
      },
      {
        type: "example",
        title: "Unformatted vs. Formatted Output",
        before: `Compare WTI and Brent crude oil for our portfolio.`,
        after: `Compare WTI and Brent crude oil as potential additions to our commodities portfolio. Present your analysis as follows:

**Format: Comparison table followed by recommendation**

Table columns: Factor | WTI | Brent | Advantage
Table rows should cover: Liquidity, Benchmark relevance, Storage/delivery logistics, Spread to physical, Geopolitical risk exposure, Seasonal patterns, Options market depth

Below the table, provide:
1. **Bottom line** (2 sentences max): Which is better suited for our portfolio and why
2. **Key risk**: The single biggest risk factor for each
3. **Suggested allocation**: Percentage split if holding both

Do not include general background on what crude oil is. Assume the reader is a professional trader.`,
        explanation: `The vague prompt would produce a lengthy essay comparing the two. The formatted prompt specifies exactly the structure: a comparison table with defined columns and rows, followed by three specific sections with length constraints. The output is immediately usable — it could go straight into a presentation or research note without reformatting. The exclusion instruction ("Do not include general background") prevents unnecessary filler.`,
      },
      {
        type: "practice",
        title: "Design Your Output Format",
        instruction: `Think about a type of output you regularly need at work (a report, email, analysis, summary, etc.). Write a prompt that specifies the exact output format you want. Include:

1. The overall structure (sections, tables, lists)
2. Specific elements to include in each section
3. Length or scope constraints
4. What to exclude or skip
5. Any formatting conventions (bold headers, bullet styles, etc.)

The goal is a prompt where Claude's output could be used as-is, without reformatting.`,
        placeholder:
          "[Your request]\n\nFormat the response as:\n1. [Section 1]: ...\n2. [Section 2]: ...\n\nConstraints:\n- Length: ...\n- Exclude: ...\n- Style: ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },

  // ─── MODULE 2: CLAUDE SKILLS (4 lessons) ──────────────────────────────────────
  {
    moduleSlug: "claude-skills",
    moduleTitle: "Claude Skills",
    moduleDescription:
      "Understand what Claude Skills are, how they work, and build your first reusable skill file that you can download and use in Claude Desktop.",
    moduleOrder: 2,
    slug: "what-are-skills",
    title: "What Are Claude Skills?",
    description:
      "Understand skills as reusable prompt templates — like macros for AI — that give you consistency, speed, and shareability.",
    steps: [
      {
        type: "explain",
        title: "Skills: Reusable AI Templates",
        content: `A Claude Skill is a reusable set of instructions that you do not have to write every time you want Claude to perform a specific task. Think of skills as macros for AI — pre-written prompt templates that encapsulate your expertise, preferences, and workflow into a format Claude can execute consistently on demand.

Why do skills matter? Without skills, you find yourself writing the same detailed prompts over and over. If you produce a daily market brief every morning, you might spend five minutes each day crafting the prompt: setting the role, specifying the format, listing what to include, defining the tone. A skill captures all of that once, so your daily workflow becomes: open Claude, trigger the skill, paste in the day's data, and get a perfectly formatted output in seconds.

Skills also solve the consistency problem. When you write prompts manually, the quality varies day to day depending on how much effort you put into the prompt. A skill ensures that the output quality is consistently high because the underlying instructions never degrade. Skills can also be shared across teams — if one analyst builds a great market brief skill, the entire desk can use it, creating organizational leverage from individual expertise.`,
      },
      {
        type: "example",
        title: "Manual vs. Skill-Based Workflow",
        before: `Every morning, I open Claude and type something like:
"Give me a summary of what happened in oil markets yesterday. Include prices, key news, and what to watch today."

Some days I remember to add formatting details, other days I don't. The output quality varies.`,
        after: `With a "Market Morning Brief" skill active, my workflow becomes:

1. Open Claude Desktop, select the "Market Morning Brief" skill
2. Paste in overnight headlines or data
3. Claude automatically produces a structured brief with:
   - Price table (all tracked commodities)
   - Top 3 drivers with market impact assessment
   - Technical levels for key positions
   - Today's calendar events
   - Risk flags requiring attention

Same quality every time. Takes 30 seconds instead of 5 minutes. Any analyst on the desk can use it.`,
        explanation: `The manual approach relies on the user remembering to include all the right details every time. The skill-based approach front-loads that effort once, then delivers consistent, comprehensive output every time it is triggered. The time savings compound: 5 minutes saved per day across 250 trading days is over 20 hours per year — from a single skill.`,
      },
      {
        type: "practice",
        title: "Define Your Skill Need",
        instruction: `Before we build your skill, let's understand exactly what you need. Answer each question thoughtfully — your answers will shape the skill we build together.

1. **What task do you want to automate?** Describe the specific task in detail. What do you do, step by step?

2. **How often do you perform this task?** (Daily / Weekly / Ad hoc)

3. **What inputs does this task require?** What data, documents, or context do you need to start? Be specific — name the exact sources, data types, or files.

4. **What is your desired output format?** Choose one or describe:
   - A structured report (with sections and analysis)
   - A dashboard or table
   - An email or communication draft
   - A decision framework (go/no-go, buy/sell)
   - A data extraction or summary
   - Other (describe)

5. **What does a GREAT output look like?** Describe the ideal result. If you have an example of a good output you have produced manually, describe its structure.

6. **What are the edge cases?** What happens when data is missing, unusual, or contradictory? How should the skill handle ambiguity?

7. **Who is the audience?** Who will read or act on this output? (Your team, management, clients, yourself)

8. **What quality standard matters most?** Accuracy? Speed? Comprehensiveness? Professional tone? Pick the top priority.`,
        placeholder:
          "1. Task to automate:\n\n2. Frequency:\n\n3. Required inputs:\n\n4. Desired output format:\n\n5. What a great output looks like:\n\n6. Edge cases:\n\n7. Audience:\n\n8. Top quality priority:",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-skills",
    moduleTitle: "Claude Skills",
    moduleDescription:
      "Understand what Claude Skills are, how they work, and build your first reusable skill file that you can download and use in Claude Desktop.",
    moduleOrder: 2,
    slug: "anatomy-of-a-skill",
    title: "Anatomy of a Skill",
    description:
      "Master the .skill file format: YAML frontmatter, triggering descriptions, and instruction body that powers everything.",
    steps: [
      {
        type: "explain",
        title: "Inside a Skill File",
        content: `A Claude skill file has two parts: the YAML frontmatter (metadata) and the instruction body (the actual prompt). Understanding each part and how they work together is the difference between a skill that gathers dust and one that becomes indispensable.

The YAML frontmatter sits between two lines of triple dashes (---) at the top of the file. It contains two critical fields: name and description. The name is a short identifier — kebab-case like "market-morning-brief" works best. The description is the most important field in the entire skill file because it determines WHEN Claude activates the skill. Claude reads this description to decide whether an incoming message should trigger this skill. You need to make it "pushy" — explicitly list the trigger phrases, use cases, and situations where the skill should activate. Think of it like writing instructions for a very literal assistant: if you do not tell them when to jump in, they will stand quietly in the corner.

The instruction body is everything after the closing --- of the frontmatter. It is written in markdown and contains the actual prompt Claude will follow. This is where all six prompt engineering techniques you learned come together: role setting, specificity, context, examples, chain of thought, and output formatting. The body should read like a detailed brief for a brilliant new hire — covering what to do, how to do it, what quality looks like, and what to do when things get ambiguous.

One important principle: keep the skill file under 500 lines. If you need to reference large datasets, industry frameworks, or extensive examples, use separate reference files that Claude can access from your project. The skill file itself should be the operating manual, not the encyclopedia.`,
      },
      {
        type: "example",
        title: "Real Skill File with Proper Frontmatter",
        before: `I just write whatever prompt I feel like each time. Sometimes I remember the formatting, sometimes I don't.`,
        after: `---
name: market-morning-brief
description: >
  Generate a structured daily trading morning brief from overnight market data
  and headlines. Use this skill whenever the user mentions "morning brief",
  "market update", "overnight summary", or provides market data at the start
  of the trading day. Also trigger when the user asks for a daily market recap
  or wants to know what happened overnight in their tracked commodities.
  Activate for any request that involves summarizing overnight price action,
  key market drivers, or preparing a trading desk for the day ahead.
---

# Market Morning Brief

You are a senior market analyst preparing the daily morning brief for a
commodities trading desk specializing in energy and metals.

## Your Task

Given the overnight data and headlines provided by the user, produce a
structured brief that the trading desk can scan in under 2 minutes and
act on immediately.

## Analysis Process

1. First, identify the single most important overnight development and lead
   with that — do not bury the lead in a list
2. Assess each commodity in our coverage universe for material price moves
   (>1% or unusual volume)
3. Cross-reference price moves against news flow to identify causation vs.
   correlation
4. Check for any technical level breaches that change the short-term outlook
5. Flag any upcoming events in the next 24 hours that require position
   awareness

## Output Format

### LEAD STORY
One paragraph on the most impactful overnight development. Why it matters.

### PRICE TABLE
| Commodity | Close | Change | % Change | Volume vs. 20D Avg |
(Include: WTI, Brent, Henry Hub NG, Gold, Copper, Silver)

### KEY DRIVERS (top 3, ranked by market impact)
For each: **Headline** — 2-sentence analysis — directional impact tag

### TECHNICAL LEVELS
For actively traded commodities: support | resistance | trend direction

### TODAY'S CALENDAR
Time | Event | Expected Impact (table format)

### RISK FLAGS
Anything unusual: position concentration, unusual volume, correlation breaks

## Rules
- Total: 400-600 words
- Tone: direct, analytical, zero filler — every sentence must add information
- Bold any data point that is a significant surprise vs. consensus
- Use standard abbreviations (WTI, HH, NG, bpd, Bcf)
- If data is missing for a commodity, note it explicitly — do not guess prices`,
        explanation: `Notice how the description field is deliberately "pushy" — it lists six different trigger phrases and situations. This ensures Claude activates the skill whenever the user's request is even loosely related. The instruction body uses role setting (senior market analyst), chain of thought (the five-step analysis process), output formatting (exact sections with format specs), and constraints (the rules section). This is a complete, production-ready skill file.`,
      },
      {
        type: "practice",
        title: "Draft Your Skill's Identity",
        instruction: `Now draft the NAME and DESCRIPTION for your skill — the YAML frontmatter that determines when Claude activates it.

The description is the most important part of your entire skill file. It needs to be "pushy" — explicitly tell Claude when to use this skill. Include:

1. **Name** (kebab-case): A short, descriptive identifier for your skill

2. **Description** (this is the critical part): Write 3-5 sentences that cover:
   - What the skill does (one clear sentence)
   - Specific trigger phrases: List the exact words or phrases a user might say that should activate this skill. Think about how you and your colleagues actually talk about this task.
   - Situations where it should activate: Describe the contexts or scenarios
   - Edge triggers: What related requests should also trigger this skill?

Format your answer as the actual YAML frontmatter:

\`\`\`
---
name: your-skill-name
description: >
  [Your detailed, pushy description here. Make it 3-5 sentences.
  Include trigger phrases in quotes. Describe situations.
  Be explicit about when Claude should use this skill.]
---
\`\`\`

Remember: if Claude does not know when to use your skill, it will never use it. Be aggressive with your trigger conditions.`,
        placeholder:
          "---\nname: your-skill-name\ndescription: >\n  [What it does]. Use this skill whenever the user mentions\n  \"[trigger phrase 1]\", \"[trigger phrase 2]\", or \"[trigger phrase 3]\".\n  Also trigger when [situation 1] or [situation 2].\n  Activate for any request involving [related topic].\n---",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-skills",
    moduleTitle: "Claude Skills",
    moduleDescription:
      "Understand what Claude Skills are, how they work, and build your first reusable skill file that you can download and use in Claude Desktop.",
    moduleOrder: 2,
    slug: "build-your-first-skill",
    title: "Build Your First Skill",
    description:
      "Write a complete, production-ready skill file that combines all six prompt engineering techniques into a reusable automation tool.",
    steps: [
      {
        type: "explain",
        title: "Writing Instructions That Actually Work",
        content: `Building a great skill is about writing instructions that produce consistently excellent output across different inputs. This is where everything you learned in prompt engineering comes together — not as individual techniques, but as an integrated system.

The most important principle is: specify the analysis framework, not just the output format. Many people write skills that say "analyze this data and produce a report." That is like telling a new hire "figure it out." Instead, spell out the exact reasoning process: "First, check X. Then compare Y against Z. If A is true, emphasize B. If A is false, flag C." When Claude has a clear analytical process to follow, the output is consistent and thorough every time. This is Chain of Thought (Technique 5) applied at the skill level.

The second principle is: explain the WHY behind your rules. Do not just write "NEVER include disclaimers." Instead write "Do not include disclaimers because this output goes directly to senior traders who find them patronizing and they reduce trust in the analysis." When Claude understands the reasoning, it can apply the spirit of the rule to edge cases it has never seen. Rules without reasons produce brittle skills that break on unusual inputs.

The third principle is: handle edge cases explicitly. What happens when data is missing? When two data points contradict each other? When the input is ambiguous? If you do not tell Claude what to do in these situations, it will guess — and its guesses may not match your professional judgment. Write out the edge cases and the correct response for each.

The fourth principle is: make the output specification ruthlessly precise. Do not say "provide a summary." Say "provide a 3-sentence executive summary where sentence 1 states the conclusion, sentence 2 gives the key supporting evidence, and sentence 3 states the primary risk." Precision in output specs eliminates the need to reformat or edit, which is where most time savings come from.

Finally, make skills general enough to work across different inputs but specific enough to be genuinely useful. A skill that tries to handle everything handles nothing well. Target the 80% case — the typical scenario you encounter most often — and let the user manually adjust for the remaining 20%.`,
      },
      {
        type: "example",
        title: "A Complete Production-Quality Skill",
        before: `---
name: analyze-data
description: Analyze data the user provides.
---

Analyze the data and give me insights. Be thorough and professional.`,
        after: `---
name: deal-screening-memo
description: >
  Generate a structured deal screening memo for a potential M&A target or
  investment opportunity. Use this skill whenever the user mentions "deal
  screening", "target analysis", "investment memo", "should we look at this
  company", or provides company financials for initial evaluation. Also
  trigger when the user asks to "screen this deal", "run a quick analysis
  on [company]", or "prepare a one-pager" on a potential target.
---

# Deal Screening Memo Generator

You are a VP-level M&A analyst at a bulge-bracket investment bank. You
specialize in rapid initial assessments of potential acquisition targets
or investment opportunities. Your screening memos are known for being
concise, analytically rigorous, and actionable — partners trust your
initial reads on deals because you consistently identify both the
opportunity and the risks others miss.

## Input Expectations

The user will provide some or all of the following:
- Company name and basic description
- Available financial data (revenue, EBITDA, margins, growth rates)
- Industry or sector context
- Strategic rationale for why this target is being considered
- Any specific concerns or questions to address

If financial data is incomplete, work with what is available and explicitly
note what is missing and why it matters for the assessment.

## Analysis Framework

Complete each step in order. For each step, state your assessment clearly
before moving to the next.

### Step 1: Business Quality Assessment
- What does this company actually do? Summarize in 2 sentences.
- What is the competitive moat, if any? (brand, scale, switching costs,
  network effects, regulatory, IP)
- Is this a growing market or a declining one? What is the market growth rate?
- Assess business quality as: Premium / Above Average / Average / Below Average
- **Why this matters**: Business quality determines the multiple we should
  pay and the risk of value destruction post-acquisition.

### Step 2: Financial Profile
- Revenue scale and growth trajectory (3-year CAGR if available)
- Margin profile: gross margin, EBITDA margin, and trend direction
- Capital intensity: capex as % of revenue, working capital needs
- Cash conversion: how much EBITDA actually converts to free cash flow?
- Red flags: declining margins, revenue concentration, unusual items
- Present as a summary table where possible.

### Step 3: Valuation Context
- What are comparable public companies trading at? (EV/EBITDA, EV/Revenue)
- What have recent transactions in this space been priced at?
- Based on the financials provided, what is the implied valuation range?
- Is this likely to be a competitive process? (affects price expectations)
- **Note**: If insufficient data for a proper valuation, state what
  additional data would be needed and provide a directional estimate only.

### Step 4: Strategic Fit Assessment
- What is the strategic rationale? (revenue synergies, cost synergies,
  capability acquisition, market entry, defensive)
- Quantify synergies where possible, even if directional
- Integration complexity: Low / Medium / High, and why
- What could go wrong in integration?

### Step 5: Key Risks (Top 3)
For each risk:
- Risk description (one sentence)
- Probability: Low / Medium / High
- Impact if materialized: Low / Medium / High
- Mitigant: What could reduce this risk?

### Step 6: Verdict
- Overall attractiveness: Pursue / Explore Further / Pass
- Confidence level in this assessment: High / Medium / Low (based on
  data completeness)
- Recommended next steps: What 2-3 things should we do to advance or
  kill this opportunity?
- One sentence "elevator pitch" summary for a partner meeting

## Output Format
- Total length: 500-800 words
- Use headers for each section (## format)
- Use tables for financial data and risk matrices
- Bold key conclusions and numbers
- Tone: confident, direct, analytically precise — this is for senior
  bankers who will scan it in 3 minutes
- No hedging language like "it could potentially be" — take a position

## Constraints
- If data is missing, say exactly what is missing and how it affects
  confidence — do not fabricate numbers
- Do not include generic industry overviews — assume the reader knows
  the sector
- Do not recommend "further due diligence" without specifying exactly
  what due diligence items and why they matter for this specific deal
- Always include at least one non-obvious risk that a junior analyst
  might miss`,
        explanation: `This skill is 60+ lines of real instructions because every line serves a purpose. The analysis framework (Steps 1-6) ensures consistent, thorough coverage regardless of who triggers the skill. Each step includes what to analyze AND why it matters. The output format is precise enough that the result can go directly into a partner presentation. The constraints prevent common failure modes — fabricated data, generic filler, and vague next steps. Compare this to the "analyze data and give insights" version: which one would you trust for a real deal?`,
      },
      {
        type: "practice",
        title: "Build Your Complete Skill",
        instruction: `Now write your COMPLETE skill file. This should be production-ready — something you will actually use starting tomorrow.

Your skill file must include:

**YAML Header:**
---
name: [your-skill-name]
description: >
  [What it does. When to trigger it. Include specific phrases that should activate it. Be "pushy" — make sure Claude knows when to use this skill.]
---

**Instructions body — include ALL of these:**

1. **Role**: Set the expert role Claude should adopt. Be specific about seniority, domain, and what makes this role's perspective valuable. (This is Technique 1 from prompt engineering — Set a Role)

2. **Input specification**: Exactly what data or context the user will provide. Be specific about format. What happens when the input is incomplete?

3. **Analysis framework**: The step-by-step process Claude should follow. Number each step. For each step, explain:
   - What to analyze
   - What data to reference
   - What conclusion to draw before moving to the next step
   - WHY this step matters (so Claude understands the reasoning, not just the rule)
   (This is Technique 5: Chain of Thought)

4. **Output specification**:
   - Exact sections and their order
   - Format for each section (table, bullets, paragraphs)
   - Length guidelines for the overall output and key sections
   - Tone and audience
   - What to bold, what to emphasize
   (This is Technique 6: Output Format)

5. **Edge cases and constraints**:
   - What to do when data is missing
   - What NOT to do (and why — explain the reasoning behind constraints)
   - Quality checks before finalizing

6. **Example output structure** (optional but powerful):
   Show Claude what a perfect output looks like for this skill. Even a skeleton with section headers and placeholder content helps enormously.
   (This is Technique 4: Use Examples)

Write the ENTIRE skill file. Every line matters — this is your first real AI automation tool. Aim for 40-80 lines of substantive instructions. Short skills produce shallow output.`,
        placeholder:
          "---\nname: your-skill-name\ndescription: >\n  [Detailed, pushy description with trigger phrases]\n---\n\n# [Skill Title]\n\nYou are a [specific role]...\n\n## Input Expectations\nThe user will provide...\n\n## Analysis Framework\n\n### Step 1: [First analysis step]\n...\n\n### Step 2: [Second analysis step]\n...\n\n## Output Format\n- Total length: ...\n- Sections: ...\n- Tone: ...\n\n## Constraints\n- ...\n- ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-skills",
    moduleTitle: "Claude Skills",
    moduleDescription:
      "Understand what Claude Skills are, how they work, and build your first reusable skill file that you can download and use in Claude Desktop.",
    moduleOrder: 2,
    slug: "download-and-use",
    title: "Download & Use Your Skill",
    description:
      "Install your skill in Claude Desktop, test it with real data, and learn the iteration cycle that makes skills production-grade.",
    steps: [
      {
        type: "explain",
        title: "From File to Production Tool",
        content: `You have built a complete skill file. Now comes the part that separates a training exercise from a real productivity tool: installation, testing, and iteration.

To install your skill in Claude Desktop, you save it as a markdown file (which this platform will generate for you) and place it in your Claude project. The skill file goes into your project's knowledge or instructions — Claude Desktop reads it as persistent context that shapes every conversation in that project. Once installed, the skill activates automatically whenever your message matches the trigger conditions you wrote in the description field.

But installation is only the beginning. The real value comes from TESTING your skill against real data. The first time you run a new skill, you will almost certainly find gaps: a section that is too verbose, an edge case you did not anticipate, a formatting choice that does not work as well in practice as it seemed on paper. This is normal and expected — even experienced skill builders iterate 3-5 times before a skill reaches production quality.

The concept of "eval" is central to building reliable skills. An eval is a structured test: you run the same skill against multiple different inputs and evaluate whether the output consistently meets your standards. A good eval set has three types of inputs: a normal case (the typical 80% scenario), an edge case (missing data, unusual values, contradictory information), and a stress test (complex input with lots of data). If your skill handles all three well, it is ready for daily use.

When iterating, focus on the INSTRUCTIONS, not just the output. If the output has a problem, trace it back to which instruction is missing, vague, or misleading. Add specificity where Claude is guessing, add constraints where Claude is including unwanted content, and add examples where Claude is getting the format wrong.

Finally, sharing skills with your team multiplies their value. A skill that saves you 20 minutes per day saves your five-person team 100 minutes per day collectively. Create a shared folder or repository where approved skills live, and establish a simple review process so the team's best practices get encoded into skills over time.`,
      },
      {
        type: "example",
        title: "Testing and Iterating a Skill",
        before: `I built my skill and I'll just start using it. If something is off, I'll fix it eventually.`,
        after: `SKILL TESTING PLAN: Market Morning Brief

**Test 1 — Normal Case:**
Input: Standard overnight session with moderate price moves, 2-3 news items, typical volume
Expected output: Clean brief with all sections filled, 400-500 words, actionable
Failure criteria: Missing a section, inventing price data, exceeding 700 words

**Test 2 — Edge Case:**
Input: Very quiet overnight session with minimal price movement and no major news
Expected output: Brief that honestly states "quiet session" rather than manufacturing drama, shortened appropriately
Failure criteria: Fabricating significant moves, padding with generic commentary

**Test 3 — Stress Test:**
Input: Major geopolitical event overnight (e.g., OPEC surprise cut) with large moves across all commodities, multiple conflicting headlines, high volume
Expected output: Prioritized brief that leads with the main story, does not get lost in details, clearly separates confirmed facts from market speculation
Failure criteria: Burying the lead, treating minor moves as equal to the main event, exceeding 800 words

**Iteration Log:**
- v1: Output was too long (800+ words on normal case). Added "Total: 400-600 words" constraint.
- v2: Was not leading with the most important story. Added "Lead Story" section at top.
- v3: Fabricated specific prices when I did not provide them. Added "do not guess prices" constraint.
- v4: Production-ready. Consistent quality across all three test types.`,
        explanation: `Testing is not optional — it is how you find the gaps your instructions did not cover. The three test types (normal, edge, stress) exercise different aspects of the skill. The iteration log shows how each test failure led to a specific instruction improvement. After 3-4 iterations, the skill consistently produces usable output. This disciplined approach is what separates a hobby prompt from a production automation tool.`,
      },
      {
        type: "practice",
        title: "Design Your Test Plan",
        instruction: `Now let's prepare your skill for production use. Write 3 test scenarios for your skill — realistic inputs that test different aspects:

1. **Normal case**: A typical, straightforward input that represents 80% of your usage. Describe:
   - The specific input you would provide (be concrete — what data, what format, what context)
   - What you expect the output to look like (sections, length, key content)
   - What would make you say "this is wrong" (your failure criteria)

2. **Edge case**: An unusual input — missing data, contradictory information, or an unusual scenario. Describe:
   - The specific input (what makes it unusual or tricky)
   - How you expect the skill to handle the ambiguity or missing information
   - What would make you say "this is wrong"

3. **Stress test**: A complex input with lots of data that tests whether your skill handles volume and complexity well. Describe:
   - The specific input (what makes it complex)
   - How you expect the skill to prioritize and organize the large amount of information
   - What would make you say "this is wrong"

For each test, be as concrete as possible. Use real examples from your work if you can — the more realistic the test, the more useful it is for identifying gaps in your skill.

After you write these test scenarios, also write what you would CHANGE in your skill instructions if you discovered the output was not meeting your standards. What types of instruction additions tend to fix common problems?`,
        placeholder:
          "TEST 1 — NORMAL CASE:\nInput: [describe a typical, realistic input]\nExpected output: [what good looks like]\nFailure criteria: [what would be wrong]\n\nTEST 2 — EDGE CASE:\nInput: [describe the unusual scenario]\nExpected output: [how it should handle ambiguity]\nFailure criteria: [what would be wrong]\n\nTEST 3 — STRESS TEST:\nInput: [describe the complex scenario]\nExpected output: [how it should prioritize]\nFailure criteria: [what would be wrong]\n\nITERATION STRATEGY:\nIf output is too long: [what I would change]\nIf output misses key info: [what I would change]\nIf output format is wrong: [what I would change]",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },

  // ─── MODULE 3: CLAUDE PROJECTS (5 lessons) ────────────────────────────────────
  {
    moduleSlug: "claude-projects",
    moduleTitle: "Claude Projects",
    moduleDescription:
      "Set up Claude Desktop as your personal AI workspace with projects, custom instructions, organized conversations, artifacts, and a complete productivity blueprint.",
    moduleOrder: 3,
    slug: "create-project",
    title: "Create Your First Project",
    description:
      "Based on your role, AI suggests projects you should create and guides you through setting up your first one.",
    steps: [
      {
        type: "explain",
        title: "What Are Claude Projects?",
        content: `Claude Projects are persistent workspaces where you can set custom instructions that apply to every conversation within that project. Think of a project as a pre-configured environment — instead of repeating your role, context, and preferences every time you start a new chat, you set them once and they are always active. This transforms Claude from a generic chatbot into a specialized assistant that knows your domain.

For professionals, this is transformative. You might create a "Daily Market Research" project where Claude always knows your trading desk's focus commodities, preferred report format, and data sources. Or a "Client Communications" project where Claude understands your firm's tone, compliance requirements, and client terminology. Every conversation within a project inherits this context automatically.

Each project maintains its own set of instructions, knowledge files, and conversation history. This means you can switch between different work contexts quickly without re-establishing context each time. The key to a great project is thoughtful custom instructions — which we will cover in the next lesson. Most professionals find that 3-5 well-designed projects cover 90% of their AI usage, with each project serving a distinct workflow.`,
      },
      {
        type: "example",
        title: "Project Setup Example",
        before: `I will just use the default Claude chat for everything.`,
        after: `Recommended projects for a commodities trader:

1. "Daily Market Research"
   Purpose: Morning research workflow for energy commodities desk
   Custom Instructions: Role as research assistant, market focus, output preferences

2. "Trade Idea Development"
   Purpose: Developing and stress-testing trade theses
   Custom Instructions: Analytical framework, risk criteria, position sizing guidelines

3. "Client Reporting"
   Purpose: Drafting client-facing reports and communications
   Custom Instructions: Compliance guidelines, firm tone, report templates

4. "Tools & Automation"
   Purpose: Building scripts, Excel formulas, data analysis
   Custom Instructions: Tech stack context, coding preferences, data formats`,
        explanation: `Instead of using one generic chat for everything, organizing by workflow means each project is pre-loaded with the right context. A trader opening "Daily Market Research" gets Claude that already knows their commodities, preferred format, and data sources. Opening "Client Reporting" gets Claude that already knows compliance rules and firm tone. This eliminates minutes of context-setting on every interaction.`,
      },
      {
        type: "practice",
        title: "Plan Your First Project",
        instruction: `Design your first Claude project. Write out:

1. **Project Name**: A clear, descriptive name
2. **Purpose**: What you will use this project for (1-2 sentences)
3. **Key workflows**: The 3-4 main tasks you will perform in this project
4. **Custom Instructions draft**: What should Claude always know when working in this project? Include your role, key context, preferred output style, and any rules or constraints.

Write this as though you are configuring it in Claude Desktop right now.`,
        placeholder:
          "Project Name: ...\nPurpose: ...\n\nKey workflows:\n1. ...\n2. ...\n3. ...\n\nCustom Instructions:\n\"You are... I work in... Always...\"",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-projects",
    moduleTitle: "Claude Projects",
    moduleDescription:
      "Set up Claude Desktop as your personal AI workspace with projects, custom instructions, organized conversations, artifacts, and a complete productivity blueprint.",
    moduleOrder: 3,
    slug: "custom-instructions",
    title: "Write Custom Instructions",
    description:
      "Craft effective project-level instructions covering identity, context, behavior, and constraints — the four pillars.",
    steps: [
      {
        type: "explain",
        title: "The Four Pillars of Custom Instructions",
        content: `Custom instructions are the persistent context that shapes every conversation in a Claude project. Great custom instructions cover four areas — what we call the four pillars — that together create a comprehensive operating framework for Claude within your project.

The first pillar is IDENTITY: who Claude should be in this project. This sets the domain expertise, seniority level, and perspective. The second pillar is CONTEXT: what Claude should know about you, your team, your company, and your work. This is the background information that would take you five minutes to explain at the start of every conversation. The third pillar is BEHAVIOR: how Claude should respond by default — output length, format preferences, level of detail, tone, and what to include or exclude. The fourth pillar is CONSTRAINTS: what Claude should avoid or be careful about — compliance rules, topics to defer on, limitations to acknowledge, and quality standards.

A common mistake is making custom instructions too long or trying to cover every scenario. Start with 3-5 key instructions per pillar that address your most frequent needs. You can always refine them as you use the project. Focus on the things you find yourself repeating in every conversation — those are the perfect candidates for custom instructions. The best custom instructions are specific enough to be useful but general enough to apply across conversations within the project.`,
      },
      {
        type: "example",
        title: "Weak vs. Strong Custom Instructions",
        before: `Be helpful and give good answers about commodities trading.`,
        after: `IDENTITY:
- You are a research assistant for a commodities trading desk at a mid-size trading firm
- Act as a knowledgeable junior analyst supporting senior traders
- You have deep knowledge of energy and metals markets

CONTEXT:
- Our primary markets: WTI crude, Brent crude, Henry Hub natural gas, gold, copper
- We trade primarily on NYMEX/COMEX with some ICE exposure
- Our research sources include: S&P Global Platts, EIA data, CFTC COT reports, Bloomberg
- Our trading hours are 6:00 AM - 5:00 PM EST

BEHAVIOR:
- Default to concise, data-driven responses (under 300 words unless asked for more)
- Always cite specific numbers, dates, and sources where possible
- Use standard market abbreviations (WTI, HH, NG, bpd, Bcf, etc.)
- When analyzing prices, include both fundamental and technical perspectives
- Flag uncertainty clearly — distinguish between data-backed claims and inference
- Present analysis in scannable format: headers, bullets, bold key data

CONSTRAINTS:
- Never fabricate specific price data or statistics
- Do not provide trading recommendations — present analysis and let the trader decide
- If asked about very recent events, remind me that your knowledge has a cutoff date
- Do not include general background information unless specifically asked`,
        explanation: `The weak instructions are so vague they barely change Claude's behavior. The strong instructions establish a clear identity, provide relevant market context, set behavioral expectations (concise, data-driven, with standard abbreviations), and define important constraints. Every conversation in this project benefits from these defaults — Claude immediately knows the domain, the standards, and the boundaries.`,
      },
      {
        type: "practice",
        title: "Write Your Custom Instructions",
        instruction: `Write custom instructions for your most important Claude project. Structure them using the four pillars:

1. **IDENTITY**: Who should Claude be in this project? (role, expertise, seniority)
2. **CONTEXT**: What key facts about your work should Claude always know? (markets, tools, team, workflow)
3. **BEHAVIOR**: How should Claude respond by default? (length, format, tone, what to include)
4. **CONSTRAINTS**: What should Claude avoid or be careful about? (compliance, accuracy, boundaries)

Aim for specificity over length. Each bullet should meaningfully change how Claude responds.`,
        placeholder:
          "IDENTITY:\n- Act as...\n\nCONTEXT:\n- My role is...\n- Key markets/domains: ...\n\nBEHAVIOR:\n- Default response length: ...\n- Always include: ...\n\nCONSTRAINTS:\n- Never...\n- Always flag...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-projects",
    moduleTitle: "Claude Projects",
    moduleDescription:
      "Set up Claude Desktop as your personal AI workspace with projects, custom instructions, organized conversations, artifacts, and a complete productivity blueprint.",
    moduleOrder: 3,
    slug: "organize-conversations",
    title: "Organize Conversations",
    description:
      "Learn naming conventions, when to start new conversations vs. continue, and how to build a searchable knowledge base.",
    steps: [
      {
        type: "explain",
        title: "Conversations as a Knowledge Base",
        content: `Most people treat Claude conversations as disposable — they get an answer and move on. But with intentional organization, your conversation history becomes a searchable knowledge base that grows more valuable over time. Every well-organized conversation is a document you can reference, refine, and build upon.

The key strategies are: use descriptive conversation titles (not "Help me with something" but "Q3 Natural Gas Storage Analysis"), one topic per conversation (resist the urge to ask unrelated follow-ups), and create recurring conversation patterns for repeating tasks (e.g., always start your morning research the same way so you build a historical record).

Within projects, conversations are grouped together and searchable. This means if you consistently use your "Daily Trading Research" project for market analysis, you can go back and find your analysis from any specific date. Think of each conversation as a document in a well-organized filing system — the title is the filename, the project is the folder, and Claude's search is the index. Professionals who adopt this discipline consistently report that Claude becomes not just an AI assistant but an institutional memory system.`,
      },
      {
        type: "example",
        title: "Messy vs. Organized Approach",
        before: `Conversation 1: "New chat" — asked about oil prices, then switched to writing an email, then asked about Python code
Conversation 2: "Help" — mixed research and document drafting
Conversation 3: "Untitled" — various questions throughout the day`,
        after: `Project: "Energy Market Research"
  - "2024-01-15 WTI Weekly Outlook"
  - "2024-01-15 NG Storage Report Analysis"
  - "2024-01-16 OPEC Meeting Preview"

Project: "Client Communications"
  - "Q4 Performance Report Draft — Acme Fund"
  - "New Client Onboarding Email — Smith Capital"

Project: "Trading Tools"
  - "Python: Position Sizing Calculator"
  - "Excel: P&L Tracking Formulas"

Naming Convention:
  - Research: "YYYY-MM-DD [Topic] [Type]"
  - Client work: "[Document Type] — [Client Name]"
  - Tools: "[Language]: [Tool Description]"`,
        explanation: `The organized approach makes every past conversation findable and useful. Six months from now, you can search for "OPEC" and find your analysis. You can revisit the Python calculator conversation to modify it. Each conversation has a single clear purpose, and the project structure creates natural categories. This turns Claude from a chatbot into a personal knowledge management system.`,
      },
      {
        type: "practice",
        title: "Design Your Organization System",
        instruction: `Plan your Claude conversation organization system. Write out:

1. **Projects** you would create (3-5 projects covering your main work areas)
2. For each project, list **3 example conversation titles** that follow a clear naming convention
3. Define your **naming convention** rules (e.g., date prefix, topic type, specific format)
4. Describe your **conversation discipline** (when to start new conversations vs. continue)

Think about what you will need to find 6 months from now.`,
        placeholder:
          "Project 1: \"...\"\n  - \"YYYY-MM-DD Topic...\"\n  - \"...\"\n\nProject 2: \"...\"\n  - ...\n\nNaming convention rules:\n- ...\n\nConversation discipline:\n- Start a new conversation when...\n- Continue the same conversation when...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-projects",
    moduleTitle: "Claude Projects",
    moduleDescription:
      "Set up Claude Desktop as your personal AI workspace with projects, custom instructions, organized conversations, artifacts, and a complete productivity blueprint.",
    moduleOrder: 3,
    slug: "use-artifacts",
    title: "Use Artifacts Effectively",
    description:
      "Master Claude's Artifacts feature to create, iterate on, and export documents, code, and visual content.",
    steps: [
      {
        type: "explain",
        title: "Understanding Artifacts",
        content: `Artifacts are Claude's way of creating standalone content that lives alongside your conversation. When Claude generates substantial content — a document, code, a table, a diagram, or structured data — it can create an Artifact: a separate panel that you can view, copy, edit, and download independently from the chat. This separation between conversation and deliverable is a fundamental productivity feature.

Why are artifacts useful? They separate the "conversation" (your back-and-forth with Claude) from the "deliverable" (the thing you are creating). You can iterate on an Artifact across multiple messages — asking Claude to modify a specific section, add data, or change formatting — while keeping the Artifact clean and updated. It is like having a collaborative document where Claude makes the edits and you direct them. Each iteration updates the artifact in place, so you always have the latest version.

Key artifact types include: documents (reports, memos, emails), code (scripts, formulas, queries), structured data (tables, JSON, CSV), and visual content (HTML pages, diagrams via Mermaid syntax). You can download artifacts, copy them to your clipboard, or continue refining them in the conversation. For professionals, artifacts turn Claude from a conversation partner into a document production system.`,
      },
      {
        type: "example",
        title: "Chat Response vs. Artifact",
        before: `Can you write me a market research report template?`,
        after: `Create an Artifact with a reusable market research report template for our commodities trading desk. The template should be a structured document that I can download and fill in daily.

Sections needed:
1. Header (date, analyst name, markets covered)
2. Market Overview (table with columns: Commodity, Close Price, Daily Change, Volume)
3. Key Drivers (3-5 bullet point structure)
4. Technical Levels (support/resistance table)
5. Calendar Events (upcoming data releases, meetings)
6. Trading Desk Action Items
7. Risk Flags

Make it professional and clean. Use markdown formatting. Include placeholder text showing what kind of data goes in each section.`,
        explanation: `The first prompt would get a report template embedded in the conversation text — hard to extract and use. The second prompt asks Claude to create it as an Artifact — a standalone, downloadable document with clear structure and placeholder guidance. You can then iterate ("make the table wider," "add a column for open interest") and each version updates the Artifact cleanly.`,
      },
      {
        type: "practice",
        title: "Plan an Artifact",
        instruction: `Think of a document, template, or piece of structured content you need for work. Write a prompt that would produce a useful Artifact. Include:

1. What type of artifact (document, code, table, template, etc.)
2. The specific sections or structure
3. Formatting preferences
4. How you will use it (daily template, one-time report, reference doc)
5. Any iterative changes you would want to make after the first version

Write the prompt as if you are about to send it to Claude to create the artifact.`,
        placeholder:
          "Create an artifact with a [type] for [purpose].\n\nStructure:\n1. ...\n2. ...\n\nFormat: ...\nI will use this for: ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
  {
    moduleSlug: "claude-projects",
    moduleTitle: "Claude Projects",
    moduleDescription:
      "Set up Claude Desktop as your personal AI workspace with projects, custom instructions, organized conversations, artifacts, and a complete productivity blueprint.",
    moduleOrder: 3,
    slug: "complete-blueprint",
    title: "Your Complete Blueprint",
    description:
      "AI generates a full Claude Desktop setup blueprint: all projects, custom instructions for each, and suggested skills to pair with each project.",
    steps: [
      {
        type: "explain",
        title: "Bringing It All Together",
        content: `You have now learned every component of an effective Claude Desktop setup: projects for organizing your work contexts, custom instructions for persistent expertise, conversation discipline for building a knowledge base, artifacts for document production, and skills for repeatable workflows. The final step is assembling these into a comprehensive blueprint tailored to your specific role and workflow.

A complete blueprint serves as your implementation guide. It specifies exactly which projects to create, what custom instructions to set for each, which skills to build and pair with each project, and how conversations should be organized within each project. Without a blueprint, most professionals set up one or two projects and never fully realize the potential of their Claude Desktop investment.

The blueprint you will create in this lesson is not theoretical — it is a practical implementation plan you can execute in 30-60 minutes. By the end of this lesson, the AI will generate a personalized blueprint based on everything you have shared about your role, your workflows, and your daily tasks throughout this programme. You will walk away with a document you can follow step-by-step to transform your Claude Desktop into a productivity powerhouse.`,
      },
      {
        type: "example",
        title: "Sample Blueprint",
        before: `I will just set up Claude with default settings and figure it out as I go.`,
        after: `CLAUDE DESKTOP BLUEPRINT — Energy Commodities Trader

PROJECT 1: "Daily Market Intelligence"
Custom Instructions: Senior analyst role, energy + metals focus, concise format
Skills: Market Morning Brief, EOD Summary, Storage Report Analyzer
Naming: "YYYY-MM-DD [Market] [Analysis Type]"

PROJECT 2: "Trade Development"
Custom Instructions: Portfolio analyst role, structured evaluation framework
Skills: Trade Idea Assessment, Risk Scenario Builder
Naming: "[Commodity] — [Thesis] — [Date]"

PROJECT 3: "Client & Internal Reports"
Custom Instructions: Professional writing, compliance-aware, firm templates
Skills: Weekly Report Generator, Client Email Drafter
Naming: "[Report Type] — [Client/Audience] — [Period]"

PROJECT 4: "Quantitative Tools"
Custom Instructions: Python/Excel context, data analysis frameworks
Skills: Position Sizing Calculator, Correlation Analyzer
Naming: "[Tool Type]: [Description]"

IMPLEMENTATION:
Week 1: Set up Projects 1 & 2 with custom instructions
Week 2: Build and test 2 skills for Project 1
Week 3: Set up Projects 3 & 4
Week 4: Build remaining skills, train team`,
        explanation: `This blueprint provides a complete implementation roadmap. Each project has a clear purpose, specific custom instructions, paired skills, and a naming convention. The phased implementation plan makes it practical rather than overwhelming. A trader following this blueprint would have a fully optimized Claude Desktop setup within a month.`,
      },
      {
        type: "practice",
        title: "Create Your Blueprint",
        instruction: `Create your comprehensive Claude Desktop blueprint. For each project, include:

1. **Project Name and Purpose**
2. **Custom Instructions Summary** (the key identity, context, behavior, constraints)
3. **Skills to Build** for this project (2-3 per project)
4. **Naming Convention** for conversations in this project
5. **Implementation Timeline**

Aim for 3-5 projects that cover your main work areas. Think about how they connect — which skills serve which projects, how conversations might reference each other across projects.

After submitting, the AI will generate a complete, polished blueprint you can download and implement.`,
        placeholder:
          "CLAUDE DESKTOP BLUEPRINT — [Your Role]\n\nPROJECT 1: \"...\"\nPurpose: ...\nCustom Instructions: ...\nSkills: ...\nNaming: ...\n\nPROJECT 2: \"...\"\n...\n\nIMPLEMENTATION TIMELINE:\nWeek 1: ...\nWeek 2: ...",
      },
      {
        type: "feedback",
        title: "AI Feedback",
      },
      {
        type: "improved",
        title: "Improved Version",
      },
    ],
  },
];

export function getLessonsByModule(moduleSlug: string): LessonData[] {
  return lessons.filter((l) => l.moduleSlug === moduleSlug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): LessonData | undefined {
  return lessons.find(
    (l) => l.moduleSlug === moduleSlug && l.slug === lessonSlug
  );
}

export function getModules() {
  const moduleMap = new Map<
    string,
    {
      slug: string;
      title: string;
      description: string;
      order: number;
      lessonCount: number;
    }
  >();
  for (const lesson of lessons) {
    if (!moduleMap.has(lesson.moduleSlug)) {
      moduleMap.set(lesson.moduleSlug, {
        slug: lesson.moduleSlug,
        title: lesson.moduleTitle,
        description: lesson.moduleDescription,
        order: lesson.moduleOrder,
        lessonCount: 0,
      });
    }
    moduleMap.get(lesson.moduleSlug)!.lessonCount++;
  }
  return Array.from(moduleMap.values()).sort((a, b) => a.order - b.order);
}
