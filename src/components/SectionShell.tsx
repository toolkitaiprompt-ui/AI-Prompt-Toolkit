import type { ReactNode } from "react";
import useSeo from "../hooks/useSeo";
import AdBanner from "./AdBanner";

export default function SectionShell({
  title, description, keywords, children, hideTopAd = false,
}: {
  title: string; description: string; keywords?: string; children: ReactNode;
  hideTopAd?: boolean;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="site-container section-lg">
      {/* Ad slot — top of every shell page (blog, prompts, playground, static, contact).
          Hidden on the tools directory so the tool list stays the main focus. */}
      {!hideTopAd && (
        <div className="mb-10">
          <AdBanner network="custom" />
        </div>
      )}
      {children}
      {/* Ad slot — bottom of every shell page */}
      <div className="mt-10">
        <AdBanner network="custom" />
      </div>
    </section>
  );
}
