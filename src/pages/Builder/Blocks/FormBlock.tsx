import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function FormBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <form
      ref={ref as React.Ref<HTMLFormElement>}
      data-block-id={block.id}
      {...props}
      style={style}
      className={cn(className, "space-y-2")}
    >
      {((block as any).props?.fields as any[])?.map((field, i) => (
        <input
          key={i}
          type={field.type || "text"}
          placeholder={field.name || `Field ${i + 1}`}
          className="w-full px-3 py-2 border rounded"
          disabled
        />
      ))}

      <button type="button" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg" disabled>
        {(block as any).props?.submitLabel || "Submit"}
      </button>
    </form>
  );
}
