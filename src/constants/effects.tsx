export const MIX_BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

export const FILTER_UNITS: Record<string, string[]> = {
  blur: ["px", "rem", "em"],
  brightness: ["", "%"],
  contrast: ["", "%"],
  grayscale: ["%"],
  "hue-rotate": ["deg", "turn", "rad"],
  invert: ["%"],
  saturate: ["", "%"],
  sepia: ["%"],
};

export const AVAILABLE_FILTERS = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
];

export const BOX_SHADOW_PRESETS = ["none", "outside", "inset"] as const;
export type ShadowType = (typeof BOX_SHADOW_PRESETS)[number];
