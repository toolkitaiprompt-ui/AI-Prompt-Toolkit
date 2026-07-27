import { useEffect } from "react";

interface MonetagAdProps {
  zoneId?: string;
  format?: "banner" | "native" | "popunder";
  className?: string;
  style?: React.CSSProperties;
}

export default function MonetagAd({ 
  zoneId = "3076f54e152d9f15e31bb2c14575816e", 
  format = "banner",
  className = "",
  style 
}: MonetagAdProps) {
  
  useEffect(() => {
    // Monetag script ko dynamically load karte hain (agar pehle se nahi hai)
    const existingScript = document.querySelector('script[src*="monetag"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.monetag.com/script/monetag.js";
      script.async = true;
      script.onload = () => {
        // Monetag ready hone ke baad
        console.log("%c[Monetag] Script loaded successfully", "color: #22c55e");
      };
      document.head.appendChild(script);
    }
  }, []);

  // Banner ad ke liye
  if (format === "banner") {
    return (
      <div 
        className={`monetag-ad-banner overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-1 ${className}`}
        style={style}
      >
        <div 
          className="monetag-zone"
          data-monetag-zone={zoneId}
          style={{ minHeight: "90px", width: "100%" }}
        />
        <p className="px-2 pt-1 text-center text-[9px] text-slate-500">Advertisement</p>
      </div>
    );
  }

  // Native ad ke liye
  if (format === "native") {
    return (
      <div 
        className={`monetag-ad-native rounded-xl border border-white/10 bg-slate-900/40 p-4 ${className}`}
        style={style}
      >
        <div 
          className="monetag-native-zone"
          data-monetag-zone={zoneId}
          data-monetag-format="native"
        />
      </div>
    );
  }

  // Popunder ke liye (ye automatically trigger hota hai, isliye sirf placeholder)
  if (format === "popunder") {
    return null; // Popunder manually trigger karna padta hai
  }

  return null;
}

// Popunder trigger function (agar chahiye to use kar sakte ho)
export const triggerMonetagPopunder = (zoneId = "3076f54e152d9f15e31bb2c14575816e") => {
  if (typeof window !== "undefined" && (window as any).monetag) {
    try {
      (window as any).monetag.showPopunder?.(zoneId);
    } catch (e) {
      console.warn("Monetag popunder error:", e);
    }
  }
};