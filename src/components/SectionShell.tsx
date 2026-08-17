import type { ReactNode } from "react";
import useSeo from "../hooks/useSeo";
import AdBanner from "./AdBanner";

export default function SectionShell({
  title, description, keywords, children,
}: {
  title: string; description: string; keywords?: string; children: ReactNode;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="site-container section-lg">
      {/* Ad slot — top of every shell page (blog, prompts, playground, static, contact) */}
      <div className="mb-10">
        <AdBanner size="leaderboard" />
      </div>
      {children}
      {/* Ad slot — bottom of every shell page */}
      <div className="mt-10">
        <AdBanner size="rectangle" />
      </div>
    </section>
  );
}
