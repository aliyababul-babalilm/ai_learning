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
    title: "Name, Trigger & Description",
    description:
      "Choose your task and define the YAML header — the name, description, and trigger that tell Claude when to activate your skill.",
    steps: [
      {
        type: "explain",
        title: "What Is a Claude Skill?",
        content: `A Claude Skill is a reusable prompt that triggers automatically so you do not have to rewrite it every time. Think of it like a macro for AI — you encode your expertise, preferred format, and workflow once, and from then on you just trigger it with a phrase or command and paste in the day's data.

Over the next four lessons, we are going to build a complete skill file piece by piece. Each lesson adds one section. By the end, everything snaps together into a downloadable file you can install in Claude Desktop. Today we start with the most important piece: the YAML header — the name, description, and trigger that tell Claude WHEN to activate your skill.`,
      },
      {
        type: "example",
        title: "Manual Prompting vs. a Skill with a Proper Header",
        before: `Every morning, I open Claude and type something like:
"Give me a summary of what happened in oil markets yesterday. Include prices, key news, and what to watch today."

Some days I remember to add formatting details, other days I don't. The output quality varies. I waste 5 minutes writing the prompt each time.`,
        after: `With a skill, my workflow becomes: open Claude, say "morning brief", paste in data, done. The magic is in the YAML header that makes this work:

---
name: market-morning-brief
description: >
  Generate a structured daily trading morning brief from overnight
  market data and headlines. Use this skill whenever the user mentions
  "morning brief", "market update", "overnight summary", or provides
  market data at the start of the trading day. Also trigger when the
  user asks for a daily market recap or wants to know what happened
  overnight. Activate for any request involving summarizing overnight
  price action or preparing a trading desk for the day ahead.
---

Trigger: /morning-brief or "give me my morning brief"

Notice the description is deliberately "pushy" — it lists six different trigger phrases and situations. Claude tends to under-trigger skills, so you need to be aggressive about telling it when to activate.`,
        explanation: `The YAML header is the most important part of the entire skill file because it determines whether Claude ever uses your skill at all. A vague description means Claude will ignore it. A pushy description with explicit trigger phrases means Claude activates it reliably. The name is just an identifier — the description does the real work.`,
      },
      {
        type: "practice",
        title: "Write Your YAML Header",
        instruction: `Let's start building your skill. First, we need the YAML header — this is what tells Claude when to activate your skill.

Think about the task you most want to automate — ideally something you do daily or weekly that follows the same pattern.

Fill in these three fields:

1. **Name**: A short, descriptive name in kebab-case (e.g., "morning-market-brief", "trade-idea-assessment", "supplier-call-prep"). This becomes the skill's identifier.

2. **Description**: This is the MOST IMPORTANT part. Write 2-3 sentences that tell Claude:
   - What the skill does
   - When to use it — include specific trigger phrases your team would naturally say
   - Be "pushy" — Claude tends to under-trigger skills, so be explicit about when to activate

3. **Trigger**: The command or phrase that activates it (e.g., /morning-brief, or "generate my market update")

Write your YAML header in this exact format:

---
name: your-skill-name
description: >
  [Your description here. Be pushy. Include trigger phrases.]
---

Trigger: [your trigger phrase]`,
        placeholder:
          "---\nname: your-skill-name\ndescription: >\n  [What it does]. Use this skill whenever the user mentions\n  \"[trigger phrase 1]\", \"[trigger phrase 2]\", or \"[trigger phrase 3]\".\n  Also trigger when [situation 1] or [situation 2].\n  Activate for any request involving [related topic].\n---\n\nTrigger: [your trigger phrase]",
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
    title: "Role & Input Specification",
    description:
      "Define WHO Claude should be and WHAT data it will receive — applying the role-setting and specificity techniques from Module 1.",
    steps: [
      {
        type: "explain",
        title: "Role & Input: The Foundation of Your Skill",
        content: `Now that we have the header, we need to tell Claude WHO to be and WHAT data it will receive. This is where your prompt engineering from Module 1 comes in — remember "Set a Role" and "Be Specific"? We are applying those exact techniques here, but encoding them permanently into a skill file instead of typing them each time.

The role section defines the expert persona Claude adopts when the skill activates. A vague role like "you are a helpful assistant" produces generic output. A specific role like "you are a VP-level M&A analyst at a bulge-bracket investment bank who specializes in rapid initial assessments" produces output with the right depth, terminology, and decision-making framework. Include seniority, domain expertise, and what makes this role's perspective valuable.

The input specification tells Claude exactly what data the user will provide and what to do when that data is incomplete. This prevents Claude from guessing or hallucinating when it does not have enough information. Should it ask for more data? Should it work with what it has and flag the gaps? Being explicit here eliminates a whole class of bad outputs.`,
      },
      {
        type: "example",
        title: "Vague vs. Detailed Role & Input",
        before: `You are a helpful analyst. The user will give you some data to analyze.`,
        after: `## YOUR ROLE
You are a VP-level M&A analyst at a bulge-bracket investment bank. You
specialize in rapid initial assessments of potential acquisition targets
or investment opportunities. Your screening memos are known for being
concise, analytically rigorous, and actionable — partners trust your
initial reads on deals because you consistently identify both the
opportunity and the risks others miss. You advise Managing Directors
and partners on whether to pursue or pass on opportunities.

## INPUT
The user will provide some or all of the following:
- Company name and basic description
- Available financial data (revenue, EBITDA, margins, growth rates)
- Industry or sector context
- Strategic rationale for why this target is being considered
- Any specific concerns or questions to address

When input is incomplete: work with what is available and explicitly
note what is missing and WHY it matters for the assessment. Do not
ask for more data unless fewer than 2 of the above items are provided
— in that case, ask what specific information the user can share.`,
        explanation: `The vague version gives Claude no real direction — it will produce generic, surface-level analysis. The detailed version establishes exactly the right expertise level, perspective, and audience. The input specification prevents Claude from either hallucinating missing data or endlessly asking for more information. Notice how the role includes WHO this person advises — that shapes the output's level of sophistication.`,
      },
      {
        type: "practice",
        title: "Write Your Role & Input Specification",
        instruction: `Now add the role and input specification to your skill. You already wrote the YAML header in Lesson 1 — now we are building the next piece.

You already practiced "Set a Role" in Module 1 — now apply that here.

**ROLE** — Write the expert role Claude should adopt. Include:
- Specific title and seniority level
- Domain expertise (your actual products, markets, geographies)
- Who this role advises or reports to
- What makes this role's perspective valuable

**INPUT SPECIFICATION** — Define exactly what the user will provide when triggering this skill:
- What data format? (pasted text, numbers, a document, a question)
- What fields or pieces of information?
- What happens if the input is incomplete — should Claude ask for more or work with what it has?

Write both sections:

## YOUR ROLE
You are a...

## INPUT
The user will provide...
When input is incomplete...`,
        placeholder:
          "## YOUR ROLE\nYou are a [specific title] with [years/level] of experience in [domain].\nYou specialize in [specific area]. You advise [who] on [what].\nYour perspective is valuable because [why].\n\n## INPUT\nThe user will provide:\n- [Data type 1]\n- [Data type 2]\n- [Data type 3]\n\nWhen input is incomplete:\n- If [scenario], then [action]\n- If [scenario], then [action]",
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
    title: "Analysis Framework & Output Format",
    description:
      "Define the step-by-step reasoning process and the precise output specification — applying Chain of Thought and Output Format from Module 1.",
    steps: [
      {
        type: "explain",
        title: "The Heart of Your Skill: How to Think and What to Produce",
        content: `The analysis framework is the heart of your skill — it tells Claude HOW to think through the problem step by step. Remember "Chain of Thought" from Module 1? This is where you define the exact analytical steps Claude must follow, in order, before producing the final output.

Why does this matter so much? Without an analysis framework, Claude takes shortcuts. It jumps straight to conclusions without showing its reasoning, misses steps you would never skip, and produces inconsistent output depending on the input. With a numbered framework, Claude follows the SAME rigorous process every time, regardless of who triggers the skill or what data they provide.

And the output specification defines what the final deliverable looks like. Remember "Output Format" from Module 1? Here you define exact sections, formats (table vs. bullets vs. paragraphs), length guidelines, tone, and what to emphasize. Precision in output specs eliminates the need to reformat or edit — which is where most time savings come from.`,
      },
      {
        type: "example",
        title: "Generic vs. Structured Analysis & Output",
        before: `Analyze the data and give me insights. Be thorough and professional. Present your findings clearly.`,
        after: `## ANALYSIS FRAMEWORK

Complete each step in order. State your assessment clearly before moving to the next step.

Step 1: Business Quality Assessment
- What does this company actually do? Summarize in 2 sentences.
- What is the competitive moat? (brand, scale, switching costs, network effects, regulatory, IP)
- Is this a growing or declining market? Estimated growth rate?
- Assess quality as: Premium / Above Average / Average / Below Average
- This matters because business quality determines the multiple we should pay and the risk of value destruction.

Step 2: Financial Profile
- Revenue scale and 3-year CAGR
- Margin profile: gross margin, EBITDA margin, and trend direction
- Capital intensity: capex as % of revenue
- Cash conversion: how much EBITDA converts to free cash flow?
- Red flags: declining margins, revenue concentration, unusual items
- This matters because financial profile determines whether the business can sustain its quality.

Step 3: Valuation Context
- Comparable public company multiples (EV/EBITDA, EV/Revenue)
- Recent transaction multiples in this space
- Implied valuation range based on provided financials
- This matters because overpaying for even a great business destroys returns.

Step 4: Key Risks (Top 3)
- For each: description, probability (L/M/H), impact (L/M/H), mitigant
- This matters because risk identification is where experience adds the most value.

Step 5: Verdict
- Pursue / Explore Further / Pass
- Confidence level based on data completeness
- 2-3 specific next steps
- One-sentence elevator pitch for a partner meeting

## OUTPUT SPECIFICATION
- Sections: Lead with verdict, then Business Quality, Financials (as table), Valuation, Risks (as table), Next Steps
- Format: Headers for each section. Tables for financial data and risk matrix. Bullets for analysis.
- Length: 500-800 words total. Verdict section under 50 words.
- Tone: Confident, direct, analytically precise — for senior bankers who scan in 3 minutes.
- Bold: Key conclusions, surprising numbers, and the verdict.
- No hedging language like "it could potentially be" — take a position.`,
        explanation: `The generic version produces whatever Claude feels like. The structured version guarantees 5 analytical steps in the same order every time, with each step explaining WHAT to analyze, WHAT to reference, and WHY it matters. The output specification is precise enough that the result could go directly into a presentation — no reformatting needed. This is the difference between a toy prompt and a production tool.`,
      },
      {
        type: "practice",
        title: "Write Your Analysis Framework & Output Spec",
        instruction: `Now add the analysis framework and output specification. You wrote the YAML header in Lesson 1 and the Role + Input in Lesson 2 — this is the third piece.

This is where your Chain of Thought and Output Format techniques from Module 1 come together.

**ANALYSIS FRAMEWORK** — Define the step-by-step process Claude should follow. Number each step. For EACH step include:
- What to analyze
- What data or sources to reference
- What conclusion to draw before moving to the next step
- WHY this step matters (explain the reasoning so Claude understands, not just follows rules)

Aim for 4-8 steps that cover your complete analytical process.

**OUTPUT SPECIFICATION** — Define exactly what the final output looks like:
- What sections, in what order?
- Format for each section (table, bullets, paragraphs, numbered list)
- Length guidelines (total and per section)
- Tone and audience (who reads this?)
- What to bold, emphasize, or highlight
- Any templates or examples of ideal output

Write both sections:

## ANALYSIS FRAMEWORK

Step 1: [Title]
- Analyze...
- Reference...
- Conclude... before moving to Step 2
- This matters because...

Step 2: ...
[continue for all steps]

## OUTPUT SPECIFICATION
- Sections: ...
- Format: ...
- Length: ...
- Tone: ...`,
        placeholder:
          "## ANALYSIS FRAMEWORK\n\nStep 1: [Title]\n- Analyze...\n- Reference...\n- Conclude... before moving to Step 2\n- This matters because...\n\nStep 2: [Title]\n- Analyze...\n- Reference...\n- Conclude...\n- This matters because...\n\nStep 3: [Title]\n...\n\n## OUTPUT SPECIFICATION\n- Sections: [list in order]\n- Format: [table/bullets/paragraphs for each]\n- Length: [total words, per-section limits]\n- Tone: [who reads this, what style]\n- Bold: [what to emphasize]\n- Never: [what to avoid in formatting]",
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
    title: "Assemble, Download & Test",
    description:
      "Add edge cases and constraints, assemble all four pieces into a complete skill file, and download it for Claude Desktop.",
    steps: [
      {
        type: "explain",
        title: "Final Piece: Edge Cases, Constraints & Assembly",
        content: `You have now built all the pieces of your skill file across three lessons: the YAML header (Lesson 1), the role and input specification (Lesson 2), and the analysis framework and output specification (Lesson 3). In this final step, we add edge cases and constraints, then assemble everything into a complete SKILL.md file you can download and install in Claude Desktop.

Edge cases and constraints are what prevent your skill from producing bad output. Without them, Claude will guess when data is missing, include content you do not want, and fail silently on unusual inputs. With explicit edge case handling and constraints, your skill degrades gracefully and flags problems instead of hiding them.

After you submit your edge cases and constraints, the platform will automatically assemble your complete skill file from all four lessons and give you a download button. The downloaded file is a properly formatted SKILL.md with YAML frontmatter at the top — ready to install in Claude Desktop.`,
      },
      {
        type: "example",
        title: "A Complete Assembled Skill File",
        before: `I built my skill in pieces but I'm not sure how they fit together. I also didn't think about what happens when things go wrong.`,
        after: `Here is a complete assembled skill file with all pieces plus edge cases and constraints:

---
name: deal-screening-memo
description: >
  Generate a structured deal screening memo for a potential M&A target.
  Use this skill whenever the user mentions "deal screening", "target
  analysis", "investment memo", or "should we look at this company".
  Also trigger for "screen this deal" or "prepare a one-pager".
---

Trigger: /deal-screen or "screen this deal"

## YOUR ROLE
You are a VP-level M&A analyst at a bulge-bracket investment bank...

## INPUT
The user will provide company name, financials, and strategic context...
When input is incomplete: work with what is available, flag gaps...

## ANALYSIS FRAMEWORK
Step 1: Business Quality Assessment...
Step 2: Financial Profile...
Step 3: Valuation Context...
Step 4: Key Risks...
Step 5: Verdict...

## OUTPUT SPECIFICATION
- Sections: Verdict, Business Quality, Financials, Valuation, Risks...
- Length: 500-800 words...

## EDGE CASES
When data is missing: Note exactly what is missing and how it affects
confidence. Lower the confidence rating. Do not fabricate numbers.
When input is ambiguous: Ask one clarifying question if the ambiguity
would change the verdict. Otherwise, state your assumption and proceed.
When analysis is uncertain: Present both sides with your best assessment
of probability. Never hide uncertainty behind confident language.

## CONSTRAINTS
1. Never fabricate financial data — because one wrong number destroys
   trust in the entire memo and could lead to bad investment decisions.
2. Never include generic industry overviews — because the reader knows
   the sector and filler wastes their time.
3. Never recommend "further due diligence" without specifying exactly
   what items and why — because vague recommendations are not actionable.
4. Always include at least one non-obvious risk — because obvious risks
   add no analytical value; the reader already knows them.
5. Flag when your confidence is below Medium — because the reader needs
   to know when to seek additional data before acting.

**Testing your skill:**
Test 1 (Normal): Provide full company data — expect clean 500-word memo
Test 2 (Edge): Provide only a company name — expect Claude to flag gaps
Test 3 (Stress): Provide conflicting data — expect Claude to flag contradictions`,
        explanation: `The complete file shows all pieces assembled in order: YAML header, trigger, role, input, analysis framework, output spec, edge cases, and constraints. Each constraint includes a "because" explaining the reasoning — this helps Claude apply the spirit of the rule to situations you did not anticipate. The edge cases cover the three most common failure modes: missing data, ambiguity, and uncertainty.`,
      },
      {
        type: "practice",
        title: "Add Edge Cases & Constraints",
        instruction: `Last piece — add edge cases and constraints. You wrote the YAML header in Lesson 1, the Role + Input in Lesson 2, and the Analysis Framework + Output Spec in Lesson 3. These prevent your skill from producing bad output.

**EDGE CASES** — What should Claude do when:
- Data is missing or incomplete?
- The input is ambiguous or contradictory?
- The analysis leads to uncertain conclusions?

**CONSTRAINTS** — Rules Claude must follow:
- What should it NEVER do? (and explain WHY for each)
- What sources should it cite?
- How should it flag uncertainty?
- Quality checks before finalizing the output

Write these sections:

## EDGE CASES
When data is missing: ...
When input is ambiguous: ...
When analysis is uncertain: ...

## CONSTRAINTS
1. [Constraint] — because [reason]
2. [Constraint] — because [reason]
...

After you submit, the AI will assemble your COMPLETE skill file from all 4 lessons and you can download it as a file ready to install in Claude Desktop.`,
        placeholder:
          "## EDGE CASES\nWhen data is missing: [what Claude should do]\nWhen input is ambiguous: [what Claude should do]\nWhen analysis is uncertain: [what Claude should do]\n\n## CONSTRAINTS\n1. Never [action] — because [reason]\n2. Never [action] — because [reason]\n3. Always [action] — because [reason]\n4. Always [action] — because [reason]\n5. Flag [condition] — because [reason]",
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
