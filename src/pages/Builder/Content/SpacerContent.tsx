import React from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function SpacerContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Height (px)">
        <Input
          value={b.props?.height ?? 40}
          onChange={(e) => update({ height: e.target.value })}
          placeholder="40"
          className={styles.contentInput}
        />
      </FieldRow>
      <FieldRow label="Width">
        <Input
          value={b.props?.width ?? "100%"}
          onChange={(e) => update({ width: e.target.value })}
          placeholder="100%"
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(SpacerContent);
