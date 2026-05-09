import { Input } from "@/components/ui/input";
import { SquaresFourIcon, FadersIcon, TrashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type React from "react";

interface Props {
  button?: React.ReactNode;
}

export default function Control({ button }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[5px] md:gap-[10px]">
        <div className="cursor-pointer !rounded-full w-[40px] h-[40px] bg-[var(--color-primary)] text-white flex items-center justify-center shadow-[var(--shadow-xs)]">
          <SquaresFourIcon size={20} weight="fill" />
        </div>
        <div className="cursor-pointer !rounded-full w-[40px] h-[40px] bg-[var(--color-light)] flex items-center justify-center shadow-[var(--shadow-xs)]">
          <FadersIcon size={20} weight="fill" />
        </div>
        <div className="cursor-pointer !rounded-full w-[40px] h-[40px] bg-[var(--color-light)] flex items-center justify-center shadow-[var(--shadow-xs)]">
          <TrashIcon size={20} weight="fill" />
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <div className="relative hidden md:block">
          <MagnifyingGlassIcon
            size={17}
            weight="bold"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[var(--color-dark)]/40"
          />
          <Input
            type="search"
            placeholder=" Search..."
            className=" pl-9 my-2 w-[240px] h-[40px] bg-[var(--color-light)] shadow-[var(--shadow-xs)] !border-none"
          />
        </div>

        {button}
      </div>
    </div>
  );
}
