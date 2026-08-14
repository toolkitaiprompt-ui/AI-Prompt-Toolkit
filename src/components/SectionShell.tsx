import type { ReactNode } from "react";
import useSeo from "../hooks/useSeo";

export default function SectionShell({
  title, description, keywords, children,
}: {
  title: string; description: string; keywords?: string; children: ReactNode;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="site-container section-lg">
      {children}
    </section>
  );
}
