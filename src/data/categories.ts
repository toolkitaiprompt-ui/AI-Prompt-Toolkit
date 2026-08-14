export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: "writing", name: "Writing & Content", icon: "✍️", description: "Blog posts, articles, copywriting", color: "#DB2777" },
  { id: "marketing", name: "Marketing & Sales", icon: "📢", description: "Ads, emails, social media", color: "#F97316" },
  { id: "coding", name: "Development & Code", icon: "💻", description: "Debug, refactor, generate code", color: "#00D9FF" },
  { id: "business", name: "Business & Strategy", icon: "📊", description: "Planning, analysis, reports", color: "#FFD700" },
  { id: "education", name: "Education & Learning", icon: "📚", description: "Lessons, study guides, quizzes", color: "#00FF41" },
  { id: "creative", name: "Creative & Design", icon: "🎨", description: "Art, design, brainstorming", color: "#FF1493" },
  { id: "career", name: "Career & HR", icon: "💼", description: "Resumes, interviews, reviews", color: "#0891B2" },
  { id: "support", name: "Customer Support", icon: "🎧", description: "Replies, FAQs, tickets", color: "#7C3AED" },
];
