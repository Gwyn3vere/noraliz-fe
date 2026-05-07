import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dashboardStyles as styles } from "./Dashboard.styles";
import { SquaresFourIcon, FadersIcon, TrashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { CirclePlus } from "lucide-react";

export default function Control() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <div className="!rounded-full w-[40px] h-[40px] bg-[var(--color-primary)] text-white flex items-center justify-center shadow-[var(--shadow-xs)]">
          <SquaresFourIcon size={20} weight="fill" />
        </div>
        <div className="!rounded-full w-[40px] h-[40px] bg-[var(--color-light)] flex items-center justify-center shadow-[var(--shadow-xs)]">
          <FadersIcon size={20} weight="fill" />
        </div>
        <div className="!rounded-full w-[40px] h-[40px] bg-[var(--color-light)] flex items-center justify-center shadow-[var(--shadow-xs)]">
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

        <Button className={styles.emptyButton}>
          <CirclePlus strokeWidth={3} />
          Create new project
        </Button>
      </div>
    </div>
  );
}
