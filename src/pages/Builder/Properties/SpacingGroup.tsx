import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkSimpleIcon, LinkBreakIcon, SelectionAllIcon, SelectionIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { contentStyles as styles } from "../Content/Content.styles";
import FieldRow from "../Content/FieldRow";

interface SpacingValues {
  top: number | "";
  right: number | "";
  bottom: number | "";
  left: number | "";
}

interface SpacingGroupProps {
  label: string;
  values: SpacingValues;
  onUpdateAll: (value: string) => void;
  onUpdateSingle: (side: "top" | "right" | "bottom" | "left", value: string) => void;
}

export function SpacingGroup({ label, values, onUpdateAll, onUpdateSingle }: SpacingGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [topBottomLinked, setTopBottomLinked] = useState(true);
  const [leftRightLinked, setLeftRightLinked] = useState(true);

  const allEqual = values.top === values.bottom && values.top === values.left && values.top === values.right;
  const allValue = allEqual ? values.top : "";

  return (
    <div>
      <FieldRow label={label}>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={allValue}
            onChange={(e) => onUpdateAll(e.target.value)}
            placeholder="0"
            className={cn(styles.contentInput, "flex-1")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="!w-4 !h-4"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <SelectionIcon size={12} /> : <SelectionAllIcon size={12} />}
          </Button>
        </div>
      </FieldRow>

      {expanded && (
        <div className="space-y-2 mt-2">
          {/* Hàng Top / Bottom */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">T</span>
            <Input
              type="number"
              value={values.top}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateSingle("top", val);
                if (topBottomLinked) onUpdateSingle("bottom", val);
              }}
              placeholder="0"
              className={styles.contentInput}
            />
            <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">B</span>
            <Input
              type="number"
              value={values.bottom}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateSingle("bottom", val);
                if (topBottomLinked) onUpdateSingle("top", val);
              }}
              placeholder="0"
              className={styles.contentInput}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!w-4 !h-4"
              onClick={() => setTopBottomLinked(!topBottomLinked)}
              title={topBottomLinked ? "Unlink" : "Link"}
            >
              {topBottomLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
            </Button>
          </div>

          {/* Hàng Left / Right */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">L</span>
            <Input
              type="number"
              value={values.left}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateSingle("left", val);
                if (leftRightLinked) onUpdateSingle("right", val);
              }}
              placeholder="0"
              className={styles.contentInput}
            />
            <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">R</span>
            <Input
              type="number"
              value={values.right}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateSingle("right", val);
                if (leftRightLinked) onUpdateSingle("left", val);
              }}
              placeholder="0"
              className={styles.contentInput}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!w-4 !h-4"
              onClick={() => setLeftRightLinked(!leftRightLinked)}
              title={leftRightLinked ? "Unlink" : "Link"}
            >
              {leftRightLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
