import React from "react";
import type { Block, ColumnsBlock, ContainerBlock } from "@/types";
import { getEmbedUrl } from "@/helper/getEmbedUrl";

export function buildStyle(styles: Record<string, string> | undefined): React.CSSProperties {
  if (!styles) return {};
  const { transform, ...rest } = styles;
  const result: React.CSSProperties = { ...rest };
  if (transform) {
    result.transform = transform;
  }
  return result;
}

export function BlockPreview({ block }: { block: Block }) {
  const props = (block as any).props;
  const styles = buildStyle(props?.styles);

  switch (block.type) {
    case "container":
      return (
        <div style={styles}>
          {(block as ContainerBlock).children?.map((child: Block) => (
            <BlockPreview key={child.id} block={child} />
          ))}
          {(block as ContainerBlock).children?.length === 0 && (
            <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>Empty container</div>
          )}
        </div>
      );

    case "text":
      return <p style={styles}>{props?.content}</p>;

    case "heading": {
      const level = props?.level || "h2";
      return React.createElement(level, { style: styles }, props?.content);
    }
    case "blockquote":
      return <blockquote style={styles}>{props?.content || "Quote"}</blockquote>;

    case "image":
      return <img src={props?.src || "https://placehold.co/600x400"} alt={props?.alt || ""} style={styles} />;

    case "video":
      const finalEmbedUrl = props.embedUrl ? getEmbedUrl(props.embedUrl) : "";

      if (props.embedUrl) {
        return <iframe src={finalEmbedUrl} style={styles} allowFullScreen />;
      }
      if (props.fileUrl) {
        return <video src={props.fileUrl} controls style={styles} />;
      }
      return <div style={styles}>No video source</div>;

    case "icon":
      return (
        <svg
          width={props?.size || 24}
          height={props?.size || 24}
          viewBox="0 0 24 24"
          fill={props?.color || "#000"}
          style={styles}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );

    case "button": {
      const href = props?.href || "#";
      return (
        <a href={href} style={styles}>
          {props?.label || "Button"}
        </a>
      );
    }

    case "form":
      return (
        <form style={styles}>
          {(props?.fields || []).map((field: any, i: number) => (
            <div key={i}>
              <label>{field.name}</label>
              {field.type === "textarea" ? <textarea /> : <input type={field.type || "text"} />}
            </div>
          ))}
          <button type="submit">{props?.submitLabel || "Submit"}</button>
        </form>
      );

    case "divider":
      return <hr style={styles} />;

    case "spacer":
      return <div style={styles} />;

    case "columns": {
      const cols = block as ColumnsBlock;
      return (
        <div style={styles}>
          {cols.children.map((col) => (
            <div key={col.id} style={{ ...((col as any).props?.styles || {}) }}>
              {col.blocks.map((childBlock) => (
                <BlockPreview key={childBlock.id} block={childBlock} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    case "map":
      if (props.embedUrl) {
        return <iframe src={props.embedUrl} style={styles} loading="lazy" allowFullScreen title="Map" />;
      }
      return <div style={styles}>No map URL</div>;

    case "social":
      return (
        <div style={styles}>
          {(props?.links || []).map((link: any, i: number) => (
            <a key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer">
              {link.platform || "Link"}
            </a>
          ))}
        </div>
      );

    default:
      return <div style={styles}>{block.type}</div>;
  }
}
