import React, { useState, useCallback } from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

interface SocialLink {
  platform: string;
  url: string;
}

function SocialContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);
  const [links, setLinks] = useState<SocialLink[]>(b.props?.links || [{ platform: "twitter", url: "" }]);

  const addLink = useCallback(() => {
    const updated = [...links, { platform: "", url: "" }];
    setLinks(updated);
    update({ links: updated });
  }, [links, update]);

  const removeLink = useCallback(
    (index: number) => {
      const updated = links.filter((_, i) => i !== index);
      setLinks(updated);
      update({ links: updated });
    },
    [links, update],
  );

  const updateLink = useCallback(
    (index: number, key: keyof SocialLink, value: string) => {
      const updated = links.map((l, i) => (i === index ? { ...l, [key]: value } : l));
      setLinks(updated);
      update({ links: updated });
    },
    [links, update],
  );

  return (
    <ContentWrapper>
      <FieldRow label="Links">
        <div className="flex flex-col gap-[8px]">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-[4px]">
              <Input
                value={link.platform}
                onChange={(e) => updateLink(index, "platform", e.target.value)}
                placeholder="Twitter"
                className={styles.contentInput}
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                placeholder="https://..."
                className={styles.contentInput}
              />
              <Button
                onClick={() => removeLink(index)}
                className="w-[34px] h-[34px] !rounded-md bg-[var(--color-dark)]/5 hover:bg-red-500 hover:text-white"
              >
                <TrashIcon size={14} />
              </Button>
            </div>
          ))}
          <Button
            onClick={addLink}
            className="w-full h-[34px] !rounded-md bg-[var(--color-dark)]/5 hover:bg-[var(--color-primary)]/10"
          >
            <PlusIcon size={14} className="mr-1" /> Add link
          </Button>
        </div>
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(SocialContent);
