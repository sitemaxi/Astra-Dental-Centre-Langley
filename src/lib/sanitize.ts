import DOMPurify from "dompurify";

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
}

export function stripHtmlFields<T extends object>(record: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    out[key] = typeof value === "string" ? stripHtml(value) : value;
  }
  return out as T;
}

const BLOG_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
  "ul", "ol", "li", "a", "img", "strong", "b", "em", "i", "u",
  "blockquote", "span", "div", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
];

const BLOG_ATTRS = ["href", "target", "rel", "title", "src", "alt", "width", "height", "loading", "class", "id", "colspan", "rowspan"];

const SAFE_URL = /^(?:(?:https?|mailto|tel):|\/|#)/i;

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  for (const attr of ["href", "src"]) {
    const url = node.getAttribute(attr);
    if (url !== null && !SAFE_URL.test(url.trim())) node.removeAttribute(attr);
  }
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeBlogHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: BLOG_TAGS,
    ALLOWED_ATTR: BLOG_ATTRS,
    ALLOW_DATA_ATTR: false,
  });
}
