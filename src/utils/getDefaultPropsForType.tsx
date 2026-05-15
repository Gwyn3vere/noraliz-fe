export function getDefaultPropsForType(type: string): any {
  switch (type) {
    case "text":
      return { content: "Your text here" };
    case "heading":
      return { content: "Your Heading", level: "h2" };
    case "image":
      return { src: "", alt: "Image", objectFit: "cover" };
    case "button":
      return { label: "Click Me", variant: "primary" };
    // ... các block khác
    default:
      return {};
  }
}
