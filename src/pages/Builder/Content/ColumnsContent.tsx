import React from "react";
import type { Block, ColumnsBlock } from "@/types";
import { contentStyles as styles } from "./Content.styles";
import { Input } from "@/components/ui/input";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function ColumnsContent({ block }: { block: Block }) {
  const b = block as ColumnsBlock;
  const update = useBlockUpdater(b.id);

  const handleGapChange = (val: string) => {
    update({
      gap: `${val}px`,
      styles: {
        ...(b.props?.styles || {}),
        gap: `${val}px`,
      },
    });
  };

  return (
    <ContentWrapper>
      <FieldRow label="Gap: px">
        <Input
          value={b.props?.gap?.replace("px", "") ?? "24"}
          onChange={(e) => handleGapChange(e.target.value)}
          type="number"
          min={0}
          max={120}
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(ColumnsContent);
