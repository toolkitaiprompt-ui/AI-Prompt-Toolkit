import { useEffect, useRef, useState } from "react";

/*
  Universal Banner Ad Component — Adsterra + Monetag support
  ─────────────────────────────────────────────────────────
  Networks:
  - adsterra: real banner ads (multiple sizes). Zone keys in ADSTERRA_ZONES.
  - custom:   Monetag direct-link zone — rendered as sponsored box (click opens ad).
  - raw-html: paste ANY ad network snippet (script/ins) — injected into slot.
  - monetag-banner: reserved.

  Usage:
    <AdBanner />                          → default network (first enabled) rectangle
    <AdBanner size="leaderboard" />       → 728x90 desktop / 320x50 mobile (auto)
    <AdBanner size="rectangle" />         → 300x250
    <AdBanner size="banner" />            → 468x60
    <AdBanner size="skyscraper" />        → 160x600
    <AdBanner size="halfpage" />          → 160x300
    <AdBanner network="custom" />         → Monetag smartlink sponsored box

  While no zone is configured the component renders nothing.
*/

type Network = "adsterra" | "monetag-banner" | "custom" | "raw-html";
export type AdSize = "leaderboard" | "rectangle" | "banner" | "skyscraper" | "halfpage";

interface AdBannerProps {
  network?: Network;
  zoneId?: string;
  size?: AdSize;
  className?: string;
}

// ─── ADSTERRA ZONES (owner's real zone keys, 17 Aug 2026) ───
// leaderboard = 728x90 desktop / 320x50 mobile (responsive via mobileKey)
export const ADSTERRA_ZONES: Record<
  AdSize,
  { key: string; width: number; height: number; mobileKey?: string; mobileWidth?: number; mobileHeight?: number }
> = {
  leaderboard: {
    key: "efb96f4493e16d22d2ab3bb6495cd81e", width: 728, height: 90,
    mobileKey: "46f7b6db75df38088c8ec175e2049c67", mobileWidth: 320, mobileHeight: 50,
  },
  rectangle: { key: "523e38092d3627240bb849c8a280d954", width: 300, height: 250 },
  banner: { key: "8a30f2d66b3c55158a9fdd7e6c3d4763", width: 468, height: 60 },
  skyscraper: { key: "8ff47ce96b20d2f63a8ed961d42fc6f9", width: 160, height: 600 },
  halfpage: { key: "d9264105487f390df9af865c43686c92", width: 160, height: 300 },
};

// ─── NETWORK CONFIG (single source of truth) ───
export const AD_CONFIG: Record<Network, { enabled: boolean; zoneId: string }> = {
  adsterra: { enabled: true, zoneId: "" },
  "monetag-banner": { enabled: false, zoneId: "" },
  // Monetag direct-link smartlink (11565897) — kept for future/fallback use
  custom: { enabled: false, zoneId: "https://omg10.com/4/11565897" },
  "raw-html": { enabled: false, zoneId: "" },
};

const SIZE_DIMS: Record<AdSize, string> = {
  leaderboard: "728x90",
  rectangle: "300x250",
  banner: "468x60",
  skyscraper: "160x600",
  halfpage: "160x300",
};

export default function AdBanner({
  network = "adsterra",
  zoneId,
  size = "rectangle",
  className = "",
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  // Track viewport so leaderboard can switch 728x90 <-> 320x50
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Resolve which network actually renders:
  // 1. explicit zoneId prop wins
  // 2. otherwise fall back to the FIRST enabled network in AD_CONFIG
  const resolvedNetwork: Network = (() => {
    if (zoneId) return network;
    if (AD_CONFIG[network]?.enabled) return network;
    const enabled = (Object.keys(AD_CONFIG) as Network[]).find((k) => AD_CONFIG[k].enabled);
    return enabled ?? network;
  })();

  // Resolve zone:
  // - adsterra: from ADSTERRA_ZONES by size (responsive for leaderboard)
  // - others:   zoneId prop > AD_CONFIG zone
  const resolvedZone = (() => {
    if (resolvedNetwork === "adsterra") {
      const zone = ADSTERRA_ZONES[size];
      if (isMobile && zone.mobileKey) {
        return { key: zone.mobileKey, width: zone.mobileWidth!, height: zone.mobileHeight! };
      }
      return { key: zone.key, width: zone.width, height: zone.height };
    }
    return {
      key: zoneId || (AD_CONFIG[resolvedNetwork]?.enabled ? AD_CONFIG[resolvedNetwork].zoneId : ""),
      width: 0,
      height: 0,
    };
  })();

  const hasZone = resolvedNetwork === "adsterra" || !!resolvedZone.key;

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    if (!hasZone) return;

    const container = containerRef.current;
    injected.current = true;

    if (resolvedNetwork === "adsterra") {
      // Adsterra native iframe banner — official pattern
      const atScript = document.createElement("script");
      atScript.type = "text/javascript";
      atScript.innerHTML = `
        atOptions = {
          'key' : '${resolvedZone.key}',
          'format' : 'iframe',
          'height' : ${resolvedZone.height},
          'width' : ${resolvedZone.width},
          'params' : {}
        };
      `;
      container.appendChild(atScript);

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = `//www.highperformanceformat.com/${resolvedZone.key}/invoke.js`;
      invokeScript.async = true;
      container.appendChild(invokeScript);

      return () => {
        container.innerHTML = "";
        injected.current = false;
      };
    }

    if (resolvedNetwork === "raw-html") {
      const slot = container.querySelector<HTMLDivElement>(".sp-slot");
      if (!slot) return;
      slot.innerHTML = "";
      const wrapper = document.createElement("div");
      wrapper.innerHTML = resolvedZone.key;
      Array.from(wrapper.querySelectorAll("script")).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.text = oldScript.text || "";
        oldScript.replaceWith(newScript);
      });
      slot.appendChild(wrapper);
      return () => {
        slot.innerHTML = "";
        injected.current = false;
      };
    }

    if (resolvedNetwork === "monetag-banner") {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = `//monetag.com/${resolvedZone.key}.min.js`;
      container.appendChild(script);
    }

    return () => {
      injected.current = false;
    };
  }, [resolvedNetwork, resolvedZone.key, resolvedZone.width, resolvedZone.height, hasZone, isMobile]);

  // No zone configured — render nothing
  if (!hasZone) {
    return null;
  }

  // Monetag direct-link → visible sponsored box
  if (resolvedNetwork === "custom") {
    return (
      <div className={`sp-wrap ${className}`}>
        <span className="sp-label">Advertisement</span>
        <a href={resolvedZone.key} target="_blank" rel="sponsored noopener noreferrer" className="sp-box" aria-label="Sponsored ad — opens offer in new tab">
          <span className="sp-box-badge">Sponsored</span>
          <span className="sp-box-icon" aria-hidden="true">✦</span>
          <span className="sp-box-headline">Exclusive Deals &amp; Offers</span>
          <span className="sp-box-sub">Hand-picked for you — limited time</span>
          <span className="sp-box-btn">View Offer<span aria-hidden="true"> →</span></span>
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`sp-wrap ${className}`}>
      <span className="sp-label">Advertisement</span>
      <div className="sp-slot" style={{ minHeight: resolvedNetwork === "adsterra" ? resolvedZone.height : 250 }} data-size={resolvedNetwork === "adsterra" ? SIZE_DIMS[size] : ""}>
        {/* ad code injected via useEffect */}
      </div>
    </div>
  );
}
