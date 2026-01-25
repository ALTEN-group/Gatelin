import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { isArray } from "@dwtechs/checkard";

@Component({
  selector: "tbl-files-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isImg()) {
      <img [src]="imgSrc()" width="30" height="30" class="cell-image"/>
    } @else {
      <i class="pi pi-file"></i>
    }
  `,
})
export class FilesCellRendererComponent {
  private readonly apiPrefix = inject(APP_CONFIG).apiPrefix;

  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  public readonly isImg = computed(() => {
    const cellValue = this.cellValue();
    const { mediaType } = this.options().controlOptions ?? {};
    if (!cellValue) return false;
    return mediaType === "image";
  });

  public readonly imgSrc = computed(() => {
    const cellValue = this.cellValue();
    if (!cellValue) return "";
    if (!this.isImg()) return "";
    let portrait = cellValue;
    if (
      this.options().controlOptions?.multiple &&
      isArray<{ portrait: string; name: string }>(cellValue)
    ) {
      const portraitImg = cellValue.find((val) => val.portrait);
      portrait = portraitImg?.name || cellValue[0]?.name;
    }
    if (!portrait) {
      return "";
    }
    return `${this.apiPrefix}${portrait}`;
  });
}
