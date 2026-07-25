export interface HowToGuide {
  slug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  steps: { title: string; text: string }[];
  examplePrompts: { label: string; prompt: string }[];
  toolLink: string;
  toolText: string;
  faq: { q: string; a: string }[];
}

export const HOW_TO_GUIDES: HowToGuide[] = [
  {
    slug: "write-system-prompt",
    title: "How to Write a System Prompt",
    subtitle: "Master the art of crafting system prompts that control AI behavior, personality, and output quality.",
    metaTitle: "How to Write a System Prompt — Step-by-Step Guide | AI World Hub",
    metaDescription: "Learn how to write effective system prompts for ChatGPT, Claude, and Gemini. Step-by-step guide with examples, templates, and best practices for controlling AI behavior.",
    intro: "A system prompt is the foundation of any AI interaction. It sets the rules, persona, and constraints that guide the model's responses. Unlike user prompts which are one-off instructions, system prompts define persistent behavior across an entire conversation. A well-crafted system prompt can dramatically improve output quality, consistency, and safety.",
    steps: [
      { title: "Define the AI's Role", text: "Start by clearly stating what role the AI should adopt. Be specific about expertise, experience level, and context. Instead of 'You are a helpful assistant,' try 'You are a senior product manager with 10 years of experience in B2B SaaS, specializing in go-to-market strategy.' A concrete role gives the AI a framework to draw from, resulting in more focused and relevant responses." },
      { title: "Set Communication Rules", text: "Specify how the AI should communicate. Define tone (professional, casual, technical), response length (concise, detailed), structure (paragraphs, bullet points, tables), and any formatting preferences. For example: 'Respond in clear, jargon-free language. Use short paragraphs. Start with a direct answer, then provide supporting details.' Clear communication rules prevent rambling and ensure outputs match your needs." },
      { title: "Add Constraints and Boundaries", text: "Tell the AI what it should NOT do. Common constraints include: word limits, topics to avoid, confidence thresholds ('if unsure, say you don't know'), and style restrictions ('avoid marketing hype, stick to facts'). Constraints are as important as instructions — they prevent the AI from going off-track and ensure outputs stay within acceptable bounds." },
      { title: "Provide Output Format Specifications", text: "Define exactly how the output should be structured. If you need JSON, specify the schema. If you need a report, define sections. Example: 'Structure your response as: 1) Executive Summary (2-3 sentences), 2) Key Findings (bulleted list), 3) Recommendations (numbered, with priority level).' Structured format specifications make outputs predictable and machine-parseable." },
      { title: "Include Context and Background", text: "Give the AI enough context to understand the bigger picture. This includes: project background, target audience, business goals, relevant data points, and any previous decisions made. Good context prevents the AI from making incorrect assumptions and produces more aligned outputs." },
      { title: "Add Few-Shot Examples", text: "Include 1-3 examples of ideal inputs and outputs within your system prompt. For example, if you want the AI to classify customer emails, show it a properly classified example. Few-shot examples dramatically improve consistency, especially for structured tasks like classification, extraction, or formatting." },
      { title: "Test, Iterate, and Refine", text: "A system prompt is never perfect on the first try. Test with multiple inputs, review outputs for consistency, and refine based on what you observe. Track versions of your system prompts. The best prompts evolve over time through continuous testing and iteration." },
    ],
    examplePrompts: [
      { label: "Role + Constraints", prompt: "You are a senior technical writer creating API documentation for developers. Use clear, precise language. Include code examples for every endpoint. Never assume prior knowledge of our specific API structure. Format: endpoint description, request example, response example, error codes." },
      { label: "Structured Output", prompt: "You are a customer support QA analyst. Review each support ticket and provide: 1) Issue category, 2) Resolution quality (1-5), 3) Agent compliance with our scripts (Yes/No/Partial), 4) Suggestions for improvement. Be objective and specific." },
    ],
    toolLink: "/tools/prompt-debugger",
    toolText: "Debug Your System Prompt",
    faq: [
      { q: "How long should a system prompt be?", a: "System prompts can range from 50 to 500+ words. The key is to include enough context without unnecessary fluff. For most applications, 150-300 words provides sufficient guidance without wasting tokens." },
      { q: "Should I use system prompts differently for ChatGPT vs Claude?", a: "Yes. ChatGPT and Claude handle system prompts differently. ChatGPT generally responds well to direct role assignments. Claude benefits from more structured instructions with clear formatting rules. Use the Prompt Converter tool to adapt your system prompt for different models." },
      { q: "Can I change the system prompt mid-conversation?", a: "With most models, you can send a new system message to update instructions mid-conversation. This is useful for multi-stage tasks where different phases require different AI behaviors." },
    ],
  },
  {
    slug: "reduce-token-cost",
    title: "How to Reduce Token Cost",
    subtitle: "Practical strategies to cut AI API costs by 40-80% without sacrificing output quality.",
    metaTitle: "How to Reduce AI Token Costs — 7 Proven Strategies | AI World Hub",
    metaDescription: "Learn how to reduce AI API token costs by 40-80%. Practical strategies for prompt compression, model selection, caching, and batch processing. Save money on ChatGPT, Claude, and Gemini APIs.",
    intro: "Token costs can quickly add up when using AI APIs at scale. A single complex conversation can cost cents, but at thousands of conversations per day, those cents become hundreds of dollars. The good news: most teams can reduce their token costs by 40-80% without sacrificing output quality by applying the right strategies.",
    steps: [
      { title: "Choose the Right Model for Each Task", text: "Don't use GPT-4o for every task. Use the cheapest model that delivers acceptable quality. For simple tasks like classification, extraction, or formatting, GPT-4o-mini ($0.15/1M input tokens) is 17x cheaper than GPT-4o ($2.50/1M). For Claude, use Haiku ($0.25/1M) instead of Sonnet ($3.00/1M) for straightforward tasks. Use the Token Estimator to compare costs across models." },
      { title: "Compress Your System Prompts", text: "Long system prompts cost you on every single API call. Audit your system prompts for unnecessary context, redundant instructions, and verbose examples. A 500-word system prompt used across 10,000 calls at GPT-4o pricing costs $31.25 in input tokens alone. Compressing it to 200 words saves $18.75. Every word in your system prompt has a recurring cost." },
      { title: "Use Shorter User Prompts", text: "Encourage users to be concise, or automatically trim user inputs. Remove unnecessary pleasantries, redundant context, and off-topic content. Use the Prompt Cleaner tool to strip noise from user prompts before sending them to the API. Even 10% reduction in average prompt length can save thousands on high-volume applications." },
      { title: "Implement Semantic Caching", text: "Cache responses for frequently asked questions or common prompt patterns. If 20% of your prompts are nearly identical, caching those responses eliminates 20% of your API costs. Use semantic similarity (embedding-based) to detect similar prompts and serve cached responses when confidence is high." },
      { title: "Batch Process When Possible", text: "Both OpenAI and Anthropic offer batch API endpoints at 50% discount. If your workload isn't real-time, submit batch jobs that complete within 24 hours. For high-volume non-real-time tasks, this single change can halve your API costs." },
      { title: "Limit Output Tokens", text: "Set `max_tokens` to the minimum viable length for each task. Many applications set max_tokens far higher than needed. If a classification task needs only 10 tokens of output, setting max_tokens to 500 wastes tokens on padding and the model may continue generating unnecessary content." },
      { title: "Monitor and Optimize Continuously", text: "Track token usage per user, per feature, and per model. Set up alerts for unusual spikes. Review monthly patterns and identify optimization opportunities. Use the Token Estimator tool to model the cost impact of changes before implementing them." },
    ],
    examplePrompts: [
      { label: "Cost-Optimized Prompt", prompt: "Classify this email into one of: complaint, refund request, technical issue, general inquiry. Respond with only the category name. Email: [paste email]" },
      { label: "Efficient Extraction", prompt: "Extract the following fields from the text: date, amount, vendor, invoice number. Format as JSON. Text: [paste text]" },
    ],
    toolLink: "/tools/token-estimator",
    toolText: "Estimate Your Token Costs",
    faq: [
      { q: "What is a token?", a: "A token is a unit of text that AI models process. Roughly: 1 token ≈ 4 characters or 0.75 words. API pricing is based on tokens — both input (your prompt) and output (the AI's response)." },
      { q: "Which model is cheapest per token?", a: "GPT-4o-mini ($0.15/1M input) and Claude Haiku ($0.25/1M input) are the cheapest premium models. For even lower cost, Gemini 1.5 Flash offers competitive pricing." },
      { q: "Can I really cut costs by 80%?", a: "Yes. Combining model selection (GPT-4o → GPT-4o-mini: 94% reduction), prompt compression (average 30% reduction), and batch processing (50% discount) can reduce total API spend by 80-90% compared to an unoptimized approach." },
    ],
  },
  {
    slug: "chain-prompts",
    title: "How to Chain Prompts",
    subtitle: "Build powerful multi-step AI workflows by chaining prompts together for complex tasks.",
    metaTitle: "How to Chain Prompts — Multi-Step AI Workflow Guide | AI World Hub",
    metaDescription: "Learn how to chain prompts together for complex AI tasks. Step-by-step guide to building multi-step prompt workflows with examples. Use the Prompt Chain Builder to create chains.",
    intro: "Prompt chaining is the technique of connecting multiple prompts in sequence, where the output of one prompt becomes the input of the next. This approach handles complex tasks that a single prompt cannot manage effectively, like multi-stage research, content creation with review cycles, or data processing pipelines.",
    steps: [
      { title: "Break Down the Complex Task", text: "Start by decomposing your complex task into discrete, manageable steps. Each step should produce a specific output that feeds into the next step. For example, writing a blog post could be: research → outline → draft → review → finalize. Each step has a clear goal and defined input/output format." },
      { title: "Design Step-by-Step Prompt Templates", text: "Create a prompt template for each step. Each template should specify what input it expects from the previous step and what output it should produce for the next step. Use consistent formatting so outputs from one step are easily parseable by the next." },
      { title: "Pass Context Forward", text: "Ensure each step receives the relevant context from all previous steps. This may include the original user request, key decisions made, or intermediate results. Without proper context forwarding, later steps may contradict earlier ones or produce inconsistent results." },
      { title: "Validate at Each Stage", text: "Add validation checkpoints between steps. Before passing output from Step A to Step B, verify that Step A's output meets quality standards. This prevents errors from cascading through the chain. Validation can be automated (check for required fields) or manual (human review at critical junctures)." },
      { title: "Handle Errors Gracefully", text: "Design fallback behaviors for when a step fails or produces poor output. Common strategies include: retry with modified prompt, escalate to a more powerful model, or skip the step and proceed with available context. Error handling prevents the entire chain from failing due to a single bad step." },
      { title: "Use the Prompt Chain Builder", text: "The Prompt Chain Builder tool lets you create, edit, and export multi-step prompt chains visually. You can define up to 5 steps, each with its own prompt and output format. Export your chain as Markdown for documentation or sharing." },
    ],
    examplePrompts: [
      { label: "Step 1 — Research", prompt: "Research the topic: [topic]. Provide: 1) Key statistics and data points, 2) Expert opinions and quotes, 3) Common misconceptions, 4) Recent developments. Format as a structured research brief." },
      { label: "Step 2 — Outline", prompt: "Based on this research brief: [paste step 1 output]. Create a detailed blog post outline with H2 sections, key points per section, and suggested examples. Target audience: [audience]. Tone: [tone]." },
    ],
    toolLink: "/tools/prompt-chain-builder",
    toolText: "Build a Prompt Chain",
    faq: [
      { q: "When should I chain prompts instead of using one long prompt?", a: "Chain prompts when: the task has multiple distinct phases, intermediate output needs review, different steps require different AI roles, or the total context exceeds the model's limit. A single long prompt works for simple, linear tasks." },
      { q: "How do I prevent information loss between steps?", a: "Use structured output formats (JSON, markdown) for each step's output. Include a summary section that explicitly captures key information for the next step. The Prompt Chain Builder handles context forwarding automatically." },
      { q: "Can I use different models for different steps?", a: "Yes! This is a key advantage of chaining. Use a cheaper model (GPT-4o-mini) for research and a more powerful model (GPT-4o) for synthesis and writing. This optimizes both cost and quality." },
    ],
  },
  {
    slug: "use-few-shot-examples",
    title: "How to Use Few-Shot Examples",
    subtitle: "Improve AI output consistency dramatically by providing examples in your prompts.",
    metaTitle: "How to Use Few-Shot Examples — AI Prompt Engineering Guide | AI World Hub",
    metaDescription: "Learn how to use few-shot examples in AI prompts to dramatically improve output consistency. Step-by-step guide with templates for classification, extraction, formatting, and more.",
    intro: "Few-shot prompting is one of the most powerful techniques in prompt engineering. By providing 2-5 examples of the desired input-output pattern within your prompt, you dramatically improve the AI's ability to produce consistent, accurate results. This technique works across all major models and is especially effective for structured tasks.",
    steps: [
      { title: "Identify the Pattern", text: "Clearly define the input-to-output transformation you want the AI to learn. Is it classification (email → category)? Extraction (text → structured fields)? Format conversion (markdown → JSON)? The clearer your pattern definition, the better your examples will be." },
      { title: "Select 3-5 High-Quality Examples", text: "Choose examples that represent the full range of inputs the AI will encounter. Include edge cases. Each example should be error-free and demonstrate exactly the behavior you want. Quality matters more than quantity — 3 excellent examples outperform 10 mediocre ones." },
      { title: "Structure Examples Consistently", text: "Use the exact same format for every example. If your pattern is Input → Output, every example should follow the same structure. Consistent formatting helps the AI recognize the pattern faster and apply it more reliably." },
      { title: "Place Examples After Instructions", text: "Put your instruction first, then the examples. This order works best: instruction → examples → new input → (let AI generate output). The instruction sets the context, examples demonstrate the pattern, and the new input triggers the learned behavior." },
      { title: "Test with Edge Cases", text: "After setting up your few-shot prompt, test it with inputs that are different from your examples. If the AI struggles with certain variations, add those as additional examples. Few-shot prompting is iterative — refine your examples based on real-world performance." },
    ],
    examplePrompts: [
      { label: "Classification Example", prompt: "Classify each customer email as: complaint, refund, technical, or other.\n\nEmail: 'I haven't received my order from last week'\nCategory: complaint\n\nEmail: 'Can you help me reset my password?'\nCategory: technical\n\nEmail: 'I'd like a refund for order #12345'\nCategory: refund\n\nEmail: 'What are your business hours?'\nCategory: other\n\nEmail: [new email]" },
      { label: "Extraction Example", prompt: "Extract the date, amount, and vendor from each invoice.\n\nInvoice: 'ACME Corp - $1,250 - Due March 15, 2026'\nExtracted: {'date': '2026-03-15', 'amount': 1250, 'vendor': 'ACME Corp'}\n\nInvoice: 'Office Supplies Plus - $89.50 - Net 30'\nExtracted: {'amount': 89.5, 'vendor': 'Office Supplies Plus'}\n\nInvoice: [new invoice]" },
    ],
    toolLink: "/tools/mega-prompt-builder",
    toolText: "Build a Few-Shot Prompt",
    faq: [
      { q: "How many examples should I use?", a: "2-5 examples is the sweet spot for most tasks. One example rarely establishes a reliable pattern. More than 5 adds token cost without proportional improvement in accuracy." },
      { q: "Do few-shot examples work with all AI models?", a: "Yes. Few-shot prompting works effectively with GPT-4o, Claude, Gemini, and most other models. However, different models may need different numbers of examples or slightly different formatting to achieve optimal results." },
      { q: "What if my task has multiple output formats?", a: "Provide examples for each output format. Or better, split into separate prompts — one for each format. Combining multiple output formats in one prompt often confuses the AI." },
    ],
  },
  {
    slug: "format-json-output",
    title: "How to Format JSON Output",
    subtitle: "Get reliable, parseable JSON from AI models every time with these proven techniques.",
    metaTitle: "How to Format JSON Output from AI — Complete Guide | AI World Hub",
    metaDescription: "Learn how to get reliable JSON output from ChatGPT, Claude, and Gemini. Step-by-step guide with schema definitions, examples, and validation techniques.",
    intro: "Getting AI models to produce valid, parseable JSON is essential for production applications. While modern models are good at generating JSON, they can still produce malformed output, missing fields, or inconsistent structures. This guide covers proven techniques for reliable JSON output every time.",
    steps: [
      { title: "Define Your Schema Explicitly", text: "Provide a complete JSON schema within your prompt. Include all field names, types, and whether each field is required or optional. Use the JSON Schema Generator tool to create schema definitions from sample data. A clear schema is the foundation of reliable JSON output." },
      { title: "Provide a Valid JSON Example", text: "Show the AI exactly what a valid response looks like. Include realistic data with the correct structure. The example should match your schema exactly. This gives the AI a template to follow, dramatically reducing formatting errors." },
      { title: "Use System Prompt for Structure", text: "Put JSON formatting instructions in the system prompt rather than the user prompt. This ensures the formatting rules apply consistently across all user inputs. Example: 'Always respond with valid JSON matching this schema: [schema].'" },
      { title: "Specify JSON Response Markers", text: "Tell the AI to wrap JSON in code blocks or specific markers. This makes extraction reliable. Example: 'Place your JSON response inside ```json ... ``` code blocks.' This gives you a reliable pattern to extract JSON from response text." },
      { title: "Validate Output Automatically", text: "Use the JSON Validator tool to automatically check AI responses against your schema. Catch errors before they reach production. The validator checks field types, required fields, and nested structure compliance." },
      { title: "Handle Errors with Fallbacks", text: "Have a fallback strategy for when the AI outputs invalid JSON. Common approaches: retry with a stricter prompt, use a regex extraction as backup, or return a default error JSON. Never assume the AI will always produce valid JSON." },
    ],
    examplePrompts: [
      { label: "JSON Output Prompt", prompt: "Extract the following information from the email and return as JSON matching this schema:\n{\"type\": \"object\", \"required\": [\"category\", \"priority\", \"summary\", \"action_items\"], \"properties\": {\"category\": {\"type\": \"string\"}, \"priority\": {\"type\": \"string\", \"enum\": [\"high\", \"medium\", \"low\"]}, \"summary\": {\"type\": \"string\"}, \"action_items\": {\"type\": \"array\", \"items\": {\"type\": \"string\"}}}}\n\nEmail: [paste email]" },
    ],
    toolLink: "/tools/json-schema-generator",
    toolText: "Generate a JSON Schema",
    faq: [
      { q: "Why do AI models sometimes produce invalid JSON?", a: "Common reasons: the prompt didn't clearly specify JSON format, the schema was too complex, the model ran out of tokens mid-response, or the training data had inconsistent JSON examples. Clear schema + examples + validation catches most errors." },
      { q: "Should I use JSON mode if available?", a: "Yes. GPT-4o has a JSON mode that forces valid JSON output. Claude responds well to structured output instructions. Use model-specific features when available, but always validate output regardless." },
      { q: "How do I handle nested JSON objects?", a: "Define nested objects in your schema with clear type annotations. Provide a complete example showing the nested structure. Start with flat JSON and add nesting gradually once the AI consistently produces correct flat output." },
    ],
  },
  {
    slug: "create-ai-persona",
    title: "How to Create an AI Persona",
    subtitle: "Design compelling AI personas that deliver consistent, on-brand responses every time.",
    metaTitle: "How to Create an AI Persona — Complete Guide with Templates | AI World Hub",
    metaDescription: "Learn how to create effective AI personas for customer support, sales, content creation, and more. Step-by-step guide with 30+ pre-built personas and customization tips.",
    intro: "AI personas transform a generic AI assistant into a specialized expert with a distinct personality, communication style, and knowledge domain. A well-designed persona produces consistently better, more focused outputs. This guide walks you through creating personas that deliver real business value.",
    steps: [
      { title: "Define the Persona's Role and Expertise", text: "Start by clearly defining who the persona is. Be specific about their job title, years of experience, industry, and areas of expertise. A vague 'marketing expert' is far less effective than 'a senior brand strategist with 12 years of experience in D2C e-commerce, specializing in storytelling and brand positioning.'" },
      { title: "Set Communication Style and Tone", text: "Define how the persona communicates. Include: tone (professional/warm/authoritative), vocabulary level (technical/accessible), sentence structure (concise/detailed), and any unique speech patterns. For customer support personas, include empathy guidelines. For sales personas, include persuasion techniques." },
      { title: "Add Domain-Specific Knowledge", text: "Equip the persona with relevant knowledge: industry terminology they should use, frameworks they should reference (e.g., 'Use the RICE framework for prioritization'), tools they should know, and common scenarios they should handle. This knowledge makes the persona credible and useful." },
      { title: "Include Behavioral Rules", text: "Define what the persona should and shouldn't do. Examples: 'Always start by asking clarifying questions before providing solutions,' 'Never make up data — say when you're unsure,' 'If the user asks something outside your expertise, suggest alternatives.' Behavioral rules prevent common AI mistakes." },
      { title: "Test and Refine", text: "Test your persona with realistic scenarios. Review outputs for consistency — does it always sound like the same person? Is the expertise level appropriate? Refine based on what you observe. The Persona Builder tool includes 30+ pre-built personas you can customize." },
    ],
    examplePrompts: [
      { label: "Customer Support Persona", prompt: "You are a senior customer support specialist at a SaaS company called CloudFlow. You have 5 years of experience handling technical SaaS support. Your tone is empathetic, patient, and solution-focused. You always acknowledge the customer's frustration first, then provide step-by-step solutions. Never blame the customer. If you don't know the answer, say so and promise to find out. Your goal: resolve the issue AND make the customer feel valued." },
      { label: "Sales Coach Persona", prompt: "You are an enterprise sales coach with 15 years of experience selling B2B SaaS to Fortune 500 companies. Your communication style is direct, motivational, and practical. You focus on buyer psychology, objection handling, and consultative selling. When giving advice, always include: the principle, a specific script or talking point, and a measurable outcome to track." },
    ],
    toolLink: "/tools/persona-builder",
    toolText: "Browse 30+ Pre-Built Personas",
    faq: [
      { q: "How is a persona different from a system prompt?", a: "A system prompt sets rules and constraints. A persona adds personality, expertise depth, and behavioral consistency. A persona includes everything a system prompt has, plus the 'who' behind the responses." },
      { q: "Can I use the same persona across different AI models?", a: "Yes, but you may need to adjust the format. ChatGPT personas work well with direct role assignments. Claude personas benefit from more structured instructions. The Prompt Converter tool can help adapt persona prompts between models." },
      { q: "How many personas should I create?", a: "Create one persona per distinct use case. A customer support persona, a content writing persona, and a data analysis persona would be three separate needs. Avoid creating too many similar personas — consolidate where possible." },
    ],
  },
  {
    slug: "test-prompts",
    title: "How to Test Prompts",
    subtitle: "A systematic approach to testing, evaluating, and improving your AI prompts.",
    metaTitle: "How to Test AI Prompts — Systematic Evaluation Guide | AI World Hub",
    metaDescription: "Learn how to systematically test AI prompts for quality, consistency, and reliability. Step-by-step guide with evaluation criteria, A/B comparison, and improvement techniques.",
    intro: "Testing prompts systematically is the difference between AI outputs that are 'sometimes good' and 'consistently excellent.' Without testing, you're relying on luck. This guide provides a structured framework for evaluating, comparing, and improving your prompts based on measurable criteria rather than gut feel.",
    steps: [
      { title: "Define Success Criteria", text: "Before testing, define what 'good' looks like. Common criteria: accuracy (factually correct?), completeness (covers all required aspects?), consistency (similar quality across different inputs?), format compliance (follows specified structure?), and relevance (addresses the user's needs?). Assign weights to each criterion based on your priorities." },
      { title: "Create a Test Suite", text: "Build a set of 10-20 diverse test inputs that represent the full range of scenarios your prompt will handle. Include: typical cases, edge cases, ambiguous inputs, and intentionally difficult inputs. A good test suite catches weaknesses before they reach production." },
      { title: "Run and Score Outputs", text: "Run your prompt against the test suite and score each output against your success criteria. Use a consistent scoring scale (1-5 or 0-100). The Prompt Comparison tool can help score and compare outputs side-by-side with metrics like clarity, structure, and readability." },
      { title: "A/B Compare Different Versions", text: "Test multiple prompt variations against the same inputs. Change one variable at a time: wording, structure, examples, or constraints. Compare scores to identify which version performs best. The Prompt Comparison tool shows side-by-side differences and highlights what changed." },
      { title: "Test with Different Models", text: "A prompt that works well with GPT-4o may perform poorly with Claude or Gemini. Test your prompt with all target models. Note differences in output quality, formatting, and consistency. Adapt your prompt for each model's strengths and preferences." },
      { title: "Monitor and Iterate Continuously", text: "Set up ongoing monitoring for prompts in production. Track metrics like user satisfaction scores, correction rates, and output quality. Review periodically and refine based on real-world performance. Good prompts evolve with your understanding of what works." },
    ],
    examplePrompts: [
      { label: "Test Evaluation Criteria", prompt: "Score this AI response on a scale of 1-5 for each criterion:\n1. Accuracy — Is every claim supported by the input or known facts?\n2. Completeness — Does it address all parts of the user's request?\n3. Structure — Is it well-organized with clear sections?\n4. Tone — Is the tone appropriate for the intended audience?\n5. Actionability — Can the user act on this response?\n\nInput: [user query]\nResponse: [AI response]\n\nProvide scores with brief justification." },
    ],
    toolLink: "/tools/prompt-comparison",
    toolText: "Compare Prompt Versions",
    faq: [
      { q: "How many test inputs do I need?", a: "10-20 well-designed test inputs are sufficient for most prompt optimization. Focus on diversity rather than quantity. Cover typical cases, edge cases, and failure-prone scenarios." },
      { q: "What's the most common prompt failure?", a: "Inconsistency — the same prompt producing very different quality outputs for similar inputs. This is usually caused by vague instructions or insufficient constraints. Adding specific formatting rules and examples dramatically improves consistency." },
      { q: "Should I automate prompt testing?", a: "Yes, for production systems. Automated testing with scored outputs helps catch regressions when you update prompts. For manual testing, use the Prompt Comparison tool to systematically compare versions." },
    ],
  },
  {
    slug: "optimize-for-speed",
    title: "How to Optimize Prompts for Speed",
    subtitle: "Get faster AI responses by optimizing your prompts for reduced latency.",
    metaTitle: "How to Optimize AI Prompts for Speed — Latency Reduction Guide | AI World Hub",
    metaDescription: "Learn how to optimize AI prompts for faster response times. Reduce latency by up to 60% with prompt compression, model selection, and output length control.",
    intro: "Response speed matters — especially for real-time applications like chatbots, code completion, and interactive tools. While much of the latency depends on the model and infrastructure, your prompt design significantly impacts response time. These optimizations can cut latency by 30-60% without major infrastructure changes.",
    steps: [
      { title: "Choose a Faster Model", text: "Model selection is the single biggest factor in response speed. GPT-4o-mini is significantly faster than GPT-4o. Claude Haiku is faster than Sonnet. For real-time applications, always start with the fastest model that meets your quality requirements. Reserve slower, more powerful models for complex tasks that genuinely need them." },
      { title: "Shorten Your Prompt", text: "Every token in your prompt adds to processing time. Audit your prompts for unnecessary context, redundant instructions, and verbose examples. A 50% shorter prompt can deliver up to 40% faster responses. Use the Prompt Cleaner tool to remove noise without losing essential instructions." },
      { title: "Reduce Output Length", text: "Set max_tokens to the minimum viable length. The AI spends time generating every token — if you need 50 tokens of output but set max_tokens to 500, you're wasting compute. For classification tasks, limit output to 5-10 tokens. For summaries, estimate the minimum length needed." },
      { title: "Use Simpler Instructions", text: "Complex, multi-step instructions increase processing time because the model spends more 'thinking' tokens before responding. Simplify instructions where possible. Instead of a 5-step process, break into separate prompts or use clearer, more direct language." },
      { title: "Pre-Compute Common Elements", text: "Cache system prompts, examples, and frequently used context on your end. Send only the dynamic parts in each request. This reduces per-request token count and speeds up processing. For high-traffic applications, pre-computing can reduce latency by 20-30%." },
    ],
    examplePrompts: [
      { label: "Before (Slow)", prompt: "I'd like you to please analyze the following text and provide a comprehensive analysis covering all key points, main arguments, supporting evidence, counterarguments, and your own assessment. Please take your time and be thorough. Here's the text: [text]" },
      { label: "After (Fast)", prompt: "Analyze this text: key points, arguments, evidence. 3 sentences max. Text: [text]" },
    ],
    toolLink: "/tools/prompt-cleaner",
    toolText: "Clean and Compress Your Prompt",
    faq: [
      { q: "Which model is fastest?", a: "Claude Haiku and GPT-4o-mini are the fastest major models, typically responding in under 500ms for simple prompts. Gemini 1.5 Flash is also competitive. For maximum speed, use the smallest model that meets your quality needs." },
      { q: "How much faster does a shorter prompt respond?", a: "Response time scales roughly linearly with input + output token count. Halving your prompt length typically reduces response time by 30-40%, since both input processing and output generation are faster." },
      { q: "Will optimizing for speed reduce quality?", a: "Not necessarily. Many prompts contain unnecessary fluff that adds tokens without improving quality. Strategic compression — removing redundant instructions while keeping essential ones — maintains or even improves quality while speeding up responses." },
    ],
  },
  {
    slug: "handle-long-context",
    title: "How to Handle Long Context",
    subtitle: "Strategies for working with long documents, conversations, and multi-turn contexts in AI prompts.",
    metaTitle: "How to Handle Long Context in AI Prompts — Complete Guide | AI World Hub",
    metaDescription: "Learn strategies for handling long context in AI prompts. Techniques for document analysis, multi-turn conversations, and staying within token limits while maintaining quality.",
    intro: "Modern AI models support large context windows — up to 200K tokens for Claude and 1M tokens for Gemini. However, simply dumping all that context into a single prompt often produces poor results. The AI struggles to find relevant information in a sea of text. This guide covers techniques for effectively using long contexts.",
    steps: [
      { title: "Structure Your Context Logically", text: "Organize long context with clear headers, sections, and summaries. Use markdown headings (##, ###), numbered sections, and bullet points to create a navigable structure. The AI can use section headers as anchors to find relevant information. Unstructured walls of text are much harder for AI to process effectively." },
      { title: "Place the Most Important Content Last", text: "AI models tend to weight content near the end of the context window more heavily. Put your most important instructions and the most recent/relevant context at the end. Earlier content — especially in the middle — may be partially forgotten or de-emphasized in the model's response." },
      { title: "Use Summarization for Compression", text: "Before feeding a long document into a prompt, pre-summarize it. Extract key facts, dates, decisions, and action items into a condensed summary. This preserves the essential information while dramatically reducing token usage. The summary is also more likely to be fully processed than the original document." },
      { title: "Chunk and Process Incrementally", text: "For very long documents (100K+ tokens), don't try to process everything at once. Break the document into chunks, process each chunk separately, then combine results. This approach is more reliable and allows you to use different prompts for different sections." },
      { title: "Use Chain-of-Thought for Retrieval", text: "When you need the AI to find specific information in a long context, instruct it to think step-by-step: 'First, identify which section of the document contains the relevant information. Then, extract the specific details. Finally, synthesize the answer.' This structured approach improves accuracy." },
    ],
    examplePrompts: [
      { label: "Long Context Prompt", prompt: "I have attached a long document about our Q3 product roadmap. Here is a summary of what it covers:\n- Section 1: Market analysis and competitive landscape\n- Section 2: Feature prioritization with RICE scores\n- Section 3: Engineering capacity estimates\n- Section 4: Launch timeline and milestones\n\nQuestion: Based on the full document, what are the top 3 features we should prioritize for October launch? Consider engineering capacity and market impact." },
    ],
    toolLink: "/tools/prompt-comparison",
    toolText: "Compare Context Strategies",
    faq: [
      { q: "What is the effective context window size?", a: "While models claim large context windows (200K-1M tokens), effective usage typically decreases beyond 30-50K tokens. For best results, keep context under 20K tokens and use summarization or chunking for longer documents." },
      { q: "Do different models handle long context differently?", a: "Yes. Claude is generally considered best at utilizing its full 200K context window. Gemini has the largest window (1M) but effectiveness decreases with distance. GPT-4o handles 128K well but shows degradation beyond 50K for complex reasoning." },
      { q: "How do I know if I'm losing context?", a: "Signs include: the AI contradicts earlier information, asks about things already provided, or produces outputs that don't consider important context. Regular testing with known-answer questions helps you understand how much context your model actually uses." },
    ],
  },
  {
    slug: "prevent-hallucination",
    title: "How to Prevent Hallucination",
    subtitle: "Reduce AI hallucinations and improve factual accuracy with these prompt engineering techniques.",
    metaTitle: "How to Prevent AI Hallucination — 7 Proven Techniques | AI World Hub",
    metaDescription: "Learn how to reduce AI hallucinations and improve factual accuracy. 7 proven techniques including grounding, confidence thresholds, citation requirements, and verification prompts.",
    intro: "AI hallucination — when the model generates confident but incorrect information — is one of the biggest challenges in deploying AI systems. While no technique eliminates it entirely, combining multiple approaches can reduce hallucination rates from 15-27% down to below 5% for well-designed systems.",
    steps: [
      { title: "Ground Responses in Provided Context", text: "Instruct the AI to base its responses ONLY on the information you provide. Add explicit instructions like: 'Only use information from the context below. If the answer isn't in the context, say 'I don't have enough information to answer this.' This prevents the AI from filling gaps with invented facts." },
      { title: "Require Confidence Indicators", text: "Ask the AI to rate its confidence in each claim. Example: 'For each statement, include a confidence score (High/Medium/Low) and briefly explain your reasoning.' This makes the AI more cautious and helps you identify potentially unreliable outputs." },
      { title: "Request Citations for Each Claim", text: "For factual tasks, ask the AI to cite sources for each claim. Example: 'For every factual statement, cite the specific section or paragraph from the provided source material.' The act of citing forces the AI to anchor claims in actual data rather than generating from its training distribution." },
      { title: "Use Chain-of-Thought Reasoning", text: "Require the AI to show its reasoning step-by-step before giving the final answer. This makes the thinking process visible and allows you to catch errors early. Models that 'think out loud' are more likely to self-correct than those that jump directly to an answer." },
      { title: "Implement Fact-Checking Loops", text: "For critical applications, add a verification step. After the AI produces an output, ask it (or a separate model call) to fact-check the output against the source material. Flag any claims that can't be verified. This two-pass approach significantly reduces hallucinated content." },
      { title: "Set Clear Boundaries of Knowledge", text: "Tell the AI what it does and doesn't know. 'You are an expert in 2024 data. For events after 2024, say you don't have information. Never predict future events unless given explicit data about them.' Clear knowledge boundaries prevent the AI from inventing information about topics it shouldn't know." },
    ],
    examplePrompts: [
      { label: "Hallucination-Resistant Prompt", prompt: "You are a research analyst. Based ONLY on the provided documents, answer the following question. For each claim in your response: 1) Cite the exact section and paragraph number, 2) Rate your confidence (High/Medium/Low), 3) If a claim isn't supported by the documents, state 'This is my inference, not from the documents.'\n\nDocuments: [paste documents]\nQuestion: [question]" },
    ],
    toolLink: "/tools/prompt-debugger",
    toolText: "Debug Your Prompt for Issues",
    faq: [
      { q: "Can I eliminate hallucinations completely?", a: "No. All AI models hallucinate to some degree. The goal is to reduce the rate to acceptable levels for your use case. For critical applications, combine prompt engineering with human review and automated validation." },
      { q: "Which models hallucinate least?", a: "Claude and GPT-4o generally have lower hallucination rates than smaller or older models. Gemini 1.5 Pro is competitive. For any model, grounding in provided context and requiring citations significantly reduces hallucination." },
      { q: "How do I detect hallucinations automatically?", a: "Combine multiple techniques: confidence scoring, cross-referencing with source material, consistency checks across multiple calls, and known-answer testing. The Prompt Debugger tool can help identify potential issues in your prompt design." },
    ],
  },
];
