import React, { useCallback } from "react";
import type { Block, HeadingBlock } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function HeadingContent({ block }: { block: Block }) {
  const b = block as HeadingBlock;
  const update = useBlockUpdater(b.id);

  const headingStyles: Record<string, Record<string, string>> = {
    h1: { fontSize: "36px", fontWeight: "800", lineHeight: "1.2" },
    h2: { fontSize: "30px", fontWeight: "700", lineHeight: "1.25" },
    h3: { fontSize: "24px", fontWeight: "700", lineHeight: "1.3" },
    h4: { fontSize: "20px", fontWeight: "600", lineHeight: "1.35" },
    h5: { fontSize: "18px", fontWeight: "600", lineHeight: "1.4" },
    h6: { fontSize: "16px", fontWeight: "600", lineHeight: "1.5" },
  };

  const handleLevelChange = useCallback(
    (val: string) => {
      const { fontSize, lineHeight, fontWeight, ...restStyles } = (b.props?.styles || {}) as any;
      const newStyle = headingStyles[val] || {};
      update({
        level: val,
        styles: {
          ...restStyles,
          ...newStyle,
        },
      });
    },
    [b.props?.styles, update],
  );

  return (
    <ContentWrapper>
      <FieldRow label="Text">
        <Textarea
          value={b.props?.content ?? ""}
          onChange={(e) => update({ content: e.target.value })}
          placeholder="Enter heading..."
          className={styles.contentTextarea}
        />
      </FieldRow>

      <FieldRow label="Level">
        <Select value={b.props?.level ?? "h2"} onValueChange={handleLevelChange}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((level) => (
              <SelectItem key={level} value={level} className={styles.contentSelect}>
                {level.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(HeadingContent);
