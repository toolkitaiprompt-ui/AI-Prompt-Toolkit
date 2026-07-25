import { useEffect, useState } from "react";

declare global {
  interface Window {
    ADSENSE_CLIENT?: string | null;
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  slot?: string; // AdSense ad slot ID, optional for placeholder
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  label?: string;
}

export default function AdBanner({ slot = "XXXXXXXXXX", format = "auto", className = "", label = "Advertisement" }: AdBannerProps) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    // Check for client ID from window config or meta
    const w = window as any;
    const id = w.ADSENSE_CLIENT || (document.querySelector('meta[name="adsense-client"]') as HTMLMetaElement)?.content || null;
    setClientId(id);

    // Show placeholder only if ?ads_preview=1 or localhost (for owner to see layout)
    const isPreview = new URLSearchParams(window.location.search).has("ads_preview");
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setShowPlaceholder(isPreview || isLocal);

    // If client ID present, push ad
    if (id && w.adsbygoogle) {
      try {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.log("AdSense push error", e);
      }
    } else if (id) {
      // Try push after script loads
      const interval = setInterval(() => {
        try {
          if (w.adsbygoogle) {
            w.adsbygoogle.push({});
            clearInterval(interval);
          }
        } catch {}
      }, 1000);
      setTimeout(() => clearInterval(interval), 10000);
    }
  }, []);

  // If no client ID and not in preview mode — render nothing (no broken ad)
  if (!clientId && !showPlaceholder) {
    return null;
  }

  // Placeholder for layout testing (when no AdSense ID yet)
  if (!clientId && showPlaceholder) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-[16px] border border-dashed border-slate-700/60 bg-slate-900/40 p-6 text-center ${className}`}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label} — Placeholder</p>
        <p className="mt-2 max-w-[280px] text-xs leading-5 text-slate-600">
          AdSense ID add karte hi yahan real ads dikhenge. Abhi <code className="rounded bg-slate-800 px-1 py-0.5 text-[10px]">ca-pub-XXXXXXXXXX</code> placeholder hai.
        </p>
        <p className="mt-2 text-[10px] text-slate-700">Add ?ads_preview=1 to URL to see this in production</p>
      </div>
    );
  }

  // Real AdSense unit (will work once ca-pub- ID is set)
  const styleMap: Record<string, React.CSSProperties> = {
    auto: { display: "block" },
    horizontal: { display: "block", width: "100%", height: "90px" },
    vertical: { display: "block", width: "160px", height: "600px" },
    rectangle: { display: "block", width: "300px", height: "250px" },
  };

  return (
    <div className={`overflow-hidden rounded-[16px] border border-white/5 bg-slate-900/20 ${className}`}>
      <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-600">{label}</p>
      <ins
        className="adsbygoogle"
        style={styleMap[format] || styleMap.auto}
        data-ad-client={clientId || "ca-pub-XXXXXXXXXX"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
