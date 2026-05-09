import type { AssetSummary } from "@/types";

export const mockAssets: AssetSummary[] = [
  {
    id: "1",
    fileName: "hero-banner.png",
    fileUrl: "https://picsum.photos/800",
    fileSize: 256000,
    mimeType: "image/png",
    createdAt: "2026-05-06T10:30:00Z",
    name: "hero-banner.png",
    sizeFormatted: "250 KB",
  },
  {
    id: "2",
    fileName: "profile-photo.jpg",
    fileUrl: "https://picsum.photos/800/500",
    fileSize: 128000,
    mimeType: "image/jpeg",
    createdAt: "2026-05-05T14:20:00Z",
    name: "profile-photo.jpg",
    sizeFormatted: "125 KB",
  },
  {
    id: "3",
    fileName: "logo-icon.svg",
    fileUrl: "https://picsum.photos/500/700",
    fileSize: 32000,
    mimeType: "image/svg+xml",
    createdAt: "2026-05-04T09:15:00Z",
    name: "logo-icon.svg",
    sizeFormatted: "31 KB",
  },
  {
    id: "4",
    fileName: "background-pattern.webp",
    fileUrl: "https://picsum.photos/400",
    fileSize: 512000,
    mimeType: "image/webp",
    createdAt: "2026-05-03T16:45:00Z",
    name: "background-pattern.webp",
    sizeFormatted: "500 KB",
  },
];
