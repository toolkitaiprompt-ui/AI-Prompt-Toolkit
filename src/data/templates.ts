export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
  model: string;
  usage: number;
  rating: number;
}

export const TEMPLATES: PromptTemplate[] = [
  {
    id: "t1",
    title: "Blog Post Writer",
    category: "Writing",
    prompt: "Write a comprehensive blog post about [topic]. The post should be 1500-2000 words, include an engaging introduction, 3-5 main sections with subheadings, and a conclusion with key takeaways. Target audience: [audience]. Tone: [professional/friendly/authoritative]. Include relevant examples and data points.",
    description: "Complete blog post generator with SEO-optimized structure",
    model: "ChatGPT",
    usage: 15420,
    rating: 4.8
  },
  {
    id: "t2",
    title: "Email Marketing Copy",
    category: "Marketing",
    prompt: "Write a [type] email for [product/service]. Goal: [goal - e.g., drive sales, increase engagement]. Target: [audience]. Key message: [message]. Include subject line (max 50 chars), preview text, body (150-200 words), and CTA. Tone: [tone]. Urgency level: [low/medium/high].",
    description: "High-converting email templates for campaigns",
    model: "ChatGPT",
    usage: 12850,
    rating: 4.7
  },
  {
    id: "t3",
    title: "Code Debugger",
    category: "Coding",
    prompt: "Debug the following [language] code. Explain what each bug is, why it causes issues, and provide the corrected code with comments. Code: [paste code here]. Error message (if any): [error]. Expected behavior: [describe].",
    description: "Step-by-step code debugging assistant",
    model: "GPT-4",
    usage: 22100,
    rating: 4.9
  },
  {
    id: "t4",
    title: "Social Media Content",
    category: "Marketing",
    prompt: "Create a [platform] post about [topic]. Format: [post type - carousel/reel/static]. Include: hook (first 2 lines), main content (100-150 words), 3-5 relevant hashtags, and call-to-action. Brand voice: [brand voice]. Goal: [awareness/engagement/conversion].",
    description: "Platform-optimized social media posts",
    model: "ChatGPT",
    usage: 18900,
    rating: 4.6
  },
  {
    id: "t5",
    title: "Product Description",
    category: "E-commerce",
    prompt: "Write a product description for [product name]. Features: [list features]. Benefits: [list benefits]. Target audience: [audience]. Price point: [price]. Include: compelling headline (60 chars max), feature-benefit bullets (5-7 points), SEO description (160 chars), and emotional hook.",
    description: "Conversion-focused product descriptions",
    model: "Claude",
    usage: 9800,
    rating: 4.5
  },
  {
    id: "t6",
    title: "SQL Query Builder",
    category: "Coding",
    prompt: "Write a SQL query for the following requirement: [describe what you need]. Database schema: [table names and columns]. Expected output columns: [list]. Conditions/filters: [describe]. Sort order: [field and direction]. Limit: [number].",
    description: "Generate optimized SQL queries from plain English",
    model: "GPT-4",
    usage: 16500,
    rating: 4.8
  },
  {
    id: "t7",
    title: "Resume Bullet Points",
    category: "Career",
    prompt: "Rewrite my resume bullet point to be more impactful. Original: [paste original]. Job title: [title]. Industry: [industry]. Key achievement to highlight: [achievement]. Use [action verb] and include [metric/result] where possible. Max 2 lines per bullet.",
    description: "ATS-friendly resume bullet point optimizer",
    model: "Claude",
    usage: 11200,
    rating: 4.6
  },
  {
    id: "t8",
    title: "Lesson Plan Creator",
    category: "Education",
    prompt: "Create a lesson plan for [topic/subject]. Grade level: [grade]. Duration: [time]. Learning objectives: [list 2-3 objectives]. Include: hook/engagement activity, main teaching points (3-5), student activity, assessment method, and homework assignment. Teaching style: [style].",
    description: "Complete lesson plans for educators",
    model: "ChatGPT",
    usage: 7400,
    rating: 4.4
  },
  {
    id: "t9",
    title: "Business Strategy",
    category: "Business",
    prompt: "Analyze [business idea/industry] and provide a strategic roadmap. Include: market analysis (size, trends, competitors), SWOT analysis, 3 key strategies for growth, resource requirements, timeline (6-12 months), and success metrics. Business stage: [stage].",
    description: "Data-driven business strategy framework",
    model: "GPT-4",
    usage: 8300,
    rating: 4.7
  },
  {
    id: "t10",
    title: "Customer Support Reply",
    category: "Support",
    prompt: "Write a customer support reply for: Issue: [describe issue]. Customer tone: [frustrated/confused/calm]. Our policy: [relevant policy]. Resolution: [solution]. Include: empathy statement, issue acknowledgment, solution steps, timeline (if applicable), and closing. Brand voice: [voice].",
    description: "Professional customer service templates",
    model: "ChatGPT",
    usage: 20500,
    rating: 4.5
  },
  {
    id: "t11",
    title: "Ad Copy Generator",
    category: "Marketing",
    prompt: "Create [number] ad variations for [product/service]. Platform: [Google/Facebook/Instagram/LinkedIn]. Target audience: [audience]. Key selling point: [USP]. Budget: [budget]. Goal: [clicks/conversions/awareness]. Include: headline (30 chars), description (90 chars), and CTA for each variation.",
    description: "Multi-variant ad copy for any platform",
    model: "Claude",
    usage: 14600,
    rating: 4.6
  },
  {
    id: "t12",
    title: "Meeting Agenda",
    category: "Business",
    prompt: "Create a meeting agenda for [meeting type/objective]. Duration: [time]. Attendees: [roles]. Key discussion points: [list 3-5]. Decision needed on: [items]. Pre-reading: [documents]. Format: time allocations for each item, owner for each section, and action items template.",
    description: "Structured meeting agendas that save time",
    model: "ChatGPT",
    usage: 9100,
    rating: 4.3
  }
];

export const CATEGORIES = [
  { name: "All", count: TEMPLATES.length },
  { name: "Writing", count: TEMPLATES.filter(t => t.category === "Writing").length },
  { name: "Marketing", count: TEMPLATES.filter(t => t.category === "Marketing").length },
  { name: "Coding", count: TEMPLATES.filter(t => t.category === "Coding").length },
  { name: "Business", count: TEMPLATES.filter(t => t.category === "Business").length },
  { name: "Education", count: TEMPLATES.filter(t => t.category === "Education").length },
  { name: "E-commerce", count: TEMPLATES.filter(t => t.category === "E-commerce").length },
  { name: "Career", count: TEMPLATES.filter(t => t.category === "Career").length },
  { name: "Support", count: TEMPLATES.filter(t => t.category === "Support").length },
];
