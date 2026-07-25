const WAITLIST_KEY = "aiwh_pro_waitlist";

export interface WaitlistEntry {
  email: string;
  timestamp: number;
}

export function getWaitlistStatus(): { signedUp: boolean; email?: string } {
  try {
    const data = localStorage.getItem(WAITLIST_KEY);
    if (!data) return { signedUp: false };
    const parsed: WaitlistEntry = JSON.parse(data);
    return { signedUp: true, email: parsed.email };
  } catch {
    return { signedUp: false };
  }
}

export function joinWaitlist(email: string): boolean {
  try {
    const entry: WaitlistEntry = { email, timestamp: Date.now() };
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}
