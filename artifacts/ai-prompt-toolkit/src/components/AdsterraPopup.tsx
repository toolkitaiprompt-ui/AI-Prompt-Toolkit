
import { useEffect } from "react";

export default function AdsterraPopup() {
  useEffect(() => {
    // Yeh Adsterra ka official Social Bar/Popup script hai.
    // Yeh direct website par popup banayega.
    const script = document.createElement("script");
    script.src = "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      // Jab page change ho, toh purana popup hatt jaye
      document.body.removeChild(script);
      const adElements = document.querySelectorAll('[id*="adsterra"], [id*="cpm"], [class*="adsterra"], [class*="cpm"]');
      adElements.forEach(el => el.remove());
    };
  }, []);

  return null;
}
