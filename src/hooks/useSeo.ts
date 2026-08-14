import { useEffect } from "react";
import { getSeoForPath } from "../seoConfig";

export default function useSeo(title?: string, description?: string, keywords?: string) {
  const configSeo = getSeoForPath(window.location.pathname);

  const finalTitle = configSeo.title || title || "AI World Hub";
  const finalDesc = configSeo.description || description || "";
  const finalKeywords = configSeo.keywords || keywords || "";

  useEffect(() => {
    document.title = finalTitle;

    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      return tag;
    };

    const ensurePropertyMeta = (property: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      return tag;
    };

    const ensureLink = (rel: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) { tag = document.createElement("link"); tag.setAttribute("rel", rel); document.head.appendChild(tag); }
      return tag;
    };

    ensureMeta("description").setAttribute("content", finalDesc);
    ensureMeta("keywords").setAttribute("content", finalKeywords);
    ensureMeta("robots").setAttribute("content", "index, follow");
    ensureMeta("twitter:card").setAttribute("content", "summary_large_image");
    ensureMeta("twitter:title").setAttribute("content", finalTitle);
    ensureMeta("twitter:description").setAttribute("content", finalDesc);
    ensurePropertyMeta("og:title").setAttribute("content", finalTitle);
    ensurePropertyMeta("og:description").setAttribute("content", finalDesc);
    ensurePropertyMeta("og:type").setAttribute("content", "website");
    ensureLink("canonical").setAttribute("href", window.location.href);

    // Hreflang injection for international SEO (#10)
    const hreflangs = ["en", "en-US", "en-GB", "en-IN", "x-default"];
    // Remove existing hreflang to avoid duplicates
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    hreflangs.forEach((lang) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang);
      link.setAttribute("href", window.location.href.split('?')[0]);
      document.head.appendChild(link);
    });
  }, [finalTitle, finalDesc, finalKeywords]);
}
