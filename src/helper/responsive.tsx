import { normalizeStyles } from "./normalizeStyles";
import { buildStyle } from "./buildStyles";

export function getResponsiveStyle(rawStyles: any, breakpoint: string): React.CSSProperties {
  const normalized = normalizeStyles(rawStyles);
  const base = normalized.base || {};
  if (breakpoint === "base") return buildStyle(base);
  if (breakpoint === "tablet") return buildStyle({ ...base, ...(normalized.tablet ?? {}) });
  if (breakpoint === "mobile")
    return buildStyle({ ...base, ...(normalized.tablet ?? {}), ...(normalized.mobile ?? {}) });
  return buildStyle(base);
}
