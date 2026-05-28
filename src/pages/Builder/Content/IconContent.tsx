import React from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function IconContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Icon Name">
        <Input
          value={b.props?.name ?? ""}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="star, heart, home..."
          className={styles.contentInput}
        />
      </FieldRow>
      <FieldRow label="Size (px)">
        <Input
          value={b.props?.size ?? 24}
          onChange={(e) => update({ size: Number(e.target.value) || 24 })}
          type="number"
          placeholder="24"
          className={styles.contentInput}
        />
      </FieldRow>
      <FieldRow label="Color">
        <Input
          value={b.props?.color ?? "#000000"}
          onChange={(e) => update({ color: e.target.value })}
          placeholder="#000000"
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(IconContent);
