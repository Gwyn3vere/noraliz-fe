import React, { useState, useCallback } from "react";
import type { Block } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";

interface FormField {
  name: string;
  type: string;
}

function FormContent({ block }: { block: Block }) {
  const b = block as any;
  const update = useBlockUpdater(b.id);
  const [fields, setFields] = useState<FormField[]>(b.props?.fields || [{ name: "email", type: "email" }]);

  const addField = useCallback(() => {
    const updated = [...fields, { name: "", type: "text" }];
    setFields(updated);
    update({ fields: updated });
  }, [fields, update]);

  const removeField = useCallback(
    (index: number) => {
      const updated = fields.filter((_, i) => i !== index);
      setFields(updated);
      update({ fields: updated });
    },
    [fields, update],
  );

  const updateField = useCallback(
    (index: number, key: keyof FormField, value: string) => {
      const updated = fields.map((f, i) => (i === index ? { ...f, [key]: value } : f));
      setFields(updated);
      update({ fields: updated });
    },
    [fields, update],
  );

  return (
    <ContentWrapper>
      <FieldRow label="Fields">
        <div className="flex flex-col gap-[8px]">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-[4px]">
              <Input
                value={field.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
                placeholder="Field name"
                className={styles.contentInput}
              />
              <select
                value={field.type}
                onChange={(e) => updateField(index, "type", e.target.value)}
                className={styles.contentSelect}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="textarea">Textarea</option>
              </select>
              <Button
                onClick={() => removeField(index)}
                className="w-[34px] h-[34px] !rounded-md bg-[var(--color-dark)]/5 hover:bg-red-500 hover:text-white"
              >
                <TrashIcon size={14} />
              </Button>
            </div>
          ))}
          <Button
            onClick={addField}
            className="w-full h-[34px] !rounded-md bg-[var(--color-dark)]/5 hover:bg-[var(--color-primary)]/10"
          >
            <PlusIcon size={14} className="mr-1" /> Add field
          </Button>
        </div>
      </FieldRow>
      <FieldRow label="Submit Label">
        <Input
          value={b.props?.submitLabel ?? "Submit"}
          onChange={(e) => update({ submitLabel: e.target.value })}
          placeholder="Submit"
          className={styles.contentInput}
        />
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(FormContent);
