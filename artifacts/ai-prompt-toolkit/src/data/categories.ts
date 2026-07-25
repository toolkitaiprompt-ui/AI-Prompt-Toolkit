export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: "writing", name: "Writing & Content", icon: "✍️", description: "Blog posts, articles, copywriting", count: 1, color: "#DB2777" },
  { id: "marketing", name: "Marketing & Sales", icon: "📢", description: "Ads, emails, social media", count: 3, color: "#F97316" },
  { id: "coding", name: "Development & Code", icon: "💻", description: "Debug, refactor, generate code", count: 2, color: "#00D9FF" },
  { id: "business", name: "Business & Strategy", icon: "📊", description: "Planning, analysis, reports", count: 2, color: "#FFD700" },
  { id: "education", name: "Education & Learning", icon: "📚", description: "Lessons, study guides, quizzes", count: 1, color: "#00FF41" },
  { id: "creative", name: "Creative & Design", icon: "🎨", description: "Art, design, brainstorming", count: 0, color: "#FF1493" },
  { id: "career", name: "Career & HR", icon: "💼", description: "Resumes, interviews, reviews", count: 1, color: "#0891B2" },
  { id: "support", name: "Customer Support", icon: "🎧", description: "Replies, FAQs, tickets", count: 1, color: "#7C3AED" },
];
