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

type Network = "adsterra" | "monetag-banner" | "custom" | "raw-html";

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
  // ⭐ REAL BANNER CODE: Monetag dashboard → Sites → Add zone → Banner →
  //    Get tag → paste the full code below (script/ins snippet). It will
  //    render as a real banner in every ad slot.
  "raw-html": { enabled: false, zoneId: "" },
};

export default function AdBanner({
  network = "adsterra",
  zoneId,
  className = "",
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  // Resolve which network actually renders:
  // 1. explicit zoneId prop wins
  // 2. otherwise fall back to the FIRST enabled network in AD_CONFIG
  //    (so <AdBanner /> without props still renders when custom is enabled)
  const resolvedNetwork: Network = (() => {
    if (zoneId) return network;
    if (AD_CONFIG[network]?.enabled) return network;
    const enabled = (Object.keys(AD_CONFIG) as Network[]).find((k) => AD_CONFIG[k].enabled);
    return enabled ?? network;
  })();

  const finalZone = zoneId || (AD_CONFIG[resolvedNetwork]?.enabled ? AD_CONFIG[resolvedNetwork].zoneId : "");

  useEffect(() => {
    // Custom direct-link zones render as link boxes — no script injection needed
    if (resolvedNetwork === "custom") return;
    if (injected.current || !containerRef.current) return;
    if (!finalZone) return; // no real zone configured yet — render nothing

    const container = containerRef.current;
    injected.current = true;

    if (resolvedNetwork === "raw-html") {
      // Real banner code (script/ins snippet) — inject into the slot and execute it
      const slot = container.querySelector<HTMLDivElement>(".sp-slot");
      if (!slot) return;
      slot.innerHTML = "";
      const wrapper = document.createElement("div");
      wrapper.innerHTML = finalZone;
      // Re-create <script> nodes so they actually execute
      Array.from(wrapper.querySelectorAll("script")).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value),
        );
        newScript.text = oldScript.text || "";
        oldScript.replaceWith(newScript);
      });
      slot.appendChild(wrapper);
      return () => {
        slot.innerHTML = "";
        injected.current = false;
      };
    }

    if (resolvedNetwork === "adsterra") {
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
    } else if (resolvedNetwork === "monetag-banner") {
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
  }, [resolvedNetwork, finalZone]);

  // No real zone configured — render nothing (no empty ad boxes on live site)
  if (!finalZone) {
    return null;
  }

  // Real banner code (raw-html) → container div where the snippet is injected
  if (resolvedNetwork === "raw-html") {
    return (
      <div
        ref={containerRef}
        className={`sp-wrap ${className}`}
      >
        <span className="sp-label">Advertisement</span>
        <div className="sp-slot" style={{ minHeight: 250 }}>
          {/* banner code injected here via useEffect */}
        </div>
      </div>
    );
  }

  // Custom direct-link zone → professional-looking ad creative (click opens the ad)
  if (resolvedNetwork === "custom") {
    return (
      <div className={`sp-wrap ${className}`}>
        <span className="sp-label">Advertisement</span>
        <a
          href={finalZone}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="sp-box"
          aria-label="Sponsored ad — opens offer in new tab"
        >
          <span className="sp-box-badge">Sponsored</span>
          <span className="sp-box-icon" aria-hidden="true">✦</span>
          <span className="sp-box-headline">Exclusive Deals &amp; Offers</span>
          <span className="sp-box-sub">Hand-picked for you — limited time</span>
          <span className="sp-box-btn">
            View Offer
            <span aria-hidden="true"> →</span>
          </span>
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
