/*
  AdBanner — Clean stub component.
  All advertising networks (Monetag, Adsterra) have been removed per site owner request.
*/

export type AdSize = "leaderboard" | "rectangle" | "banner" | "skyscraper" | "halfpage";

export interface AdBannerProps {
  network?: string;
  zoneId?: string;
  size?: AdSize;
  className?: string;
  placement?: string;
}

export const ADSTERRA_ZONES: Record<
  AdSize,
  { key: string; width: number; height: number; mobileKey?: string; mobileWidth?: number; mobileHeight?: number }
> = {
  leaderboard: { key: "", width: 728, height: 90 },
  rectangle: { key: "", width: 300, height: 250 },
  banner: { key: "", width: 468, height: 60 },
  skyscraper: { key: "", width: 160, height: 600 },
  halfpage: { key: "", width: 160, height: 300 },
};

export const AD_CONFIG: Record<string, { enabled: boolean; zoneId: string }> = {
  adsterra: { enabled: false, zoneId: "" },
  "monetag-ipp": { enabled: false, zoneId: "" },
  "monetag-banner": { enabled: false, zoneId: "" },
  custom: { enabled: false, zoneId: "" },
};

export default function AdBanner(_props: AdBannerProps) {
  // All ads removed — renders nothing.
  return null;
}
