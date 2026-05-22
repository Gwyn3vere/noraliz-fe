import React, { useState, useCallback } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { builderStyles as styles } from "../Builder.styles";
import { cn } from "@/lib/utils";

interface PropertiesProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Property({ title, children, defaultOpen = false }: PropertiesProps) {
  const [dropdown, setDropdown] = useState(defaultOpen);

  const handleDropdown = useCallback(() => {
    setDropdown((prev) => !prev);
  }, []);

  return (
    <div className="select-none border-b border-[var(--color-dark)]/10 p-[20px] cursor-pointer">
      <div className={styles.cateContainer}>
        <div className={cn(styles.cateToggle)} onClick={handleDropdown}>
          <CaretRightIcon
            size={16}
            weight="fill"
            className={cn(dropdown ? "rotate-90 transition-all" : "transition-all")}
          />
          <strong className="text-[14px]">{title}</strong>
        </div>
      </div>

      <div
        className={cn(
          styles.dropdownContainer,
          dropdown ? "max-h-[1000px] opacity-100 mt-[11px]" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default React.memo(Property);
