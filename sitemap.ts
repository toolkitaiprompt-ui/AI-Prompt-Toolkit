const SITE_URL = "https://promptforge-toolkit.vercel.app";

const ROUTES = [
  "/",
  "/tools",
  "/tools/prompt-variable-extractor",
  "/tools/json-schema-generator",
  "/tools/json-validator",
  "/tools/prompt-formatter",
  "/tools/prompt-cleaner",
  "/tools/token-estimator",
  "/blog",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
] as const;

type SitemapEntry = {
  url: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
  lastmod: string;
};

export function getSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split("T")[0];

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changefreq: route === "/" || route === "/tools" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/tools/") ? 0.9 : 0.7,
    lastmod: today,
  }));
}

export function generateSitemapXml(): string {
  const urls = getSitemapEntries()
    .map(
      (entry) => `<url>
  <loc>${entry.url}</loc>
  <lastmod>${entry.lastmod}</lastmod>
  <changefreq>${entry.changefreq}</changefreq>
  <priority>${entry.priority.toFixed(1)}</priority>
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}