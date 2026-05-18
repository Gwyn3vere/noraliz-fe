import React from "react";
import type { Block, TextBlock } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function TextContent({ block }: { block: Block }) {
  const b = block as TextBlock;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Content">
        <Textarea
          value={b.props?.content ?? ""}
          onChange={(e) => update({ content: e.target.value })}
          placeholder="Enter text..."
          className={styles.contentTextarea}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(TextContent);
