export function buildStyle(styles: Record<string, string> | undefined): React.CSSProperties {
  if (!styles) return {};
  const { transform, ...rest } = styles;
  const result: React.CSSProperties = { ...rest };
  if (transform) {
    result.transform = transform;
  }
  return result;
}
