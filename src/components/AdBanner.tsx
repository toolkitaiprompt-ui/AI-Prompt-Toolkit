import { useEffect, useRef, useState } from "react";

/*
  Universal Banner Ad Component — Adsterra only
  ─────────────────────────────────────────────
  - adsterra: real banner ads (multiple sizes). Zone keys in ADSTERRA_ZONES.
  - custom:   Monetag direct-link zone — visible sponsored box (click opens ad).
  
  CRASH-PROOF DESIGN (important):
  Third-party ad scripts (Adsterra invoke.js etc.) MUTATE the DOM around
  themselves (they remove their own script tags). React must NEVER try to
  remove/reconcile those nodes — that caused a removeChild crash before.
  So scripts are injected imperatively into a tiny inner <div ref> that
  React never re-renders, and fallbacks are separate React-owned nodes.
*/

type Network = "adsterra" | "custom";
export type AdSize = "leaderboard" | "rectangle" | "banner" | "skyscraper" | "halfpage";

interface AdBannerProps {
  network?: Network;
  zoneId?: string;
  size?: AdSize;
  className?: string;
  placement?: string;
}

// ─── ADSTERRA ZONES (owner's real zone keys) ───
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

// ─── NETWORK CONFIG ───
export const AD_CONFIG: Record<Network, { enabled: boolean; zoneId: string }> = {
  adsterra: { enabled: true, zoneId: "" },
  custom: { enabled: true, zoneId: "https://omg10.com/4/11565897" },
};

const SIZE_DIMS: Record<AdSize, string> = {
  leaderboard: "728x90",
  rectangle: "300x250",
  banner: "468x60",
  skyscraper: "160x600",
  halfpage: "160x300",
};

const MONETAG_DIRECT_ZONES = ["/go/offer-1", "/go/offer-2"];
let monetagZoneCounter = 0;
const ADSTERRA_ACTIVE_ATTR = "data-adsterra-active";

function nextMonetagZone() {
  monetagZoneCounter = (monetagZoneCounter + 1) % MONETAG_DIRECT_ZONES.length;
  return MONETAG_DIRECT_ZONES[monetagZoneCounter];
}

type SponsoredCardEvent = "sponsored_card_viewable" | "sponsored_card_click";
type DisplayTagEvent = "ad_display_tag_requested" | "ad_display_fallback";
type GtagEvent = (
  command: "event",
  eventName: SponsoredCardEvent | DisplayTagEvent,
  parameters: Record<string, string | boolean>,
) => void;

function trackSponsoredCardEvent(eventName: SponsoredCardEvent, zone: string, placement: string) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: GtagEvent }).gtag;
  if (!gtag) return;
  gtag("event", eventName, {
    event_category: "monetization",
    ad_network: "monetag",
    ad_format: "direct_link",
    ad_placement: placement,
    page_path: window.location.pathname,
    ad_zone: zone,
    non_interaction: eventName === "sponsored_card_viewable",
  });
}

function trackDisplayTagEvent(eventName: DisplayTagEvent, zone: string, size: string, placement: string) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: GtagEvent }).gtag;
  if (!gtag) return;
  gtag("event", eventName, {
    event_category: "monetization",
    ad_network: "adsterra",
    ad_format: "banner",
    ad_placement: placement,
    page_path: window.location.pathname,
    ad_zone: zone,
    ad_size: size,
    non_interaction: true,
  });
}

// Direct-link sponsored box fallback
function MonetagBox({ placement = "unspecified" }: { placement?: string }) {
  const [zone] = useState(nextMonetagZone);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const viewTracked = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const trackView = () => {
      if (viewTracked.current) return;
      viewTracked.current = true;
      trackSponsoredCardEvent("sponsored_card_viewable", zone, placement);
    };

    if (!("IntersectionObserver" in window)) {
      trackView();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: [0.5] },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [zone]);

  return (
    <a
      ref={cardRef}
      href={zone}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="promo-card"
      aria-label="View offer — sponsored; opens in a new tab"
      data-sponsored-zone={zone}
      onClick={() => trackSponsoredCardEvent("sponsored_card_click", zone, placement)}
    >
      <span className="promo-badge">Sponsored</span>
      <span className="promo-art" aria-hidden="true">
        <svg viewBox="0 0 300 250" width="300" height="250" role="presentation" style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1e293b" />
              <stop offset="0.5" stopColor="#0f172a" />
              <stop offset="1" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="300" height="250" rx="14" fill="url(#pg1)" />
          <circle cx="250" cy="30" r="60" fill="rgba(251,191,36,0.12)" />
          <circle cx="30" cy="220" r="70" fill="rgba(225,29,72,0.10)" />
          <rect x="24" y="20" width="70" height="26" rx="13" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.5)" strokeWidth="1"/>
          <text x="59" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24" letterSpacing="2">SPONSORED</text>
          <text x="150" y="85" textAnchor="middle" fontSize="22" fontWeight="800" fill="#ffffff" letterSpacing="0.5">TOP DEALS</text>
          <text x="150" y="110" textAnchor="middle" fontSize="12" fill="#94a3b8">Hand-picked offers for you</text>
          <rect x="24" y="130" width="252" height="1" fill="rgba(255,255,255,0.08)" />
          <text x="40" y="160" fontSize="11" fill="#cbd5e1">✓ Exclusive discounts</text>
          <text x="40" y="182" fontSize="11" fill="#cbd5e1">✓ Limited time only</text>
          <text x="40" y="204" fontSize="11" fill="#cbd5e1">✓ Safe &amp; verified offers</text>
          <rect x="40" y="216" width="220" height="24" rx="12" fill="url(#pg2)" />
          <text x="150" y="233" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">VIEW OFFER →</text>
        </svg>
      </span>
    </a>
  );
}

