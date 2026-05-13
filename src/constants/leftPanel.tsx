import type { MenuItem } from "@/types";

export const LEFT_PANEL_SECTIONS: MenuItem[] = [
  {
    id: "my-components",
    label: "My Components",
    badge: "Soon",
  },
  {
    id: "my-library",
    label: "My Library",
    badge: "Soon",
  },
  {
    id: "primitive-blocks",
    label: "Primitive Blocks",
    children: [
      {
        id: "container",
        label: "Containers",
        children: [
          { id: "blank-section", label: "Blank Section", thumbnail: "" } as MenuItem,
          { id: "columns-2", label: "Columns 2", thumbnail: "" } as MenuItem,
          { id: "columns-3", label: "Columns 3", thumbnail: "" } as MenuItem,
          { id: "divider", label: "Divider", thumbnail: "" } as MenuItem,
          { id: "spacer", label: "Spacer", thumbnail: "" } as MenuItem,
        ],
      },
      {
        id: "typography",
        label: "Typography",
        children: [
          { id: "text", label: "Text", thumbnail: "" } as MenuItem,
          { id: "heading", label: "Heading", thumbnail: "" } as MenuItem,
          { id: "blockquote", label: "Blockquote", thumbnail: "" } as MenuItem,
        ],
      },
      {
        id: "media",
        label: "Media",
        children: [
          { id: "image", label: "Image", thumbnail: "" } as MenuItem,
          { id: "video", label: "Video", thumbnail: "" } as MenuItem,
          { id: "icon", label: "Icon", thumbnail: "" } as MenuItem,
        ],
      },
      {
        id: "interactive",
        label: "Interactive",
        children: [
          { id: "button", label: "Button", thumbnail: "" } as MenuItem,
          { id: "form", label: "Form", thumbnail: "" } as MenuItem,
        ],
      },
      {
        id: "embed",
        label: "Embed",
        children: [
          { id: "map", label: "Google Maps", thumbnail: "" } as MenuItem,
          { id: "social", label: "Social Links", thumbnail: "" } as MenuItem,
        ],
      },
    ],
  },
  {
    id: "general",
    label: "General",
    children: [
      { id: "navigation", label: "Navigation", thumbnail: "" },
      { id: "footer", label: "Footer", thumbnail: "" },
      { id: "404", label: "404 Page", thumbnail: "" },
    ],
  },
  {
    id: "landing-page",
    label: "Landing Page",
    children: [
      { id: "hero-cta", label: "Hero + CTA", thumbnail: "" },
      { id: "features", label: "Features", thumbnail: "" },
      { id: "pricing", label: "Pricing", thumbnail: "" },
      { id: "faq", label: "FAQ", thumbnail: "" },
      { id: "social-proof", label: "Social Proof", thumbnail: "" },
      { id: "cta-section", label: "CTA Section", thumbnail: "" },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    children: [
      { id: "hero", label: "Hero", thumbnail: "" },
      { id: "about-me", label: "About Me", thumbnail: "" },
      { id: "skills", label: "Skills", thumbnail: "" },
      { id: "projects-grid", label: "Projects Grid", thumbnail: "" },
      { id: "testimonials", label: "Testimonials", thumbnail: "" },
      { id: "contact", label: "Contact", thumbnail: "" },
    ],
  },
];
