import { DomSanitizer } from "@angular/platform-browser";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{3,8}$/;
const FALLBACK_COLOR = "#6B7280";

export interface ColoredChipItem {
  label: string;
  color: string | null;
}

/**
 * Builds a customCellRenderer that displays a value as a colored chip.
 * The color is resolved via a lookup function that maps the cell value to a ColoredChipItem.
 *
 * @param sanitizer - Angular DomSanitizer to bypass security for trusted HTML
 * @param lookup - Function that resolves a cell value to a ColoredChipItem
 */
export function buildColoredChipCellRenderer(
  sanitizer: DomSanitizer,
  lookup: (cellValue: unknown) => ColoredChipItem | undefined,
): (cellValue: unknown) => string {
  return (cellValue: unknown): string => {
    const item = lookup(cellValue);
    const label = String(item?.label ?? cellValue ?? "");
    const rawColor = String(item?.color ?? "").trim();
    const color = HEX_COLOR_REGEX.test(rawColor) ? rawColor : FALLBACK_COLOR;
    const html = `<span style="display:inline-flex;align-items:center;padding:2px 10px;border-radius:12px;background:${color};color:#fff;font-size:0.85em;">${label}</span>`;
    return sanitizer.bypassSecurityTrustHtml(html) as unknown as string;
  };
}
