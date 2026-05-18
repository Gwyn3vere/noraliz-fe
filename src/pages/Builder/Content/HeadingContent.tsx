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

  const handleLevelChange = useCallback(
    (val: string) => {
      const currentStyles = b.props?.styles ?? {};
      const { fontSize, lineHeight, fontWeight, ...restStyles } = currentStyles as any;

      update({
        level: val,
        styles: restStyles,
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
