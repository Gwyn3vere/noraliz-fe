import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { LEFT_PANEL_SECTIONS } from "@/constants/leftPanel";
import Menu from "./Menu";
import { useBlockMenu } from "@/components/hooks/useBlockMenu";

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
      <aside className="relative bg-[var(--color-light)] z-40 flex flex-col w-[260px] h-screen">
        {/* Logo */}
        <div className="h-[100px] px-[20px] border-b border-[var(--color-dark)]/10">
          <div className="flex items-center gap-2.5 pt-[20px]">
            <div className="w-[50px] h-[50px] rounded-[10px] bg-[var(--color-primary)]" />
            <span className="font-display font-bold text-[30px]">NORALIZ</span>
          </div>
        </div>

        {/* Search */}
        <div className="h-[80px] border-b border-[var(--color-dark)]/10 px-[20px]">
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon
              size={17}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[var(--color-dark)]/40"
            />
            <Input
              type="search"
              placeholder=" Search..."
              className="pl-9 my-[20px] w-full !h-[40px] bg-[var(--color-light)]"
            />
          </div>
        </div>

        {/* Dropdown category */}
        <div className="flex-1 p-[20px] flex flex-col gap-[12px] overflow-auto hover-scrollbar">
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
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-[7px] cursor-pointer hover:text-[var(--color-primary)] transition-all"
          onClick={handleDropdown}
        >
          <CaretRightIcon
            size={16}
            weight="fill"
            className={cn(dropdown ? "rotate-90 transition-all" : "transition-all")}
          />
          <strong>{cate.label}</strong>
        </div>
        <div
          className={cn(
            "h-[20px] w-[60px] flex items-center justify-center bg-linear-[var(--color-gradient-soon)] rounded-full",
            cate.badge ? "flex" : "hidden",
          )}
        >
          <span className="text-[13px] font-bold text-white">{cate.badge}</span>
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
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100 mt-[11px]" : "max-h-0 opacity-0",
        "space-y-1",
      )}
    >
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
              "pl-[23px] h-[35px] flex items-center rounded-[10px] cursor-pointer transition-all text-[14px]",
            )}
          >
            {child.label}
          </div>
        </div>
      ))}
    </div>
  );
});
