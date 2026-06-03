import React from "react";
import type { Block, ColumnsBlock, ContainerBlock } from "@/types";
import { getEmbedUrl } from "@/helper/getEmbedUrl";
import { buildStyle } from "@/helper/buildStyles";
import { normalizeStyles } from "@/helper/normalizeStyles";
import { getResponsiveStyle } from "@/helper/responsive";

function objectToCSS(obj: Record<string, string | number>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${String(value)}`)
    .join("; ");
}

interface BreakpointStyles {
  base: React.CSSProperties;
  tablet?: React.CSSProperties;
  mobile?: React.CSSProperties;
}

function getBreakpointStyles(rawStyles: any): BreakpointStyles {
  const normalized = normalizeStyles(rawStyles);
  const base = normalized.base ? buildStyle(normalized.base) : {};
  const tablet = normalized.tablet ? buildStyle({ ...normalized.base, ...normalized.tablet }) : undefined;
  const mobile = normalized.mobile
    ? buildStyle({ ...normalized.base, ...(normalized.tablet ?? {}), ...normalized.mobile })
    : undefined;
  return { base, tablet, mobile };
}

function RenderWithBreakpoints({
  blockId,
  styles,
  children,
}: {
  blockId: string;
  styles: BreakpointStyles;
  children: React.ReactElement;
}) {
  const selector = `#${blockId}`;
  let css = `${selector} { ${objectToCSS(styles.base as any)} }`;
  if (styles.tablet) {
    css += ` @media (max-width: 768px) { ${selector} { ${objectToCSS(styles.tablet as any)} } }`;
  }
  if (styles.mobile) {
    css += ` @media (max-width: 375px) { ${selector} { ${objectToCSS(styles.mobile as any)} } }`;
  }

  const childWithId = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, { id: blockId })
    : children;

  return (
    <>
      <style>{css}</style>
      {childWithId}
    </>
  );
}

function BlockContent({
  block,
  style,
  forceBreakpoint,
}: {
  block: Block;
  style?: React.CSSProperties;
  forceBreakpoint?: string;
}) {
  const props = (block as any).props;
  const s = style || {};

  switch (block.type) {
    case "container":
      return (
        <div style={s}>
          {(block as ContainerBlock).children?.map((child: Block) => (
            <BlockPreview key={child.id} block={child} forceBreakpoint={forceBreakpoint} />
          ))}
          {(block as ContainerBlock).children?.length === 0 && (
            <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>Empty container</div>
          )}
        </div>
      );

    case "text":
      return <p style={s}>{props?.content}</p>;

    case "heading": {
      const level = props?.level || "h2";
      return React.createElement(level, { style: s }, props?.content);
    }

    case "blockquote":
      return <blockquote style={s}>{props?.content || "Quote"}</blockquote>;

    case "image":
      return <img src={props?.src || "https://placehold.co/600x400"} alt={props?.alt || ""} style={s} />;

    case "video": {
      const finalEmbedUrl = props.embedUrl ? getEmbedUrl(props.embedUrl) : "";
      if (props.embedUrl) {
        return <iframe src={finalEmbedUrl} style={s} allowFullScreen />;
      }
      if (props.fileUrl) {
        return <video src={props.fileUrl} controls style={s} />;
      }
      return <div style={s}>No video source</div>;
    }

    case "icon":
      return (
        <svg
          width={props?.size || 24}
          height={props?.size || 24}
          viewBox="0 0 24 24"
          fill={props?.color || "#000"}
          style={s}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );

    case "button": {
      const href = props?.href || "#";
      return (
        <a href={href} style={s}>
          {props?.label || "Button"}
        </a>
      );
    }

    case "form":
      return (
        <form style={s}>
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
      return <hr style={s} />;

    case "spacer":
      return <div style={s} />;

    case "columns": {
      const cols = block as ColumnsBlock;
      return (
        <div style={s}>
          {cols.children.map((col) => {
            const colStyle = (col as any).props?.styles
              ? forceBreakpoint
                ? getResponsiveStyle((col as any).props?.styles, forceBreakpoint)
                : buildStyle((col as any).props?.styles)
              : {};
            return (
              <div key={col.id} style={colStyle}>
                {col.blocks.map((childBlock) => (
                  <BlockPreview key={childBlock.id} block={childBlock} forceBreakpoint={forceBreakpoint} />
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    case "map":
      if (props.embedUrl) {
        return <iframe src={props.embedUrl} style={s} loading="lazy" allowFullScreen title="Map" />;
      }
      return <div style={s}>No map URL</div>;

    case "social":
      return (
        <div style={s}>
          {(props?.links || []).map((link: any, i: number) => (
            <a key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer">
              {link.platform || "Link"}
            </a>
          ))}
        </div>
      );

    default:
      return <div style={s}>{block.type}</div>;
  }
}

export function BlockPreview({ block, forceBreakpoint }: { block: Block; forceBreakpoint?: string }) {
  const props = (block as any).props;
  const rawStyles = props?.styles;

  if (forceBreakpoint) {
    const directStyle = getResponsiveStyle(rawStyles, forceBreakpoint);
    return <BlockContent block={block} style={directStyle} forceBreakpoint={forceBreakpoint} />;
  }

  const breakpointStyles = getBreakpointStyles(rawStyles);
  return (
    <RenderWithBreakpoints blockId={block.id} styles={breakpointStyles}>
      <BlockContent block={block} forceBreakpoint={undefined} />
    </RenderWithBreakpoints>
  );
}
