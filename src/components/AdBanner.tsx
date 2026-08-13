import { useEffect, useRef } from "react";

/*
  Universal Banner Ad Component
  Supports: Adsterra, Monetag Direct Banner, or Monetag direct-link zones
  Usage: <AdBanner network="adsterra" zoneId="YOUR_ZONE_ID" />

  ─── HOW TO ENABLE ADS (money mode) ─────────────────────────────
  1. Get a banner zone from your ad network (Adsterra / Monetag / AdSense)
  2. Paste the zone ID into AD_CONFIG below (single source of truth)
  3. Rebuild + deploy — ad slots render automatically everywhere

  While AD_CONFIG zones are empty the component renders nothing
  (no empty "Advertisement" boxes on the live site).

  NOTE: Monetag "direct link" zones (omg10.com/4/xxxxx) are NOT iframe
  banners — they are click-to-ad URLs. We render them as visible
  sponsored boxes (label + CTA link) in every slot.
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
  // Monetag direct-link zone — rendered as a visible sponsored box in every slot
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
    // Custom direct-link zones render as link boxes — no script injection needed
    if (network === "custom") return;
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
    }

    return () => {
      injected.current = false;
    };
  }, [network, finalZone]);

  // No real zone configured — render nothing (no empty ad boxes on live site)
  if (!finalZone) {
    return null;
  }

  // Custom direct-link zone → visible sponsored box (click opens the ad)
  if (network === "custom") {
    return (
      <div className={`sp-wrap ${className}`}>
        <span className="sp-label">Advertisement</span>
        <a
          href={finalZone}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="sp-box"
          aria-label="Sponsored link"
        >
          <span className="sp-box-title">Sponsored</span>
          <span className="sp-box-cta">View Offer →</span>
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`sp-wrap ${className}`}
    >
      <span className="sp-label">Advertisement</span>
      <div className="sp-slot" style={{ minHeight: 250 }} />
    </div>
  );
}
