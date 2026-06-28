import { useEffect, useRef } from "react";

type Props = {
  variant: "A" | "B" | "POPUP";
};

export default function AdsterraSlot({ variant }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;

    let key = "";
    let width = 728;
    let height = 90;
    let src = "";

    // POPUP Ad (Fixed bottom right)
    if (variant === "POPUP") {
      key = "767d367a31da85b9350b9995137e8013";
      width = 480;
      height = 300;
      src = "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";
    } 
    // BANNER A (Responsive)
    else if (variant === "A") {
      if (isMobile) {
        key = "1c2e2f123be7deb59e6e66ffcbe411b6";
        width = 320;
        height = 50;
        src = "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js";
      } else {
        key = "767d367a31da85b9350b9995137e8013";
        width = 728;
        height = 90;
        src = "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";
      }
    } 
    // BANNER B (Responsive)
    else if (variant === "B") {
      key = "73f728d3a093655bcc741155a24e5500";
      src = "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";
      if (isMobile) {
        width = 320;
        height = 100;
      } else {
        width = 728;
        height = 90;
      }
    }

    // Adsterra Options Script
    const scriptOptions = document.createElement("script");
    scriptOptions.type = "text/javascript";
    scriptOptions.text = `
      atOptions = {
        'key' : '${key}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    ref.current.appendChild(scriptOptions);

    // Adsterra Invoke Script
    const scriptInvoke = document.createElement("script");
    scriptInvoke.type = "text/javascript";
    scriptInvoke.src = src;
    ref.current.appendChild(scriptInvoke);

  }, [variant]);

  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;

  // Styling for Popup
  if (variant === "POPUP") {
    return (
      <div style={{ position: "fixed", bottom: "16px", right: "16px", zIndex: 9999 }}>
        <div ref={ref} style={{ maxWidth: "100%", width: isMobileView ? "300px" : "480px" }}></div>
      </div>
    );
  }

  // Styling for Banner Ads (Centered & Perfectly Sized)
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "16px 0", overflow: "hidden" }}>
      <div ref={ref} style={{ maxWidth: "100%", width: "100%" }}></div>
    </div>
  );
}
