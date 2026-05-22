import React from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function VideoContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);

  return (
    <ContentWrapper>
      <FieldRow label="Embed URL">
        <Input
          value={b.props?.embedUrl ?? ""}
          onChange={(e) => update({ embedUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
          className={styles.contentInput}
        />
      </FieldRow>
      <div className="text-[11px] text-[var(--color-dark)]/40 text-center mt-2">
        Width & height can be adjusted in the Size panel.
      </div>
    </ContentWrapper>
  );
}

export default React.memo(VideoContent);
