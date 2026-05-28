import { useCallback } from "react";

export function useTypographyStyles(
  currentStyles: Record<string, string>,
  updateStyles: (styles: Record<string, string>) => void,
) {
  const toggleStyle = useCallback(
    (property: string, value: string, fallback: string) => {
      const current = currentStyles[property];
      if (current === value || (!current && fallback === value)) {
        updateStyles({ [property]: fallback });
      } else {
        updateStyles({ [property]: value });
      }
    },
    [currentStyles, updateStyles],
  );

  const isActive = useCallback(
    (property: string, value: string) => {
      const current = currentStyles[property];
      return current === value;
    },
    [currentStyles],
  );

  return { toggleStyle, isActive };
}
