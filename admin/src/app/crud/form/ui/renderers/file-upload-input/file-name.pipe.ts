import { Pipe, PipeTransform } from "@angular/core";
import { FileInfo } from "@form/ui/renderers/file-upload-input/file-info.class";

@Pipe({
  name: "fileName",
})
export class FileNamePipe implements PipeTransform {
  transform(value: FileInfo): string {
    if (value.file) {
      return value.file.name;
    }
    return value.name;
  }
}
