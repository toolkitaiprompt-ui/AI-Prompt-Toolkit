import { useRef } from "react";

const ZONE_BANNER = "264272";

// Module-level counter keeps container IDs unique when multiple ad slots
// render on the same page (Monetag fills every `.monetag-zone` element).
let slotCounter = 0;

type MonetagAdProps = {
  zone?: string;
  format?: "banner" | "rectangle" | "inline";
  className?: string;
  minHeight?: number;
  /** Renders the slot without the bordered card (e.g. inside an existing card). */
  bare?: boolean;
};

export default function MonetagAd({
  zone = ZONE_BANNER,
  format = "banner",
  className = "",
  minHeight,
  bare = false,
}: MonetagAdProps) {
  // First instance keeps the exact `container-{zone}` id Monetag documents;
  // later instances get a unique suffix so multiple slots fill independently.
  const instance = useRef(++slotCounter).current;
  const containerId = `container-${zone}${instance > 1 ? `-${instance}` : ""}`;
  const minH = minHeight ?? (format === "rectangle" ? 250 : 90);

  return (
    <div className={`${bare ? "w-full" : "ad-wrap"} ${className}`}>
      {!bare && <span className="ad-label">Advertisement</span>}
      <div
        id={containerId}
        className="monetag-zone ad-slot"
        style={{ minHeight: minH }}
        aria-label="Advertisement"
      />
    </div>
  );
}
