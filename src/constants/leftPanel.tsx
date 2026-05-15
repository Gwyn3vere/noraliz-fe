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
    children: [],
  },
  {
    id: "general",
    label: "General",
    children: [
      { id: "navigation", label: "Navigation", thumbnail: "", kind: "section" },
      { id: "footer", label: "Footer", thumbnail: "", kind: "section" },
      { id: "404", label: "404 Page", thumbnail: "", kind: "section" },
    ],
  },
  {
    id: "landing-page",
    label: "Landing Page",
    children: [
      { id: "hero-cta", label: "Hero + CTA", thumbnail: "", kind: "section" },
      { id: "features", label: "Features", thumbnail: "", kind: "section" },
      { id: "pricing", label: "Pricing", thumbnail: "", kind: "section" },
      { id: "faq", label: "FAQ", thumbnail: "", kind: "section" },
      { id: "social-proof", label: "Social Proof", thumbnail: "", kind: "section" },
      { id: "cta-section", label: "CTA Section", thumbnail: "", kind: "section" },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    children: [
      { id: "hero", label: "Hero", thumbnail: "", kind: "section" },
      { id: "about-me", label: "About Me", thumbnail: "", kind: "section" },
      { id: "skills", label: "Skills", thumbnail: "", kind: "section" },
      { id: "projects-grid", label: "Projects Grid", thumbnail: "", kind: "section" },
      { id: "testimonials", label: "Testimonials", thumbnail: "", kind: "section" },
      { id: "contact", label: "Contact", thumbnail: "", kind: "section" },
    ],
  },
];
