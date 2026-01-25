import { Pipe } from "@angular/core";

const defaultWidth = "150px";

@Pipe({
  name: "colWidth",
  standalone: true,
})
export class ColWidthPipe {
  transform(width: string | undefined): string {
    return width ?? defaultWidth;
  }
}
