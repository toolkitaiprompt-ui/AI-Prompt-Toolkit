import { useEffect, useRef } from "react";

/*
  Universal Banner Ad Component
  Supports: Adsterra, Monetag Direct Banner, or any network
  Usage: <AdBanner network="adsterra" zoneId="YOUR_ZONE_ID" />
*/

type Network = "adsterra" | "monetag-banner" | "custom";

interface AdBannerProps {
  network?: Network;
  zoneId?: string;
  className?: string;
}

const DEFAULT_ZONES: Record<Network, string> = {
  adsterra: "PLACEHOLDER_ADSTERRA_ZONE",
  "monetag-banner": "PLACEHOLDER_MONETAG_BANNER_ZONE",
  custom: "",
};

export default function AdBanner({
  network = "adsterra",
  zoneId,
  className = "",
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const finalZone = zoneId || DEFAULT_ZONES[network];

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    if (finalZone.includes("PLACEHOLDER")) return; // wait for real zone

    const container = containerRef.current;
    injected.current = true;

    if (network === "adsterra") {
      // Adsterra native banner script pattern
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        atOptions = {
          'key' : '${finalZone}',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      container.appendChild(script);

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = `//www.highperformanceformat.com/${finalZone}/invoke.js`;
      invokeScript.async = true;
      container.appendChild(invokeScript);
    } else if (network === "monetag-banner") {
      // Monetag direct banner (if they provide one)
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = `//monetag.com/${finalZone}.min.js`;
      container.appendChild(script);
    } else {
      // Custom iframe or script
      const script = document.createElement("script");
      script.src = finalZone;
      script.async = true;
      container.appendChild(script);
    }

    return () => {
      injected.current = false;
    };
  }, [network, finalZone]);

  // If still placeholder, show a styled reserved slot so user knows where ad will appear
  if (finalZone.includes("PLACEHOLDER")) {
    return (
      <div
        ref={containerRef}
        className={`ad-wrap ${className}`}
      >
        <span className="ad-label">Advertisement</span>
        <div className="ad-slot" style={{ minHeight: 250 }}>
          <span className="text-xs text-slate-600">
            Ad zone ready — replace PLACEHOLDER in AdBanner.tsx
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`ad-wrap ${className}`}
    >
      <span className="ad-label">Advertisement</span>
      <div className="ad-slot" style={{ minHeight: 250 }} />
    </div>
  );
}
