import { useEffect } from "react";

const ZONE_VIGNETTE = "11478668";

// Monetag vignette anchor. The vignette renders as a fullscreen overlay, so the
// anchor needs no visual box — this keeps pages free of empty "ad boxes" while
// the script still loads exactly once per page.
export default function AdBanner({ className = "" }: { className?: string }) {
  useEffect(() => {
    const scriptId = `monetag-script-${ZONE_VIGNETTE}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://n6wxm.com/vignette.min.js`;
      script.dataset.zone = ZONE_VIGNETTE;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id={`container-${ZONE_VIGNETTE}`} className={`ad-slot ${className}`} aria-hidden="true" />;
}
