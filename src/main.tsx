import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Cloudflare Pages does not apply _redirects host patterns to the pages.dev alias.
// Redirect preview-host visitors before the SPA renders, preserving the full URL.
const isPagesPreviewHost = window.location.hostname.endsWith(".pages.dev");
if (isPagesPreviewHost) {
  const canonicalUrl = new URL(window.location.href);
  canonicalUrl.hostname = "aiworldhub.site";
  canonicalUrl.protocol = "https:";
  window.location.replace(canonicalUrl.toString());
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
