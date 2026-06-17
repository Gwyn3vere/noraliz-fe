import React, { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import type { MenuItem, PrimitiveBlock } from "@/types";
import { LEFT_PANEL_SECTIONS } from "@/constants/leftPanel";
import Menu from "./Menu";
import { useBlockMenu } from "@/components/hooks/useBlockMenu";
import { usePrimitiveBlocks } from "@/components/hooks/usePrimitiveBlocks";
import { cn } from "@/lib/utils";
import { builderStyles as styles } from "./Builder.styles";

const CATEGORY_MAP: Record<string, { id: string; label: string }> = {
  Layout: { id: "container", label: "Containers" },
  Typography: { id: "typography", label: "Typography" },
  Media: { id: "media", label: "Media" },
  Interactive: { id: "interactive", label: "Interactive" },
  Embed: { id: "embed", label: "Embed" },
};

function buildPrimitiveChildren(apiBlocks: PrimitiveBlock[]): MenuItem[] {
  const groups: Record<string, MenuItem[]> = {};

  for (const block of apiBlocks) {
    const catInfo = CATEGORY_MAP[block.category];
    if (!catInfo) continue;

    if (!groups[catInfo.id]) groups[catInfo.id] = [];

    groups[catInfo.id].push({
      id: block.id,
      label: block.name,
      thumbnail: block.thumbnailUrl,
      kind: block.type === "blank-section" ? "section" : "block",
      type: block.type,
      variant: block.variant,
    });
  }

  // Sắp xếp các nhóm theo thứ tự mong muốn
  const order = ["container", "typography", "media", "interactive", "embed"];
  const result: MenuItem[] = [];
  for (const key of order) {
    if (groups[key]) {
      result.push({
        id: key,
        label: Object.values(CATEGORY_MAP).find((c) => c.id === key)?.label || key,
        children: groups[key],
      });
    }
  }

  return result;
}

export default function LeftPanel() {
  const {
    activeBlockMenu,
    handlePinCategory,
    handleHoverCategory,
    handleLeaveCategory,
    handleEnterMenu,
    handleLeaveMenu,
    handleCloseBlockMenu,
  } = useBlockMenu();

  const { blocks: apiBlocks } = usePrimitiveBlocks();

  const menuSections = useMemo(() => {
    return LEFT_PANEL_SECTIONS.map((section) => {
      if (section.id === "primitive-blocks") {
        const children = buildPrimitiveChildren(apiBlocks);
        return { ...section, children };
      }
      return section;
    });
  }, [apiBlocks]);

  return (
    <div className={cn("relative z-100 h-screen")}>
      <aside className={cn(styles.lPanelContainer, styles.canvasButtonShadow)}>
        {/* Logo */}
        <div className={styles.lPanelLogoBlock}>
          <div className={styles.lPanelLogoLayout}>
            <div className={styles.lPanelLogo} />
            <span className={styles.lPanelLogoBrand}>NORALIZ</span>
          </div>
        </div>

        {/* Search */}
        <div className={styles.lPanelSearchContainer}>
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon size={17} weight="bold" className={styles.lPanelSearchIcon} />
            <Input type="search" placeholder=" Search..." className={styles.lPanelSearchInput} />
          </div>
        </div>

        {/* Dropdown category */}
        <div className={styles.lPanelDropdownContainer}>
          {menuSections.map((cate) => (
            <Category
              key={cate.id}
              cate={cate}
              active={activeBlockMenu}
              onPinCategory={cate.id === "primitive-blocks" ? handlePinCategory : undefined}
              onHoverCategory={cate.id === "primitive-blocks" ? handleHoverCategory : undefined}
              onLeaveCategory={cate.id === "primitive-blocks" ? handleLeaveCategory : undefined}
            />
          ))}
        </div>
      </aside>
      <Menu
        category={activeBlockMenu}
        onClose={handleCloseBlockMenu}
        onEnterMenu={handleEnterMenu}
        onLeaveMenu={handleLeaveMenu}
      />
    </div>
  );
}

interface CategoryProps {
  cate: MenuItem;
  active: MenuItem | null;
  onPinCategory?: (category: MenuItem) => void;
  onHoverCategory?: (category: MenuItem) => void;
  onLeaveCategory?: () => void;
}

const Category = React.memo(function Category({
  cate,
  active,
  onPinCategory,
  onHoverCategory,
  onLeaveCategory,
}: CategoryProps) {
  const [dropdown, setDropdown] = useState(false);
  const childCate = cate.children;

  const handleDropdown = useCallback(() => {
    setDropdown((prev) => !prev);
  }, []);

  return (
    <div className="select-none">
      <div className={styles.cateContainer}>
        <div className={styles.cateToggle} onClick={handleDropdown}>
          <CaretRightIcon
            size={16}
            weight="fill"
            className={cn(dropdown ? "rotate-90 transition-all" : "transition-all")}
          />
          <strong className="uppercase text-[14px]">{cate.label}</strong>
        </div>

        <div className={cn(styles.cateMenu, cate.badge ? "flex" : "hidden")}>
          <span className={styles.cateLabel}>{cate.badge}</span>
        </div>
      </div>

      <Dropdown
        childCate={childCate}
        isOpen={dropdown}
        isActive={active}
        onPinCategory={onPinCategory}
        onHoverCategory={onHoverCategory}
        onLeaveCategory={onLeaveCategory}
      />
    </div>
  );
});

interface DropdownProps {
  childCate?: MenuItem[];
  isOpen: boolean;
  isActive: MenuItem | null;
  onPinCategory?: (category: MenuItem) => void;
  onHoverCategory?: (category: MenuItem) => void;
  onLeaveCategory?: () => void;
}

const Dropdown = React.memo(function Dropdown({
  childCate,
  isOpen,
  isActive,
  onPinCategory,
  onHoverCategory,
  onLeaveCategory,
}: DropdownProps) {
  if (!childCate || childCate.length === 0) return null;

  return (
    <div className={cn(styles.dropdownContainer, isOpen ? "max-h-96 opacity-100 mt-[11px]" : "max-h-0 opacity-0")}>
      {childCate.map((child) => (
        <div
          key={child.id}
          onClick={() => onPinCategory?.(child)}
          onMouseEnter={() => onHoverCategory?.(child)}
          onMouseLeave={() => onLeaveCategory?.()}
        >
          <div
            className={cn(
              isActive?.id === child.id ? "bg-[var(--color-dark)]/5" : " hover:bg-[var(--color-dark)]/5",
              styles.dropdownLabel,
            )}
          >
            {child.label}
          </div>
        </div>
      ))}
    </div>
  );
});
