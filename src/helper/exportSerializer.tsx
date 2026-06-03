import type { Project, Block, ColumnsBlock, ContainerBlock, ColumnBlock } from "@/types";
import { getEmbedUrl } from "@/helper/getEmbedUrl";
import { normalizeStyles } from "@/helper/normalizeStyles";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>]/g, (m) => {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

function escapeAttr(str: string): string {
  if (!str) return "";
  return str.replace(/[&"]/g, (m) => {
    if (m === "&") return "&amp;";
    if (m === '"') return "&quot;";
    return m;
  });
}

function objectToInlineStyle(styles: Record<string, string | number>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${String(value)}`)
    .join("; ");
}

function getStyleForBreakpoint(rawStyles: any, breakpoint: string): Record<string, any> {
  const normalized = normalizeStyles(rawStyles);
  const base = normalized.base || {};
  if (breakpoint === "base") return { ...base };
  if (breakpoint === "tablet") return { ...base, ...(normalized.tablet ?? {}) };
  if (breakpoint === "mobile") return { ...base, ...(normalized.tablet ?? {}), ...(normalized.mobile ?? {}) };
  return { ...base };
}

function renderBlock(block: Block | ColumnBlock): string {
  const props = (block as any).props || {};
  const idAttr = ` id="${block.id}"`;
  const classes = (props.classes || []).filter(Boolean).join(" ");
  const classAttr = classes ? ` class="${classes}"` : "";

  switch (block.type) {
    case "text":
      return `<p${idAttr}${classAttr}>${escapeHtml(props.content || "")}</p>`;
    case "heading": {
      const level = props.level || "h2";
      return `<${level}${idAttr}${classAttr}>${escapeHtml(props.content || "")}</${level}>`;
    }
    case "blockquote":
      return `<blockquote${idAttr}${classAttr}>${escapeHtml(props.content || "")}</blockquote>`;
    case "image":
      return `<img${idAttr}${classAttr} src="${escapeAttr(props.src || "")}" alt="${escapeAttr(props.alt || "")}" />`;
    case "video": {
      if (props.embedUrl) {
        const embedUrl = getEmbedUrl(props.embedUrl);
        if (embedUrl) {
          return `<iframe${idAttr}${classAttr} src="${escapeAttr(embedUrl)}" allowfullscreen></iframe>`;
        }
      }
      const videoSrc = props.fileUrl || "";
      if (videoSrc) {
        return `<video${idAttr}${classAttr} controls><source src="${escapeAttr(videoSrc)}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }
      return `<div${idAttr}${classAttr}>No video source</div>`;
    }
    case "icon": {
      const size = props.size || 24;
      const color = props.color || "#000";
      return `<svg${idAttr}${classAttr} style="width:${size}px; height:${size}px; fill:${color};" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
    }
    case "button":
      return `<a${idAttr}${classAttr} href="${escapeAttr(props.href || "#")}">${escapeHtml(props.label || "Button")}</a>`;
    case "form": {
      const fields = (props.fields || [])
        .map(
          (field: any, idx: number) => `
        <div>
          <label>${escapeHtml(field.name)}</label>
          ${field.type === "textarea" ? `<textarea name="field_${idx}"></textarea>` : `<input type="${field.type || "text"}" name="field_${idx}" />`}
        </div>`,
        )
        .join("");
      return `<form${idAttr}${classAttr}>${fields}<button type="submit">${escapeHtml(props.submitLabel || "Submit")}</button></form>`;
    }
    case "divider":
      return `<hr${idAttr}${classAttr} />`;
    case "spacer":
      return `<div${idAttr}${classAttr}></div>`;
    case "columns": {
      const cols = block as ColumnsBlock;
      const columnsHtml = cols.children
        .map((col: ColumnBlock) => {
          const innerHtml = col.blocks.map((child) => renderBlock(child)).join("");
          return `<div id="${col.id}">${innerHtml}</div>`;
        })
        .join("");
      return `<div${idAttr}${classAttr}>${columnsHtml}</div>`;
    }
    case "container": {
      const container = block as ContainerBlock;
      const childrenHtml = (container.children || []).map((child) => renderBlock(child)).join("");
      return `<div${idAttr}${classAttr}>${childrenHtml}</div>`;
    }
    case "map":
      if (props.embedUrl) {
        return `<iframe${idAttr}${classAttr} src="${escapeAttr(props.embedUrl)}" loading="lazy" allowfullscreen title="Map"></iframe>`;
      }
      return `<div${idAttr}${classAttr}>No map URL</div>`;
    case "social": {
      const links = (props.links || [])
        .map(
          (link: any) =>
            `<a href="${escapeAttr(link.url || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.platform || "Link")}</a>`,
        )
        .join("");
      return `<div${idAttr}${classAttr}>${links}</div>`;
    }
    default:
      return `<div${idAttr}${classAttr}>${block.type}</div>`;
  }
}

