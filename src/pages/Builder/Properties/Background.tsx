import React, { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPickerField from "@/components/shared/ColorPickerField";
import FieldRow from "../Content/FieldRow";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";

function unwrapUrl(value: string): string {
  if (!value) return "";
  const match = value.match(/^url\(["']?(.*?)["']?\)$/);
  return match ? match[1] : value;
}

function parsePosition(value: string): { x: string; y: string } {
  if (!value) return { x: "", y: "" };
  const parts = value.trim().split(/\s+/);
  const keywords: Record<string, string> = {
    left: "0%",
    center: "50%",
    right: "100%",
    top: "0%",
    bottom: "100%",
  };
  const x = keywords[parts[0]] || parts[0] || "0%";
  const y = keywords[parts[1]] || parts[1] || "0%";
  return {
    x: x.replace("%", "").trim(),
    y: y.replace("%", "").trim(),
  };
}

function Background() {
  const { currentStyles, updateStyles } = useStyleUpdater();

  // Chỉ đọc thuộc tính riêng lẻ, không parse từ shorthand
  const bgColor = currentStyles.backgroundColor || "";
  const rawBgImage = currentStyles.backgroundImage || "";
  const bgImage = unwrapUrl(rawBgImage);
  const bgPosition = currentStyles.backgroundPosition || "0% 0%";
  const { x: posX, y: posY } = parsePosition(bgPosition);
  const bgSize = currentStyles.backgroundSize || "";
  const bgRepeat = currentStyles.backgroundRepeat || "";
  const bgAttachment = currentStyles.backgroundAttachment || "";
  const bgClip = currentStyles.backgroundClip || "";
  const bgOrigin = currentStyles.backgroundOrigin || "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateBg = useCallback(
    (property: string, value: string | undefined) => {
      const updates: Record<string, any> = {};

      if (property === "backgroundImage") {
        updates.backgroundImage = value ? (value.startsWith("url(") ? value : `url(${value})`) : "";
      } else if (property === "backgroundColor") {
        updates.backgroundColor = value;
      } else {
        updates[property] = value ?? "";
      }

      // Nếu đang có shorthand background, xóa nó để tránh xung đột
      if (currentStyles.background) {
        updates.background = undefined;
      }

      updateStyles(updates);
    },
    [updateStyles, currentStyles.background],
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const localUrl = URL.createObjectURL(file);
      updateBg("backgroundImage", localUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [updateBg],
  );

  const handlePositionChange = useCallback(
    (axis: "x" | "y", value: string) => {
      const newX = axis === "x" ? value : posX;
      const newY = axis === "y" ? value : posY;
      updateBg("backgroundPosition", `${newX || 0}% ${newY || 0}%`);
    },
    [posX, posY, updateBg],
  );

  const handleOptionChange = useCallback(
    (property: string, value: string) => {
      if (value === "__none__") {
        updateBg(property, undefined);
      } else {
        updateBg(property, value);
      }
    },
    [updateBg],
  );

  return (
    <div className="space-y-3">
      {/* Background Color */}
      <FieldRow label="Color">
        <ColorPickerField value={bgColor || "transparent"} onChange={(color) => updateBg("backgroundColor", color)} />
      </FieldRow>

      {/* Background Image */}
      <FieldRow label="Image URL">
        <Input
          value={bgImage}
          onChange={(e) => updateBg("backgroundImage", e.target.value)}
          placeholder="https://..."
          className={cn(styles.contentInput)}
        />
        <Button
          type="button"
          className="bg-[var(--color-primary)] !h-[26px]"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-white text-[12px]">Change image</span>
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </FieldRow>

      {/* Background Position (X / Y) */}
      <FieldRow label="Position">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={posX}
            onChange={(e) => handlePositionChange("x", e.target.value)}
            placeholder="X%"
            className={cn(styles.contentInput)}
          />
          <Input
            type="number"
            value={posY}
            onChange={(e) => handlePositionChange("y", e.target.value)}
            placeholder="Y%"
            className={cn(styles.contentInput)}
          />
        </div>
      </FieldRow>

      {/* Options Group */}
      <div>
        <span className="text-[11px] font-medium text-[var(--color-dark)]/50 uppercase">Options</span>
        <div className="flex flex-wrap gap-2 mt-1">
          <Select value={bgSize || ""} onValueChange={(val) => handleOptionChange("backgroundSize", val)}>
            <SelectTrigger className={cn(styles.contentInput, "flex-1 min-w-[100px]")}>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              <SelectItem value="__none__" className={styles.contentSelect}>
                None
              </SelectItem>
              {["auto", "cover", "contain", "100% 100%"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bgRepeat || ""} onValueChange={(val) => handleOptionChange("backgroundRepeat", val)}>
            <SelectTrigger className={cn(styles.contentInput, "flex-1 min-w-[100px]")}>
              <SelectValue placeholder="Repeat" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              <SelectItem value="__none__" className={styles.contentSelect}>
                None
              </SelectItem>
              {["repeat", "no-repeat", "repeat-x", "repeat-y"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bgAttachment || ""} onValueChange={(val) => handleOptionChange("backgroundAttachment", val)}>
            <SelectTrigger className={cn(styles.contentInput, "flex-1 min-w-[100px]")}>
              <SelectValue placeholder="Attach" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              <SelectItem value="__none__" className={styles.contentSelect}>
                None
              </SelectItem>
              {["scroll", "fixed", "local"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bgClip || ""} onValueChange={(val) => handleOptionChange("backgroundClip", val)}>
            <SelectTrigger className={cn(styles.contentInput, "flex-1 min-w-[100px]")}>
              <SelectValue placeholder="Clip" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              <SelectItem value="__none__" className={styles.contentSelect}>
                None
              </SelectItem>
              {["border-box", "padding-box", "content-box", "text"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bgOrigin || ""} onValueChange={(val) => handleOptionChange("backgroundOrigin", val)}>
            <SelectTrigger className={cn(styles.contentInput, "flex-1 min-w-[100px]")}>
              <SelectValue placeholder="Origin" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              <SelectItem value="__none__" className={styles.contentSelect}>
                None
              </SelectItem>
              {["padding-box", "border-box", "content-box"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Background);
