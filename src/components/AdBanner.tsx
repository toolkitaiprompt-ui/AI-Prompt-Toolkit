import { useEffect } from "react";

export default function AdBanner({ className = "" }) {
  const zoneId = "3076f54e152d9f15e31bb2c14575816e";
  
  useEffect(() => {
    const scriptId = `monetag-script-${zoneId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://alwingulla.com/88/tag.min.js?z=${zoneId}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Advertisement</span>
      <div id={`container-${zoneId}`} className="monetag-zone w-full flex justify-center min-h-[90px]" />
    </div>
  );
}
