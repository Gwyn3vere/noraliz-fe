import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SquaresFourIcon,
  ListDashesIcon,
  FadersIcon,
  FadersHorizontalIcon,
  MagnifyingGlassIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import type React from "react";
import { cn } from "@/lib/utils";
import { dashboardStyles as styles } from "./Dashboard.styles";
import { Button } from "@/components/ui/button";

interface ControlProps {
  tabname?: string;
  button?: React.ReactNode;
  total?: number;
  editedTime?: string;
}

const FILTER_MENU = ["All", "Draft", "Published", "Archived"];
const SORT_OPTIONS = ["Recently edited", "Oldest first", "Name A-Z"];
const STATUS_OPTIONS = ["All status", "Draft", "Published"];

export default function Control({ tabname, button, total, editedTime }: ControlProps) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Recently edited");
  const [status, setStatus] = useState("All status");
  return (
    <div className="">
      <div className="mb-10 space-y-2">
        <div className="font-black text-[35px] uppercase">{tabname}</div>
        <div
          className={cn("flex items-center gap-5", "font-semibold text-[14px] text-[var(--color-dark)]/70 uppercase")}
        >
          {total && <div>{total} projects</div>}
          {editedTime && <span>•</span>}
          {editedTime && <div>Last {editedTime}</div>}
        </div>
      </div>

      <div className="md:flex items-end justify-between">
        <div className="grid grid-cols-2 gap-2 md:flex items-end md:gap-10">
          <Optional title="View">
            <div
              className={cn(
                "flex bg-[var(--color-light)] !rounded-[8px] overflow-hidden",
                "border border-[var(--color-dark)]",
                "shadow-[var(--shadow-brutalism-xs)]",
              )}
            >
              <Button className="w-full md:w-[40px] h-[40px] bg-[var(--color-primary)]">
                <SquaresFourIcon weight="fill" className="text-[var(--color-light)]" />
              </Button>
              <Button className="w-full md:w-[40px] h-[40px]">
                <ListDashesIcon weight="bold" />
              </Button>
            </div>
          </Optional>
          <div className="hidden md:block h-[40px] w-[1px] bg-[var(--color-dark)]/50" />
          <Optional title="Filter">
            <div
              className={cn(
                "flex bg-[var(--color-light)] !rounded-[8px] overflow-hidden",
                "border border-[var(--color-dark)]",
                "shadow-[var(--shadow-brutalism-xs)]",
              )}
            >
              <Button className="w-[40px] h-[40px] flex items-center justify-center">
                <FadersIcon weight="bold" />
              </Button>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="border-none !w-35">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "border border-[var(--color-dark)] bg-[var(--color-light)]",
                    "!shadow-[var(--shadow-brutalism-xs)] !left-0",
                  )}
                >
                  {FILTER_MENU.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Optional>
          <Optional title="Sort by">
            <div
              className={cn(
                "flex bg-[var(--color-light)] !rounded-[8px] overflow-hidden",
                "border border-[var(--color-dark)]",
                "shadow-[var(--shadow-brutalism-xs)]",
              )}
            >
              <Button className="w-[40px] h-[40px] flex items-center justify-center">
                <FadersHorizontalIcon weight="bold" className="rotate-90" />
              </Button>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="border-none !w-40">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "border border-[var(--color-dark)] bg-[var(--color-light)]",
                    "!shadow-[var(--shadow-brutalism-xs)]",
                  )}
                >
                  {SORT_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Optional>
          <Optional title="Status">
            <div
              className={cn(
                "flex bg-[var(--color-light)] !rounded-[8px] overflow-hidden",
                "border border-[var(--color-dark)]",
                "shadow-[var(--shadow-brutalism-xs)]",
              )}
            >
              <Button className="w-[40px] h-[40px] flex items-center justify-center">
                <CircleIcon weight="bold" />
              </Button>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-none !w-35">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "border border-[var(--color-dark)] bg-[var(--color-light)]",
                    "!shadow-[var(--shadow-brutalism-xs)] !left-0",
                  )}
                >
                  {STATUS_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Optional>
        </div>
        <div className="md:flex items-center gap-[10px] mt-5 md:mt-0 space-y-5 md:space-y-0">
          <div className={cn("relative", styles.inputSearch)}>
            <MagnifyingGlassIcon
              size={17}
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[var(--color-dark)]/40"
            />
            <Input
              type="search"
              placeholder=" Search..."
              className=" pl-9 w-full md:w-[240px] !h-[40px] bg-[var(--color-light)] border-none"
            />
          </div>

          {button}
        </div>
      </div>
    </div>
  );
}

interface OptionalProps {
  title?: string;
  children?: React.ReactNode;
}

function Optional({ title, children }: OptionalProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-bebas font-semibold text-[12px] text-[var(--color-dark)]/70 uppercase">{title}</span>

      {children}
    </div>
  );
}