export default function AdBanner({
  network = "adsterra",
  zoneId,
  size = "rectangle",
  className = "",
  placement = "unspecified",
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [adFailed, setAdFailed] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Resolve network: if network="adsterra", use Adsterra. Otherwise use custom.
  const resolvedNetwork: Network = network as Network;

  // Resolve zone
  const resolvedZone = (() => {
    if (resolvedNetwork === "adsterra") {
      const zone = ADSTERRA_ZONES[size];
      if (isMobile && zone.mobileKey) {
        return { key: zone.mobileKey, width: zone.mobileWidth!, height: zone.mobileHeight! };
      }
      return { key: zone.key, width: zone.width, height: zone.height };
    }
    return {
      key: zoneId || AD_CONFIG.custom.zoneId,
      width: 0,
      height: 0,
    };
  })();

  const hasZone = resolvedNetwork === "adsterra" || !!resolvedZone.key;

  // ── Script injection ──
  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    if (!hasZone) return;

    const container = containerRef.current;
    injected.current = true;

    if (resolvedNetwork === "adsterra") {
      // Check if another Adsterra slot already exists
      const activeSlot = document.querySelector(`[${ADSTERRA_ACTIVE_ATTR}]`);
      if (activeSlot) {
        setAdFailed(true);
        trackDisplayTagEvent("ad_display_fallback", resolvedZone.key, SIZE_DIMS[size], placement);
        return;
      }
      container.setAttribute(ADSTERRA_ACTIVE_ATTR, resolvedZone.key);

      // Inject Adsterra atOptions config
      const atScript = document.createElement("script");
      atScript.type = "text/javascript";
      atScript.setAttribute("data-adsterra-config", "true");
      atScript.text = `
        atOptions = {
          'key' : '${resolvedZone.key}',
          'format' : 'iframe',
          'height' : ${resolvedZone.height},
          'width' : ${resolvedZone.width},
          'params' : {}
        };
      `;
      container.appendChild(atScript);

      // Inject Adsterra invoke.js script
      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = `https://www.highperformanceformat.com/${resolvedZone.key}/invoke.js`;
      invokeScript.async = true;
      invokeScript.setAttribute("data-adsterra", resolvedZone.key);
      container.appendChild(invokeScript);
      trackDisplayTagEvent("ad_display_tag_requested", resolvedZone.key, SIZE_DIMS[size], placement);

      // Fallback to direct-link if Adsterra doesn't fill within 7 seconds
      const fallbackTimer = window.setTimeout(() => {
        const hasAd = container.querySelector("iframe, a, ins, img[src]") !== null;
        if (!hasAd) {
          setAdFailed(true);
          trackDisplayTagEvent("ad_display_fallback", resolvedZone.key, SIZE_DIMS[size], placement);
        }
      }, 7000);

      return () => {
        window.clearTimeout(fallbackTimer);
        injected.current = false;
        try {
          container.querySelectorAll("script[data-adsterra], script[data-adsterra-config]").forEach((n) => {
            if (n.parentNode === container) n.parentNode.removeChild(n);
          });
          container.removeAttribute(ADSTERRA_ACTIVE_ATTR);
        } catch { /* ignore */ }
      };
    }

    return () => {
      injected.current = false;
    };
  }, [resolvedNetwork, resolvedZone.key, resolvedZone.width, resolvedZone.height, hasZone, isMobile]);

  if (!hasZone) {
    return null;
  }

  // Direct-link fallback
  if (resolvedNetwork === "custom") {
    return (
      <div className={`promo-wrap ${className}`}>
        <span className="promo-label">Advertisement</span>
        <MonetagBox placement={placement} />
      </div>
    );
  }

  return (
    <div className={`promo-wrap ${className}`}>
      <span className="promo-label">Advertisement</span>
      <div className="promo-slot" style={{ minHeight: resolvedZone.height }} data-size={SIZE_DIMS[size]}>
        <div ref={containerRef} />
      </div>
      {/* Fallback: if Adsterra fails, show direct-link */}
      {adFailed && (
        <div className="promo-fallback">
          <MonetagBox placement={`${placement}-fallback`} />
        </div>
      )}
    </div>
  );
}
