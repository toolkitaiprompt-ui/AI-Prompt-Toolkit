import { useEffect } from "react";

export default function AdsterraPopup() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
