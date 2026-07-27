import { useEffect } from "react";

export default function MonetagScripts() {
  useEffect(() => {
    // Check if scripts are already loaded
    const hasScript1 = document.querySelector('script[src*="quge5.com/88/tag.min.js"]');
    const hasScript2 = document.querySelector('script[src*="omg10.com/4/11431820"]');

    // Load first script (Zone 264272)
    if (!hasScript1) {
      const script1 = document.createElement("script");
      script1.src = "https://quge5.com/88/tag.min.js";
      script1.setAttribute("data-zone", "264272");
      script1.setAttribute("async", "true");
      script1.setAttribute("data-cfasync", "false");
      document.body.appendChild(script1);
    }

    // Load second script (Direct Link)
    if (!hasScript2) {
      const script2 = document.createElement("script");
      script2.src = "https://omg10.com/4/11431820";
      script2.setAttribute("async", "true");
      document.body.appendChild(script2);
    }

    // Cleanup on unmount (optional)
    return () => {
      // We don't remove scripts to avoid issues
    };
  }, []);

  return null;
}