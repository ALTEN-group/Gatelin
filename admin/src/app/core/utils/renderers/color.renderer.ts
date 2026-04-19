import { DomSanitizer } from "@angular/platform-browser";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{3,8}$/;

export function buildColorCellRenderer(
  sanitizer: DomSanitizer,
): (cellValue: unknown) => string {
  return (cellValue: unknown): string => {
    const hex = String(cellValue ?? "").trim();
    if (!HEX_COLOR_REGEX.test(hex)) return "";
    const html = `<span style="display:inline-flex;align-items:center;gap:0.5rem;"><span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:${hex};border:1px solid rgba(0,0,0,0.15);flex-shrink:0;"></span><span>${hex}</span></span>`;
    return sanitizer.bypassSecurityTrustHtml(html) as unknown as string;
  };
}
