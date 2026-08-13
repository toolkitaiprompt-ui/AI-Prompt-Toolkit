import { useEffect, useRef } from "react";

/*
  Universal Banner Ad Component
  Supports: Adsterra, Monetag Direct Banner, or any network
  Usage: <AdBanner network="adsterra" zoneId="YOUR_ZONE_ID" />

  ─── HOW TO ENABLE ADS (money mode) ─────────────────────────────
  1. Get a banner zone from your ad network (Adsterra / Monetag / AdSense)
  2. Paste the zone ID into AD_CONFIG below (single source of truth)
  3. Rebuild + deploy — ad slots render automatically everywhere

  While AD_CONFIG zones are empty the component renders nothing
  (no empty "Advertisement" boxes on the live site).
*/

type Network = "adsterra" | "monetag-banner" | "custom";

interface AdBannerProps {
  network?: Network;
  zoneId?: string;
  className?: string;
}

// ⭐ CONFIGURE YOUR REAL AD ZONES HERE (leave empty to hide slots)
export const AD_CONFIG: Record<Network, { enabled: boolean; zoneId: string }> = {
  adsterra: { enabled: false, zoneId: "" },
  "monetag-banner": { enabled: false, zoneId: "" },
  // Monetag direct-link banner (omg10.com/4/<zone>) — renders in every ad slot
  custom: { enabled: true, zoneId: "https://omg10.com/4/11565896" },
};

export default function AdBanner({
  network = "adsterra",
  zoneId,
  className = "",
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  // Real zone = explicit prop > AD_CONFIG > nothing (placeholder never ships)
  const finalZone = zoneId || (AD_CONFIG[network].enabled ? AD_CONFIG[network].zoneId : "");

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    if (!finalZone) return; // no real zone configured yet — render nothing

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
      // Custom direct-link banner (Monetag/Adsterra direct link) — iframe embed
      const iframe = document.createElement("iframe");
      iframe.src = finalZone;
      iframe.width = "300";
      iframe.height = "250";
      iframe.style.border = "0";
      iframe.style.display = "block";
      iframe.style.margin = "0 auto";
      iframe.style.maxWidth = "100%";
      iframe.loading = "lazy";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("scrolling", "no");
      container.appendChild(iframe);
    }

    return () => {
      injected.current = false;
    };
  }, [network, finalZone]);

  // No real zone configured — render nothing (no empty ad boxes on live site)
  if (!finalZone) {
    return null;
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