function collectBlockCSS(block: Block | ColumnBlock, cssParts: string[]) {
  const rawStyles = (block as any).props?.styles;
  console.log(`🔍 collectBlockCSS - blockId: ${block.id}, type: ${block.type}, rawStyles:`, JSON.stringify(rawStyles));
  if (!rawStyles) return;

  const baseStyle = getStyleForBreakpoint(rawStyles, "base");
  const tabletStyle = getStyleForBreakpoint(rawStyles, "tablet");
  const mobileStyle = getStyleForBreakpoint(rawStyles, "mobile");

  const selector = `#${block.id}`;
  if (Object.keys(baseStyle).length > 0) {
    const cssLine = `${selector} { ${objectToInlineStyle(baseStyle)} }`;
    console.log(`   ✅ Added base CSS:`, cssLine);
    cssParts.push(cssLine);
  } else {
    console.warn(`   ⚠️ No base style for ${block.id}`);
  }
  if (Object.keys(tabletStyle).length > 0) {
    const cssLine = `@media (max-width: 768px) { ${selector} { ${objectToInlineStyle(tabletStyle)} } }`;
    console.log(`   ✅ Added tablet CSS:`, cssLine);
    cssParts.push(cssLine);
  } else {
    console.warn(`   ⚠️ No tablet style for ${block.id}`);
  }
  if (Object.keys(mobileStyle).length > 0) {
    const cssLine = `@media (max-width: 375px) { ${selector} { ${objectToInlineStyle(mobileStyle)} } }`;
    console.log(`   ✅ Added mobile CSS:`, cssLine);
    cssParts.push(cssLine);
  } else {
    console.warn(`   ⚠️ No mobile style for ${block.id}`);
  }

  // Đệ quy cho columns và container
  if (block.type === "columns") {
    (block as ColumnsBlock).children.forEach((col) => {
      const colRawStyles = (col as any).props?.styles;
      if (colRawStyles) {
        const colBase = getStyleForBreakpoint(colRawStyles, "base");
        const colTablet = getStyleForBreakpoint(colRawStyles, "tablet");
        const colMobile = getStyleForBreakpoint(colRawStyles, "mobile");
        const colSelector = `#${col.id}`;
        if (Object.keys(colBase).length > 0) {
          cssParts.push(`${colSelector} { ${objectToInlineStyle(colBase)} }`);
        }
        if (Object.keys(colTablet).length > 0) {
          cssParts.push(`@media (max-width: 768px) { ${colSelector} { ${objectToInlineStyle(colTablet)} } }`);
        }
        if (Object.keys(colMobile).length > 0) {
          cssParts.push(`@media (max-width: 375px) { ${colSelector} { ${objectToInlineStyle(colMobile)} } }`);
        }
      }
      col.blocks.forEach((child) => collectBlockCSS(child, cssParts));
    });
  } else if (block.type === "container") {
    (block as ContainerBlock).children?.forEach((child) => collectBlockCSS(child, cssParts));
  }
}

export function generateHTML(project: Project): string {
  const page = project.pages[0];
  if (!page) return "<html><body>No page</body></html>";

  console.log(
    "📄 project.pages[0].sections:",
    page.sections.map((s) => ({ id: s.id, blocks: s.blocks.map((b) => ({ id: b.id, type: b.type })) })),
  );

  const sectionsHtml = page.sections
    .map((section) => {
      const sectionId = section.id;
      const sectionClass = `section-${sectionId}`;
      const blocksHtml = section.blocks.map((block) => renderBlock(block)).join("");
      return `<section id="${sectionId}" class="${sectionClass}">${blocksHtml}</section>`;
    })
    .join("");

  const cssParts: string[] = [];
  page.sections.forEach((section) => {
    const rawStyles = (section.props as any)?.styles ?? {};
    const baseStyle = getStyleForBreakpoint(rawStyles, "base");
    const tabletStyle = getStyleForBreakpoint(rawStyles, "tablet");
    const mobileStyle = getStyleForBreakpoint(rawStyles, "mobile");
    const selector = `.section-${section.id}`;
    if (Object.keys(baseStyle).length > 0) {
      cssParts.push(`${selector} { ${objectToInlineStyle(baseStyle)} }`);
    }
    if (Object.keys(tabletStyle).length > 0) {
      cssParts.push(`@media (max-width: 768px) { ${selector} { ${objectToInlineStyle(tabletStyle)} } }`);
    }
    if (Object.keys(mobileStyle).length > 0) {
      cssParts.push(`@media (max-width: 375px) { ${selector} { ${objectToInlineStyle(mobileStyle)} } }`);
    }
    section.blocks.forEach((block) => collectBlockCSS(block, cssParts));
  });

  const css = cssParts.join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${escapeHtml(project.name || "Noraliz Website")}</title>
  <style>${css}</style>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${sectionsHtml}
</body>
</html>`;
}

export function downloadHTML(project: Project, filename?: string) {
  const html = generateHTML(project);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${project.name || "website"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
