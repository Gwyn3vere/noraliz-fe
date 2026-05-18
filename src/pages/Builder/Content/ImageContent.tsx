import React, { useCallback, useRef, useEffect } from "react";
import type { Block, ImageBlock } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

function ImageContent({ block }: { block: Block }) {
  const b = block as ImageBlock;
  const update = useBlockUpdater(b.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [b.id]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const localUrl = URL.createObjectURL(file);
      update({ src: localUrl });
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [update],
  );

  return (
    <ContentWrapper>
      {/* Preview */}
      {b.props?.src && (
        <div className={styles.contentPrivewImage}>
          <img
            src={b.props.src}
            alt={b.props.alt ?? ""}
            className="w-full h-full object-cover"
            style={{ objectFit: b.props?.objectFit ?? "cover" }}
          />
        </div>
      )}

      <FieldRow label="Upload Image">
        <label className={styles.contentUploadLabel}>
          Click to upload
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </FieldRow>

      <FieldRow label="Or paste URL">
        <Input
          value={b.props?.src ?? ""}
          onChange={(e) => update({ src: e.target.value })}
          placeholder="https://..."
          className={styles.contentInput}
        />
      </FieldRow>

      <FieldRow label="Alt Text">
        <Input
          value={b.props?.alt ?? ""}
          onChange={(e) => update({ alt: e.target.value })}
          placeholder="Describe the image..."
          className={styles.contentInput}
        />
      </FieldRow>

      <FieldRow label="Object Fit">
        <Select value={b.props?.objectFit ?? "cover"} onValueChange={(val) => update({ objectFit: val })}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            {["cover", "contain", "fill", "none"].map((fit) => (
              <SelectItem key={fit} value={fit} className={styles.contentSelect}>
                {fit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(ImageContent);
