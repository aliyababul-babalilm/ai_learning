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
  moduleType: string;
  slug: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export const lessons: LessonData[] = [
  // ─── MODULE 1: PROMPT ENGINEERING ──────────────────────────────────────────
  {
    moduleSlug: "prompt-engineering",
    moduleTitle: "Prompt Engineering",
    moduleType: "interactive",
    slug: "set-a-role",
    title: "Set a Role",
    description:
      "Learn how to define a specific persona or role for Claude to dramatically improve response quality and relevance.",
    steps: [
      {
        type: "explain",
        title: "Why Roles Matter",
        content: `One of the most powerful techniques in prompt engineering is telling the AI who it should be. When you set a role, you activate a specific knowledge domain, communication style, and perspective that shapes every part of the response.

Think of it like this: if you ask a general question to a room full of people, you'll get general answers. But if you ask the same question specifically to the financial analyst in the room, you'll get a focused, expert-level answer drawn from years of domain experience.

When you tell Claude "You are a senior commodities trader with 15 years of experience in energy markets," Claude will draw on patterns from that domain — using the right terminology, considering the right factors, and structuring advice the way an experienced trader would. This isn't just cosmetic; it fundamentally changes the depth and relevance of the output.`,
      },
      {
        type: "example",
        title: "Role in Action",
        before: `What are some things to consider when looking at oil prices?`,
        after: `You are a senior energy commodities analyst with 15 years of experience covering crude oil markets. You advise institutional trading desks on market positioning.

What are the key fundamental and technical factors I should monitor daily to anticipate short-term crude oil price movements?`,
        explanation: `The "before" prompt gets a generic, surface-level answer. The "after" prompt sets a specific expert role, which causes Claude to respond with the depth, terminology, and actionable detail that a real senior analyst would provide. Notice how the role also implicitly sets the audience level — Claude won't over-explain basics to someone who's framed as working with institutional desks.`,
      },
      {
        type: "practice",
        title: "Write Your Own Role Prompt",
        instruction: `Now it's your turn. Think about a task you do at work. Write a prompt that starts by setting a clear, specific role for Claude. Include:

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
    moduleType: "interactive",
    slug: "be-specific",
    title: "Be Specific",
    description:
      "Master the art of precise, detailed instructions that eliminate ambiguity and get exactly the output you need.",
    steps: [
      {
        type: "explain",
        title: "The Power of Precision",
        content: `Vague prompts produce vague results. This is the single most common mistake people make with AI — they write prompts the way they'd start a casual conversation, leaving Claude to guess what they actually want.

Specificity means answering the implicit questions before Claude has to guess: How long should the output be? What format? What level of detail? Who is the audience? What should be included or excluded? The more of these you answer upfront, the less Claude has to assume — and assumptions are where quality breaks down.

A useful mental model is to imagine you're writing instructions for a brilliant new hire on their first day. They have all the skills, but they don't know your preferences, your context, or your standards yet. The more specific your brief, the closer their first draft will be to what you actually want — saving rounds of revision.`,
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
        instruction: `Think of a task you've recently asked AI to help with (or would like to). Write a prompt that is highly specific. Include at minimum:

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
    moduleType: "interactive",
    slug: "provide-context",
    title: "Provide Context",
    description:
      "Learn to give Claude the background information it needs to produce relevant, tailored responses for your specific situation.",
    steps: [
      {
        type: "explain",
        title: "Context is Everything",
        content: `Claude is incredibly capable, but it doesn't know your specific situation unless you tell it. Context is the bridge between Claude's general knowledge and your particular needs. Without it, even a well-structured prompt will produce generic results.

There are several types of context you can provide: your industry and company background, the specific problem you're trying to solve, constraints you're working under (budget, timeline, regulatory requirements), what you've already tried, who will consume the output, and what decisions will be made based on it.

The key insight is that context doesn't have to be long — it has to be relevant. A few well-chosen sentences about your situation can completely transform the output. Think about what information would change the advice you'd give if you were the expert. That's the context Claude needs. You can paste in documents, data, previous analyses, or emails to give Claude even richer context to work with.`,
      },
      {
        type: "example",
        title: "Without vs. With Context",
        before: `What are the risks of trading wheat futures?`,
        after: `I'm a junior trader at a commodities firm that specializes in agricultural products. Our desk primarily trades soft commodities in the CBOT market. I've been asked to prepare a risk assessment for our wheat futures positions ahead of the USDA WASDE report next week.

Our current position: long 500 contracts of CBOT wheat (ZW), average entry at $6.20/bushel. The position was taken based on drought concerns in the US Southern Plains.

What are the key risks to this position, specifically in the context of the upcoming WASDE report? Include both fundamental and positioning risks.`,
        explanation: `The first prompt gets a textbook answer about general wheat trading risks. The second prompt gives Claude the trader's role, firm type, specific position, rationale, and the upcoming event — so Claude can analyze the actual risks to this specific trade, not just generic risks. The response will address WASDE-specific scenarios, position sizing concerns, and how the drought thesis could be challenged.`,
      },
      {
        type: "practice",
        title: "Add Your Context",
        instruction: `Write a prompt that includes rich, relevant context about your work situation. Structure it as:

1. Who you are (role, team, company type)
2. What you're working on (specific project or task)
3. Key constraints or parameters
4. What has already been done or decided
5. The specific question or request

Don't worry about length — focus on giving Claude everything it would need to give you advice as good as a colleague who knows your situation.`,
        placeholder:
          "I'm a [role] at [company type]. I'm currently working on [specific task]...\n\nContext:\n- ...\n- ...\n\n[Your specific question]",
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
    moduleType: "interactive",
    slug: "use-examples",
    title: "Use Examples",
    description:
      "Harness few-shot prompting by showing Claude examples of what you want, so it can match your exact style and format.",
    steps: [
      {
        type: "explain",
        title: "Show, Don't Just Tell",
        content: `Few-shot prompting is one of the most reliable techniques in prompt engineering. Instead of just describing what you want, you show Claude examples of the desired output. This is especially powerful for tasks where the format, style, or logic is hard to describe in words but easy to demonstrate.

The technique works because Claude can identify patterns in your examples and apply them to new inputs. If you show it three customer emails and the responses you'd write, it learns your tone, length, structure, and decision-making logic all at once — things that would take paragraphs to describe explicitly.

Best practices for few-shot prompting: use 2-4 examples (more isn't always better), make your examples diverse enough to cover edge cases, ensure your examples are consistent with each other (don't show conflicting patterns), and clearly label input vs. output in each example. The format "Input: ... Output: ..." or "Example 1: ... Response: ..." works well.`,
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
        instruction: `Think of a task where you'd want consistent formatting or style — something you do repeatedly at work. Create a prompt that includes 2-3 examples of the input and desired output, then provide a new input for Claude to process in the same way.

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
    moduleType: "interactive",
    slug: "chain-of-thought",
    title: "Chain of Thought",
    description:
      "Guide Claude through step-by-step reasoning for complex analysis, calculations, and multi-factor decisions.",
    steps: [
      {
        type: "explain",
        title: "Think Step by Step",
        content: `Chain of thought prompting asks Claude to show its reasoning process rather than jumping straight to a conclusion. This dramatically improves accuracy for complex tasks involving math, logic, multi-step analysis, or decisions with many factors.

Why does this work? When Claude "thinks out loud," each step builds on the previous one, creating a logical chain that's more likely to arrive at the correct answer. Without chain of thought, Claude might skip steps, make implicit assumptions, or take mental shortcuts that lead to errors — just like humans do when they try to solve complex problems in their head.

You can invoke chain of thought in several ways: explicitly ask Claude to "think step by step" or "walk through your reasoning," structure your prompt with numbered steps Claude should follow, or ask Claude to consider each factor separately before reaching a conclusion. This is especially valuable for financial analysis, risk assessment, troubleshooting, and any task where you need to trust (and audit) the reasoning, not just the answer.`,
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
    moduleType: "interactive",
    slug: "output-format",
    title: "Output Format",
    description:
      "Control exactly how Claude structures its response — tables, bullet points, JSON, reports, and more.",
    steps: [
      {
        type: "explain",
        title: "Structure Your Output",
        content: `The format of Claude's response matters as much as its content. A brilliant analysis buried in a wall of text is less useful than a good analysis presented in a clean, scannable format. Output format instructions tell Claude exactly how to structure its response.

Common format specifications include: bullet points vs. paragraphs, tables for comparative data, numbered lists for sequential items, headers and sections for longer documents, JSON or structured data for programmatic use, specific templates you need to fill (email drafts, report sections, meeting notes).

You can also control meta-aspects of the format: length constraints ("keep it under 200 words"), what to include and exclude ("no introductory preamble, start directly with the analysis"), tone markers ("professional but conversational"), and conditional formatting ("if the answer is complex, use a table; if simple, use a one-liner"). Being explicit about format saves you from reformatting Claude's output every time and makes it immediately usable in your workflow.`,
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

  // ─── MODULE 2: CLAUDE DESKTOP SETUP ──────────────────────────────────────────
  {
    moduleSlug: "claude-setup",
    moduleTitle: "Claude Desktop Setup",
    moduleType: "setup",
    slug: "create-project",
    title: "Create Your First Project",
    description:
      "Set up a dedicated Claude project workspace with custom instructions tailored to your job role.",
    steps: [
      {
        type: "explain",
        title: "What Are Claude Projects?",
        content: `Claude Projects are persistent workspaces where you can set custom instructions that apply to every conversation within that project. Think of a project as a pre-configured environment — instead of repeating your role, context, and preferences every time you start a new chat, you set them once and they're always active.

For professionals, this is transformative. You might create a "Daily Market Research" project where Claude always knows your trading desk's focus commodities, preferred report format, and data sources. Or a "Client Communications" project where Claude understands your firm's tone, compliance requirements, and client terminology.

Each project maintains its own set of instructions, knowledge files, and conversation history. This means you can switch between different work contexts quickly without re-establishing context each time. The key to a great project is thoughtful custom instructions — which we'll cover in the next lesson.`,
      },
      {
        type: "example",
        title: "Project Setup Example",
        before: `I'll just use the default Claude chat for everything.`,
        after: `Project Name: "Daily Trading Research"
Project Description: Morning research workflow for energy commodities desk

Custom Instructions:
"You are my AI research assistant for energy commodities trading. I trade crude oil (WTI & Brent), natural gas (Henry Hub), and refined products. I need concise, data-driven analysis suitable for a professional trading desk. Always cite specific data points, use standard market abbreviations, and flag any information you're uncertain about. My typical workflow: pre-market research at 6:30 AM EST, mid-day position review, and end-of-day summary."`,
        explanation: `Instead of repeating context in every conversation, a well-configured project makes Claude immediately useful from the first message. Every conversation in this project will benefit from Claude knowing the trader's markets, preferred style, time zone, and workflow — without having to specify it again.`,
      },
      {
        type: "practice",
        title: "Plan Your First Project",
        instruction: `Design your first Claude project. Write out:

1. **Project Name**: A clear, descriptive name
2. **Purpose**: What you'll use this project for (1-2 sentences)
3. **Custom Instructions**: What should Claude always know when working in this project? Include your role, key context, preferred output style, and any rules or constraints.

Write this as though you're configuring it in Claude Desktop right now.`,
        placeholder:
          "Project Name: ...\nPurpose: ...\n\nCustom Instructions:\n\"You are... I work in... Always...\"",
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
    moduleSlug: "claude-setup",
    moduleTitle: "Claude Desktop Setup",
    moduleType: "setup",
    slug: "custom-instructions",
    title: "Write Custom Instructions",
    description:
      "Craft effective project-level instructions that shape every conversation in your Claude workspace.",
    steps: [
      {
        type: "explain",
        title: "Anatomy of Great Custom Instructions",
        content: `Custom instructions are the persistent context that shapes every conversation in a Claude project. Great custom instructions cover four areas: identity (who Claude should be), context (what it should know about you and your work), behavior (how it should respond), and constraints (what it should avoid).

The best custom instructions are specific enough to be useful but general enough to apply across conversations. You wouldn't want instructions so narrow that they only work for one type of question. Think of them as the "default settings" that make 80% of your conversations better without extra prompting.

A common mistake is making custom instructions too long or trying to cover every scenario. Start with 3-5 key instructions that address your most frequent needs. You can always refine them as you use the project. Focus on the things you find yourself repeating in every conversation — those are the perfect candidates for custom instructions.`,
      },
      {
        type: "example",
        title: "Weak vs. Strong Custom Instructions",
        before: `Be helpful and give good answers about commodities trading.`,
        after: `You are a research assistant for a commodities trading desk at a mid-size trading firm.

IDENTITY:
- Act as a knowledgeable junior analyst supporting senior traders
- You have deep knowledge of energy and metals markets

CONTEXT:
- Our primary markets: WTI crude, Brent crude, Henry Hub natural gas, gold, copper
- We trade primarily on NYMEX/COMEX with some ICE exposure
- Our research sources include: S&P Global Platts, EIA data, CFTC COT reports, Bloomberg

BEHAVIOR:
- Default to concise, data-driven responses (under 300 words unless asked for more)
- Always cite specific numbers, dates, and sources where possible
- Use standard market abbreviations (WTI, HH, NG, etc.)
- When analyzing prices, include both fundamental and technical perspectives
- Flag uncertainty clearly — distinguish between data-backed claims and inference

CONSTRAINTS:
- Never fabricate specific price data or statistics
- Don't provide trading recommendations — present analysis and let the trader decide
- If asked about very recent events, remind me that your knowledge has a cutoff date`,
        explanation: `The weak instructions are so vague they barely change Claude's behavior. The strong instructions establish a clear identity, provide relevant market context, set behavioral expectations (concise, data-driven, with standard abbreviations), and define important constraints. Every conversation in this project benefits from these defaults.`,
      },
      {
        type: "practice",
        title: "Write Your Custom Instructions",
        instruction: `Write custom instructions for your most important Claude project. Structure them using these sections:

1. **IDENTITY**: Who should Claude be in this project?
2. **CONTEXT**: What key facts about your work should Claude always know?
3. **BEHAVIOR**: How should Claude respond by default? (length, format, tone, what to include)
4. **CONSTRAINTS**: What should Claude avoid or be careful about?

Aim for specificity over length. Each bullet should meaningfully change how Claude responds.`,
        placeholder:
          "IDENTITY:\n- Act as...\n\nCONTEXT:\n- My role is...\n- Key markets/domains:...\n\nBEHAVIOR:\n- Default response length:...\n- Always include:...\n\nCONSTRAINTS:\n- Never...\n- Always flag...",
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
    moduleSlug: "claude-setup",
    moduleTitle: "Claude Desktop Setup",
    moduleType: "setup",
    slug: "organize-conversations",
    title: "Organize Conversations",
    description:
      "Learn strategies for organizing your Claude conversations to build a searchable knowledge base over time.",
    steps: [
      {
        type: "explain",
        title: "Conversations as a Knowledge Base",
        content: `Most people treat Claude conversations as disposable — they get an answer and move on. But with intentional organization, your conversation history becomes a searchable knowledge base that grows more valuable over time.

The key strategies are: use descriptive conversation titles (not "Help me with something" but "Q3 Natural Gas Storage Analysis"), one topic per conversation (resist the urge to ask unrelated follow-ups), and create recurring conversation patterns for repeating tasks (e.g., always start your morning research the same way).

Within projects, conversations are grouped together and searchable. This means if you consistently use your "Daily Trading Research" project for market analysis, you can go back and find your analysis from any specific date. Think of each conversation as a document in a well-organized filing system — the title is the filename, the project is the folder, and Claude's search is the index.`,
      },
      {
        type: "example",
        title: "Messy vs. Organized Approach",
        before: `Conversation 1: "New chat" — asked about oil prices, then switched to writing an email, then asked about Python code
Conversation 2: "Help" — mixed research and document drafting
Conversation 3: "Untitled" — various questions throughout the day`,
        after: `Project: "Energy Market Research"
├── "2024-01-15 WTI Weekly Outlook"
├── "2024-01-15 NG Storage Report Analysis"
├── "2024-01-16 OPEC Meeting Preview"

Project: "Client Communications"
├── "Q4 Performance Report Draft — Acme Fund"
├── "New Client Onboarding Email — Smith Capital"

Project: "Trading Tools"
├── "Python: Position Sizing Calculator"
├── "Excel: P&L Tracking Formulas"`,
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

Think about what you'll need to find 6 months from now.`,
        placeholder:
          'Project 1: "..."\n  - "YYYY-MM-DD Topic..."\n  - "..."\n\nProject 2: "..."\n  - ...\n\nNaming convention rules:\n- ...\n\nConversation discipline:\n- Start a new conversation when...\n- Continue the same conversation when...',
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
    moduleSlug: "claude-setup",
    moduleTitle: "Claude Desktop Setup",
    moduleType: "setup",
    slug: "use-artifacts",
    title: "Use Artifacts",
    description:
      "Master Claude's Artifacts feature to create, iterate on, and export documents, code, and visual content.",
    steps: [
      {
        type: "explain",
        title: "Understanding Artifacts",
        content: `Artifacts are Claude's way of creating standalone content that lives alongside your conversation. When Claude generates substantial content — a document, code, a table, a diagram, or structured data — it can create an Artifact: a separate panel that you can view, copy, edit, and download independently from the chat.

Why are artifacts useful? They separate the "conversation" (your back-and-forth with Claude) from the "deliverable" (the thing you're creating). You can iterate on an Artifact across multiple messages — asking Claude to modify a specific section, add data, or change formatting — while keeping the Artifact clean and updated. It's like having a collaborative document where Claude makes the edits and you direct them.

Key artifact types include: documents (reports, memos, emails), code (scripts, formulas, queries), structured data (tables, JSON, CSV), and visual content (HTML pages, diagrams via Mermaid syntax). You can download artifacts, copy them to your clipboard, or continue refining them in the conversation.`,
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
4. How you'll use it (daily template, one-time report, reference doc)
5. Any iterative changes you'd want to make after the first version

Write the prompt as if you're about to send it to Claude to create the artifact.`,
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
    moduleSlug: "claude-setup",
    moduleTitle: "Claude Desktop Setup",
    moduleType: "setup",
    slug: "optimize-settings",
    title: "Optimize Settings",
    description:
      "Configure Claude's settings for maximum productivity — model selection, response preferences, and workflow optimization.",
    steps: [
      {
        type: "explain",
        title: "Getting the Most from Settings",
        content: `Claude offers several settings that can significantly impact your productivity. Understanding these settings helps you optimize Claude for your specific workflow rather than accepting defaults that may not suit your needs.

Key settings to understand: Model selection (different Claude models offer different trade-offs between speed, cost, and capability), response length preferences (some tasks need concise answers, others need depth), and conversation features like artifacts and analysis mode. For professional users, the most impactful settings are often the ones that reduce friction in your daily workflow.

Think about your settings as workflow optimization. If you spend 5 seconds extra per interaction due to suboptimal settings, and you interact with Claude 50 times a day, that's over 4 minutes of daily friction — or about 15 hours per year. Small optimizations in how Claude is configured compound into significant time savings.`,
      },
      {
        type: "example",
        title: "Default vs. Optimized Setup",
        before: `Using Claude with default settings:
- No project created
- No custom instructions
- Starting fresh context every conversation
- No organization system`,
        after: `Optimized Claude Desktop setup:

1. PROJECTS CONFIGURED:
   - "Daily Research" — market analysis with pre-loaded context
   - "Client Work" — communication drafting with compliance guidelines
   - "Tools & Scripts" — code generation with tech stack context

2. CUSTOM INSTRUCTIONS SET per project with:
   - Role definitions
   - Output format preferences
   - Domain-specific terminology
   - Constraints and guardrails

3. WORKFLOW HABITS:
   - Morning: Open "Daily Research" project, start dated conversation
   - During day: Use appropriate project for each task type
   - End of day: Name conversations descriptively for future reference

4. MODEL SELECTION:
   - Use Claude Sonnet for quick lookups and simple drafting
   - Use Claude Opus for complex analysis and important documents`,
        explanation: `The default setup means every conversation starts from zero. The optimized setup creates an environment where Claude is immediately productive — it knows your context, follows your preferences, and fits into your workflow. The investment of 30 minutes setting this up saves hours of repeated context-setting over the following weeks.`,
      },
      {
        type: "practice",
        title: "Create Your Optimization Plan",
        instruction: `Design your optimal Claude Desktop configuration. Write out:

1. **Projects** you'll create (name and one-line purpose for each)
2. **Workflow design** — how you'll use Claude throughout your typical workday (morning, midday, end of day)
3. **Model strategy** — when you'd use faster vs. more capable models
4. **Organization rules** — your naming conventions and conversation discipline
5. **First-week setup tasks** — the specific things you'll configure in your first week

Be practical — focus on what will save you the most time in your actual daily work.`,
        placeholder:
          "My Optimized Claude Setup:\n\n1. Projects:\n   - ...\n\n2. Daily Workflow:\n   - Morning: ...\n   - During day: ...\n\n3. Model Strategy:\n   - Quick tasks: ...\n   - Complex work: ...\n\n4. Organization Rules:\n   - ...\n\n5. First-Week Setup:\n   - Day 1: ...\n   - Day 2: ...",
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
    { slug: string; title: string; type: string; lessonCount: number }
  >();
  for (const lesson of lessons) {
    if (!moduleMap.has(lesson.moduleSlug)) {
      moduleMap.set(lesson.moduleSlug, {
        slug: lesson.moduleSlug,
        title: lesson.moduleTitle,
        type: lesson.moduleType,
        lessonCount: 0,
      });
    }
    moduleMap.get(lesson.moduleSlug)!.lessonCount++;
  }
  return Array.from(moduleMap.values());
}
