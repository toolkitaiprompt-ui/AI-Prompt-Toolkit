import { useEffect, useState } from "react";

declare global {
  interface Window {
    ADSENSE_CLIENT?: string | null;
    adsbygoogle?: any[];
    monetag?: any;
  }
}

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle" | "monetag-banner";
  className?: string;
  label?: string;
  monetagZone?: string;
}

export default function AdBanner({ 
  slot = "XXXXXXXXXX", 
  format = "auto", 
  className = "", 
  label = "Advertisement",
  monetagZone = "3076f54e152d9f15e31bb2c14575816e"
}: AdBannerProps) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const w = window as any;
    const id = w.ADSENSE_CLIENT || (document.querySelector('meta[name="adsense-client"]') as HTMLMetaElement)?.content || null;
    setClientId(id);

    const isPreview = new URLSearchParams(window.location.search).has("ads_preview");
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setShowPlaceholder(isPreview || isLocal);

    if (id && w.adsbygoogle) {
      try {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.log("AdSense push error", e);
      }
    } else if (id) {
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

  // Monetag Banner
  if (format === "monetag-banner") {
    return (
      <div className={`overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 ${className}`}>
        <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500 text-center">Advertisement</p>
        <div 
          className="monetag-zone"
          data-monetag-zone={monetagZone}
          style={{ minHeight: "90px", width: "100%" }}
        />
      </div>
    );
  }

  if (!clientId && !showPlaceholder) {
    return null;
  }

  if (!clientId && showPlaceholder) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-[16px] border border-dashed border-slate-700/60 bg-slate-900/40 p-6 text-center ${className}`}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label} — Placeholder</p>
        <p className="mt-2 max-w-[280px] text-xs leading-5 text-slate-600">
          AdSense ID add karte hi yahan real ads dikhenge.
        </p>
      </div>
    );
  }

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
