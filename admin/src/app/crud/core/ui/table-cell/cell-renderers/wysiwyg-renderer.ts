import { SlicePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { isString } from "@dwtechs/checkard";

@Component({
  selector: "tbl-wysiwyg-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe],
  template: `
    {{ value() | slice:0:20 }}
    @if (value().length > 20) {
      <span>...</span>
    }
  `,
})
export class WysiwygCellRendererComponent {
  public readonly cellValue = input.required<unknown>();

  public readonly value = computed(() => {
    const cellValue = this.cellValue();
    if (!isString(cellValue)) {
      return "";
    }
    return this.cleanWysiwygContent(cellValue);
  });

  private cleanWysiwygContent(value: string): string {
    // Simple sanitization: remove script tags and potentially harmful attributes
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    // Remove script tags
    const scripts = tempDiv.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      scripts[i].parentNode?.removeChild(scripts[i]);
    }
    // Return text content only
    return tempDiv.textContent || tempDiv.innerText || "";
  }
}
