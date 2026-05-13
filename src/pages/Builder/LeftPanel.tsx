import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import type { MenuItem } from "@/types";
import { LEFT_PANEL_SECTIONS } from "@/constants/leftPanel";
import Menu from "./Menu";
import { useBlockMenu } from "@/components/hooks/useBlockMenu";
import { cn } from "@/lib/utils";
import { builderStyles as styles } from "./Builder.styles";

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

  return (
    <div className="relative">
      <aside className={styles.lPanelContainer}>
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
          {LEFT_PANEL_SECTIONS.map((cate) => (
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
