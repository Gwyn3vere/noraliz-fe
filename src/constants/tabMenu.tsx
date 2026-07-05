import { SquaresFourIcon, DiamondsFourIcon, FolderOpenIcon, GearSixIcon } from "@phosphor-icons/react";

export const TAB_MENU = [
  { id: 1, icon: SquaresFourIcon, value: "projects", title: "Projects" },
  { id: 2, icon: DiamondsFourIcon, value: "ui customs", title: "Customs" },
  { id: 3, icon: FolderOpenIcon, value: "assets", title: "Assets" },
  { id: 4, icon: GearSixIcon, value: "settings", title: "Settings" },
] as const;

export const NAV_MENU_LDP = [
  { id: 1, title: "Features", sectionId: "#features" },
  { id: 2, title: "Components", sectionId: "#components" },
  { id: 3, title: "Templates", sectionId: "#templates" },
  { id: 4, title: "Workflow", sectionId: "#workflow" },
  { id: 5, title: "Builders", sectionId: "#builders" },
] as const;
