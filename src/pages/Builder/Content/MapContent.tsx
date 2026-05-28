import React from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function MapContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Embed URL">
        <Input
          value={b.props?.embedUrl ?? ""}
          onChange={(e) => update({ embedUrl: e.target.value })}
          placeholder="https://maps.google.com/maps?q=..."
          className={styles.contentInput}
        />
      </FieldRow>
      <FieldRow label="Height">
        <Input
          value={b.props?.height ?? "400"}
          onChange={(e) => update({ height: e.target.value })}
          placeholder="400"
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(MapContent);
