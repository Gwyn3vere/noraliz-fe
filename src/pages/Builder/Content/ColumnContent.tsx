import React from "react";
// import { useEditorStore } from "@/stores/editorStore";
import type { ColumnBlock } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";

function ColumnContent({ column }: { column: ColumnBlock }) {
  // Không dùng useBlockUpdater vì ColumnBlock không phải Block
  const updateColumn = (props: Record<string, any>) => {
    // Cần một action updateColumn trong store, tạm thời console.log
    console.log("Update column", column.id, props);
    // TODO: thêm action updateColumn vào editorStore
  };

  const styles = column as any;

  return (
    <ContentWrapper>
      <FieldRow label="Direction">
        <div className="flex gap-[6px]">
          {(["column", "row"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => updateColumn({ flexDirection: dir })}
              className={`flex-1 h-[30px] rounded-md text-[11px] font-medium border transition-colors capitalize ${
                styles.flexDirection === dir || (!styles.flexDirection && dir === "column")
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "border-[var(--color-dark)]/20 text-[var(--color-dark)]/60 hover:border-[var(--color-primary)]"
              }`}
            >
              {dir === "column" ? "↕ Vertical" : "↔ Horizontal"}
            </button>
          ))}
        </div>
      </FieldRow>

      <FieldRow label="Align Items">
        <Select value={styles.alignItems ?? "flex-start"} onValueChange={(val) => updateColumn({ alignItems: val })}>
          <SelectTrigger className="h-[34px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            {["flex-start", "center", "flex-end", "stretch"].map((item) => (
              <SelectItem key={item} value={item} className="text-[13px]">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Justify Content">
        <Select
          value={styles.justifyContent ?? "flex-start"}
          onValueChange={(val) => updateColumn({ justifyContent: val })}
        >
          <SelectTrigger className="h-[34px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            {["flex-start", "center", "flex-end", "space-between", "space-around"].map((item) => (
              <SelectItem key={item} value={item} className="text-[13px]">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label="Gap (px)">
        <Input
          value={parseInt(styles.gap || "12")}
          onChange={(e) => updateColumn({ gap: `${e.target.value}px` })}
          type="number"
          min={0}
          max={120}
          className="h-[34px] text-[13px]"
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(ColumnContent);
