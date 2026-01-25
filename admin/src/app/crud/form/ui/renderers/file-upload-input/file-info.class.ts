type FileInfoBuilder =
  | { type: "local"; file: File; src: string }
  | { type: "server"; src: string };

export class FileInfo {
  src = "";
  file?: File;

  constructor(fileInfoBuilder: FileInfoBuilder) {
    if (fileInfoBuilder.type === "server") {
      this.src = fileInfoBuilder.src;
    } else {
      this.src = URL.createObjectURL(fileInfoBuilder.file);
      this.file = fileInfoBuilder.file;
    }
  }

  get name() {
    return typeof this.src === "string"
      ? // Extract last part of src
        this.src.substring(this.src.lastIndexOf("/") + 1)
      : // Get name from file
        this.file?.name || "";
  }
}
