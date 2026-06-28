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
        title: "Identify Your First Skill",
        instruction: `Think about your daily or weekly work. Identify a task that you perform repeatedly where you would benefit from a reusable AI template. Describe:

1. The task name (clear, descriptive)
2. How often you perform it (daily, weekly, ad hoc)
3. What inputs it requires (data, context, documents)
4. What output it should produce (format, length, sections)
5. Why consistency matters for this task
6. Who else on your team could benefit from this skill`,
        placeholder:
          "Task: ...\nFrequency: ...\nInputs needed: ...\nExpected output: ...\nWhy consistency matters: ...\nTeam benefit: ...",
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
      "Understand what Claude Skills are, how they work, and build your first reusable skill file.",
    moduleOrder: 2,
    slug: "anatomy-of-a-skill",
    title: "Anatomy of a Skill",
    description:
      "Break down the .skill file format: name, description, trigger conditions, and the actual prompt instructions that power it.",
    steps: [
      {
        type: "explain",
        title: "Inside a Skill File",
        content: `A Claude skill file is a structured document that contains everything Claude needs to perform a specific task consistently. Understanding its anatomy lets you build skills that are precise, reliable, and easy to maintain. Every skill file has four key components that work together.

The first component is the NAME and DESCRIPTION — these tell Claude (and you) what the skill does. The name should be action-oriented ("Generate Market Morning Brief") and the description should clarify when and how to use it. The second component is TRIGGER CONDITIONS — the circumstances under which this skill should activate. This could be a keyword phrase, a type of input, or a specific request pattern.

The third and most important component is the INSTRUCTIONS — the actual prompt template that Claude will follow. This is where all six prompt engineering techniques come together: role setting, specificity, context, examples, chain of thought, and output formatting. The fourth component is the OUTPUT SPECIFICATION — what the final output should look like, including format, length, sections, and any templates to follow. Together, these four components create a repeatable, high-quality AI workflow that can be triggered with a single command.`,
      },
      {
        type: "example",
        title: "Skill File Structure",
        before: `I just write whatever prompt I feel like each time.`,
        after: `--- SKILL FILE ---
Name: Market Morning Brief
Description: Generates a structured daily trading brief from overnight market data and headlines. Use at the start of each trading day.

Trigger: When the user says "morning brief" or provides overnight market data

Instructions:
You are a senior market analyst preparing the daily morning brief for a commodities trading desk.

Given the overnight data and headlines provided, produce a brief with these sections:

1. PRICE TABLE
   | Commodity | Close | Change | % Change | Volume vs. 20D Avg |

2. KEY DRIVERS (top 3, ranked by market impact)
   For each: one-line headline, 2-sentence analysis, directional impact

3. TECHNICAL LEVELS
   For each actively traded commodity: key support, resistance, and current trend

4. TODAY'S CALENDAR
   Upcoming data releases, speeches, or events that could move markets

5. RISK FLAGS
   Anything unusual: position concentration, unusual volume, correlation breaks

Output rules:
- Total length: 400-600 words
- Tone: direct, analytical, no filler
- Use standard market abbreviations
- Bold any data points that represent significant surprises vs. consensus`,
        explanation: `This skill file structure shows all four components: a clear name and description, a trigger condition, detailed instructions that incorporate multiple prompt engineering techniques, and precise output specifications. Anyone on the desk can use this skill and get the same high-quality, consistently formatted brief — regardless of their prompt engineering experience.`,
      },
      {
        type: "practice",
        title: "Draft Your Skill Structure",
        instruction: `Using the task you identified in the previous lesson, draft the structure of a skill file. Include all four components:

1. **Name**: Action-oriented, descriptive
2. **Description**: When and how to use it (1-2 sentences)
3. **Trigger**: What phrase or input activates it
4. **Instructions**: The full prompt template including role, context, format specs
5. **Output rules**: Length, tone, format, what to include/exclude

Do not worry about perfect formatting — focus on capturing all the information Claude would need to execute this task consistently.`,
        placeholder:
          "--- SKILL FILE ---\nName: ...\nDescription: ...\n\nTrigger: ...\n\nInstructions:\n...\n\nOutput rules:\n- ...",
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
      "Understand what Claude Skills are, how they work, and build your first reusable skill file.",
    moduleOrder: 2,
    slug: "build-your-first-skill",
    title: "Build Your First Skill",
    description:
      "Based on your job context, build a complete skill with AI assistance. Write it, get feedback, and see an improved version.",
    steps: [
      {
        type: "explain",
        title: "From Template to Working Skill",
        content: `Now that you understand the anatomy of a skill, it is time to build one that is genuinely useful for your daily work. The best first skill to build is one that addresses your most repetitive, high-value task — something you do frequently enough that the time savings compound, and important enough that consistency matters.

The building process follows a clear pattern. First, define the task precisely: what inputs go in, what output comes out, and what judgment calls are made along the way. Second, write the instructions as if you were training a knowledgeable new colleague — include the domain expertise, the standards, the edge cases, and the quality checks. Third, test the skill with real data and refine until the output consistently meets your standards.

Common pitfalls to avoid: making instructions too vague (Claude has to guess), making them too rigid (Claude cannot adapt to slightly different inputs), forgetting edge cases (what happens when data is missing or unusual?), and not including output formatting (you end up reformatting every time). The goal is a skill that produces output you would be comfortable sending to your manager or presenting to a client without editing — at least 80% of the time.`,
      },
      {
        type: "example",
        title: "Building a Real Skill",
        before: `Skill instructions: "Analyze this data and give me insights."`,
        after: `Name: Trade Idea Assessment
Description: Evaluates a proposed trade thesis against fundamental, technical, and risk criteria. Use when developing or reviewing trade ideas.

Instructions:
You are a senior portfolio analyst evaluating a proposed trade idea. Conduct a structured assessment using this framework:

INPUT: The user will provide a trade thesis including: commodity/instrument, direction (long/short), timeframe, and rationale.

ANALYSIS (complete each section):

1. THESIS STRENGTH (1-10)
   - Is the thesis clearly stated with specific catalysts?
   - Are the expected catalysts within the stated timeframe?
   - Rate and explain

2. FUNDAMENTAL SUPPORT
   - Supply/demand dynamics supporting or contradicting the thesis
   - Relevant data points (inventory, production, demand indicators)
   - Verdict: Supports / Neutral / Contradicts

3. TECHNICAL ALIGNMENT
   - Is the proposed entry consistent with the technical picture?
   - Key levels: entry, stop, target
   - Risk/reward ratio

4. KEY RISKS (top 3)
   - For each: risk description, probability (L/M/H), potential impact

5. VERDICT
   - Overall assessment: Strong / Moderate / Weak
   - Suggested modifications to strengthen the trade
   - Go / No-Go recommendation with reasoning

Output: 300-500 words. Professional tone. Use tables for structured data.`,
        explanation: `This skill transforms a vague "analyze this" request into a systematic evaluation framework. Every trade idea is assessed against the same criteria, ensuring nothing is overlooked. The structured output makes it easy to compare ideas and make decisions. The verdict section forces a clear recommendation, preventing analysis paralysis.`,
      },
      {
        type: "practice",
        title: "Build Your Complete Skill",
        instruction: `Now build your complete skill. Write the full skill file including:

1. **Name and Description**: Clear, action-oriented
2. **Input specification**: What the user will provide
3. **Instructions**: Detailed, step-by-step instructions for Claude including:
   - Role to adopt
   - Analysis framework or process to follow
   - Specific sections to include
   - Quality standards and edge cases
4. **Output specification**: Format, length, tone, structure

Write this as a complete, production-ready skill that you could start using tomorrow. Be thorough — this is your first real AI automation tool.`,
        placeholder:
          "Name: ...\nDescription: ...\n\nInput: The user will provide...\n\nInstructions:\nYou are a...\n\n[Detailed step-by-step instructions]\n\nOutput:\n- Format: ...\n- Length: ...\n- Sections: ...",
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
      "Understand what Claude Skills are, how they work, and build your first reusable skill file.",
    moduleOrder: 2,
    slug: "download-and-use",
    title: "Download & Use Your Skill",
    description:
      "Save your skill as a downloadable .skill file and learn how to import and use it in Claude Desktop.",
    steps: [
      {
        type: "explain",
        title: "From Concept to Production",
        content: `You have now built a complete skill. The final step is turning it into a file you can actually use in Claude Desktop and share with your team. A .skill file is simply a text file with a specific structure that Claude Desktop can import and make available as a reusable template.

To use your skill in Claude Desktop, you will save it as a .skill file (which this platform will generate for you), then import it into Claude Desktop through the Skills section in your project settings. Once imported, the skill becomes available as a selectable option whenever you start a new conversation in that project. You can also share the .skill file with colleagues — they import it the same way.

Best practices for skill management: name files descriptively (market-morning-brief.skill, not skill1.skill), version your skills as you refine them (v1, v2), create a shared folder where your team keeps approved skills, and review skills periodically to update them as your workflows evolve. A well-maintained skill library becomes one of your team's most valuable AI assets — capturing institutional knowledge in a format that scales.`,
      },
      {
        type: "example",
        title: "Skill File Ready for Download",
        before: `I have a great prompt saved in a text file somewhere on my desktop.`,
        after: `File: market-morning-brief.skill

---
name: Market Morning Brief
version: 1.0
author: Trading Desk
description: Generates structured daily morning brief from overnight market data
trigger: "morning brief" or when overnight data is provided
---

You are a senior market analyst preparing the daily morning brief for a commodities trading desk specializing in energy and metals.

Given the overnight data and headlines provided by the user, produce a structured brief following this exact format:

## PRICE TABLE
| Commodity | Close | Change | % Change | Volume vs. 20D Avg |
(Include: WTI, Brent, Henry Hub NG, Gold, Copper, Silver)

## TOP 3 DRIVERS
For each driver:
- **Headline**: One-line summary
- **Analysis**: 2 sentences on market impact
- **Direction**: Bullish / Bearish / Neutral for affected commodities

## TECHNICAL LEVELS
For each commodity with active positions:
- Support / Resistance / Current Trend (1 line each)

## TODAY'S CALENDAR
- Time | Event | Expected Impact (table format)

## RISK FLAGS
- Any unusual patterns, correlation breaks, or position risks

RULES:
- Total: 400-600 words
- Tone: Direct, analytical, zero filler
- Bold any significant surprises vs. consensus
- Use standard abbreviations (WTI, HH, NG, bpd, Bcf)`,
        explanation: `This is a production-ready skill file. The YAML-style header provides metadata for organization and discovery. The instructions section uses all six prompt engineering techniques: role setting, specificity, context, examples (through the format templates), chain of thought (through structured sections), and output formatting. This file can be imported directly into Claude Desktop.`,
      },
      {
        type: "practice",
        title: "Finalize Your Skill File",
        instruction: `Take the skill you built in the previous lesson and format it as a complete, downloadable skill file. Include:

1. **Header** with metadata (name, version, author, description, trigger)
2. **Role and context** instructions
3. **Step-by-step process** for Claude to follow
4. **Output format** specification
5. **Rules and constraints**

Write this as the final, production-ready version. After submitting, the AI will evaluate it and generate an improved version that you can download as an actual .skill file.`,
        placeholder:
          "---\nname: ...\nversion: 1.0\nauthor: ...\ndescription: ...\ntrigger: ...\n---\n\nYou are a...\n\n[Complete skill instructions]\n\nRULES:\n- ...",
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
