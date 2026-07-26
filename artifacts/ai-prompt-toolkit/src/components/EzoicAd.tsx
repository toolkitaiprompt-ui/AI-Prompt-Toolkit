import { useEffect, useRef } from "react";

declare const ezstandalone: {
  cmd: { push: (fn: () => void) => void };
  showAds: (opts?: Record<string, unknown>) => void;
} | undefined;

interface EzoicAdProps {
  className?: string;
}

export default function EzoicAd({ className = "" }: EzoicAdProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof ezstandalone !== "undefined" && ezstandalone?.cmd) {
          ezstandalone.cmd.push(function () {
            ezstandalone.showAds({});
          });
        }
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      className={`ezoic-ad my-6 ${className}`}
      style={{ minHeight: "90px" }}
    />
  );
}
