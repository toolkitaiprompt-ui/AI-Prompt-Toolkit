// Utility for combining class names - simplified to avoid external dependencies
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
