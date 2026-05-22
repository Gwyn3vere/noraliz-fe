import React from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function DividerContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Style">
        <Select value={b.props?.style ?? "solid"} onValueChange={(val) => update({ style: val })}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            {["solid", "dashed", "dotted"].map((style) => (
              <SelectItem key={style} value={style} className={styles.contentSelect}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Thickness (px)">
        <Input
          value={b.props?.thickness ?? 1}
          onChange={(e) => update({ thickness: Number(e.target.value) || 1 })}
          type="number"
          placeholder="1"
          className={styles.contentInput}
        />
      </FieldRow>
      <FieldRow label="Color">
        <Input
          value={b.props?.color ?? "#e5e5e5"}
          onChange={(e) => update({ color: e.target.value })}
          placeholder="#e5e5e5"
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(DividerContent);
