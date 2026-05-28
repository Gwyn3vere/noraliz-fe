import { type ShadowType } from "@/constants/effects";

export function parseBoxShadow(value: string): {
  type: ShadowType;
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
} {
  if (!value || value === "none") return { type: "none" as ShadowType, x: "", y: "", blur: "", spread: "", color: "" };
  const inset = value.includes("inset");
  const parts = value.replace(/inset/g, "").trim().split(/\s+/);
  const numbers = parts.filter((p) => /^-?\d/.test(p));
  const color = parts.find((p) => !/^-?\d/.test(p)) || "";
  return {
    type: (inset ? "inset" : "outside") as ShadowType,
    x: numbers[0] || "",
    y: numbers[1] || "",
    blur: numbers[2] || "",
    spread: numbers[3] || "",
    color: color || "#000000",
  };
}

export function buildBoxShadow(
  type: ShadowType,
  x: string,
  y: string,
  blur: string,
  spread: string,
  color: string,
): string {
  if (type === "none") return "none";
  const finalX = x || "0px";
  const finalY = y || "0px";
  const finalBlur = blur || "0px";
  const finalSpread = spread || "0px";
  const finalColor = color || "#000000";
  const inset = type === "inset" ? "inset " : "";
  return `${inset}${finalX} ${finalY} ${finalBlur} ${finalSpread} ${finalColor}`;
}
