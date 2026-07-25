import { useEffect } from "react";

function injectSchema(data: Record<string, unknown>) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
  return script;
}

export function OrganizationSchema() {
  useEffect(() => {
    const el = injectSchema({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AI World Hub",
      url: "https://aiworldhub.site",
      logo: "https://aiworldhub.site/opengraph.jpg",
      description: "Free in-browser AI prompt engineering tools. Format, validate, optimize, and deploy AI prompts — no signup, 100% private.",
      foundingDate: "2026",
      contactPoint: {
        "@type": "ContactPoint",
        email: "toolkitaiprompt@gmail.com",
        contactType: "customer support",
      },
      sameAs: [
        "https://aiworldhub.site",
        "https://github.com/toolkitaiprompt-ui/AI-Prompt-Toolkit",
      ],
    });
    return () => el.remove();
  }, []);
  return null;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  useEffect(() => {
    const list = items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://aiworldhub.site${item.url}`,
    }));
    const el = injectSchema({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: list,
    });
    return () => el.remove();
  }, [items]);
  return null;
}

export function SoftwareApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  useEffect(() => {
    const el = injectSchema({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      description,
      url: `https://aiworldhub.site${url}`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: "AI World Hub",
      },
    });
    return () => el.remove();
  }, [name, description, url]);
  return null;
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  useEffect(() => {
    const el = injectSchema({
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      description,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        "@type": "Person",
        name: authorName || "AI World Hub Editorial Team",
      },
      publisher: {
        "@type": "Organization",
        name: "AI World Hub",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": window.location.href,
      },
      ...(imageUrl ? { image: imageUrl } : {}),
    });
    return () => el.remove();
  }, [headline, description, datePublished, dateModified, authorName, imageUrl]);
  return null;
}

export function FAQPageSchema({ questions }: { questions: { question: string; answer: string }[] }) {
  useEffect(() => {
    const mainEntity = questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    }));
    const el = injectSchema({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    });
    return () => el.remove();
  }, [questions]);
  return null;
}
