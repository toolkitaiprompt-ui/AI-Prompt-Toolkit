export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: "writing", name: "Writing & Content", icon: "✍️", description: "Blog posts, articles, copywriting", count: 24, color: "#DB2777" },
  { id: "marketing", name: "Marketing & Sales", icon: "📢", description: "Ads, emails, social media", count: 18, color: "#F97316" },
  { id: "coding", name: "Development & Code", icon: "💻", description: "Debug, refactor, generate code", count: 21, color: "#00D9FF" },
  { id: "business", name: "Business & Strategy", icon: "📊", description: "Planning, analysis, reports", count: 15, color: "#FFD700" },
  { id: "education", name: "Education & Learning", icon: "📚", description: "Lessons, study guides, quizzes", count: 12, color: "#00FF41" },
  { id: "creative", name: "Creative & Design", icon: "🎨", description: "Art, design, brainstorming", count: 16, color: "#FF1493" },
  { id: "career", name: "Career & HR", icon: "💼", description: "Resumes, interviews, reviews", count: 10, color: "#0891B2" },
  { id: "support", name: "Customer Support", icon: "🎧", description: "Replies, FAQs, tickets", count: 8, color: "#7C3AED" },
];
