type BreakpointStyles = {
  base: Record<string, any>;
  tablet?: Record<string, any>;
  mobile?: Record<string, any>;
};

const BREAKPOINT_KEYS = new Set(["base", "tablet", "mobile"]);

export function normalizeStyles(styles: any): BreakpointStyles {
  if (!styles || typeof styles !== "object") {
    return { base: {} };
  }

  const hasBreakpointKey = Object.keys(styles).some((key) => BREAKPOINT_KEYS.has(key));

  if (hasBreakpointKey) {
    const { base = {}, tablet, mobile, ...flatStyles } = styles;

    const extraFlat: Record<string, any> = {};
    for (const [k, v] of Object.entries(flatStyles)) {
      if (!BREAKPOINT_KEYS.has(k)) {
        extraFlat[k] = v;
      }
    }

    return {
      base: { ...extraFlat, ...base },
      ...(tablet ? { tablet: { ...extraFlat, ...tablet } } : {}),
      ...(mobile ? { mobile: { ...extraFlat, ...mobile } } : {}),
    };
  }

  const { tablet, mobile, ...rest } = styles;
  return {
    base: rest,
    ...(tablet ? { tablet } : {}),
    ...(mobile ? { mobile } : {}),
  };
}
