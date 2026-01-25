import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
} from "@angular/core";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { DownloadService } from "@crud/core/utils/download/download.service";
import { FileInfo } from "@form/ui/renderers/file-upload-input/file-info.class";
import { FileNamePipe } from "@form/ui/renderers/file-upload-input/file-name.pipe";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "frm-file-upload-input",
  templateUrl: "./file-upload-input.component.html",
  styleUrls: ["./file-upload-input.component.scss"],
  imports: [DividerModule, ButtonModule, TooltipModule, FileNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadInputComponent extends FormFieldBaseComponent {
  private readonly dlService = inject(DownloadService);
  private readonly snackbarService = inject(SnackbarService);

  test() {
    this.snackbarService.displayError("test error");
  }

  private readonly isImage = computed(
    () =>
      this.config().controlType === "files" &&
      this.options().mediaType === "image",
  );

  public readonly accept = computed(() => {
    const mediaType = this.options().mediaType;
    if (!mediaType) {
      return "";
    }
    if (mediaType.startsWith(".")) {
      return mediaType;
    }
    return `${mediaType}/*`;
  });

  public readonly canAddMore = computed(() => {
    return this.options().multiple ? true : this.localFiles().length === 0;
  });

  public readonly localFiles = linkedSignal<FileInfo[]>(() => {
    if (this.control().value) {
      return this.control().value as FileInfo[];
    }
    return [];
  });

  public isDraggedOver = false;

  public async onFileUploaded(fileInput: HTMLInputElement) {
    const filesList: FileList | null = fileInput.files;
    const validatedFilesList = await this.validateFilesList(filesList);
    if (!validatedFilesList.length) {
      return;
    }
    const files = this.options().multiple
      ? this.localFiles().concat(validatedFilesList)
      : validatedFilesList;
    this.localFiles.set(files);
    // Update control value
    this.setControlValue();
    this.emitInteractionEvent("uploadFile", this.localFiles());
  }

  public onDrop(event: DragEvent, fileInput: HTMLInputElement): void {
    if (!event.dataTransfer) {
      return;
    }
    fileInput.files = event.dataTransfer.files;
    this.isDraggedOver = false;
    this.onFileUploaded(fileInput);
    this.prevent(event);
  }

  public onDragOver(event: DragEvent): void {
    this.isDraggedOver = true;
    this.prevent(event);
  }

  public onDragLeave(event: DragEvent): void {
    this.isDraggedOver = false;
    this.prevent(event);
  }

  public clearAll(fileInput: HTMLInputElement) {
    this.localFiles.set([]);
    this.emitInteractionEvent("clearAllFiles");
    fileInput.value = "";
    // Update control value
    this.setControlValue();
  }

  public clear(index: number, fileInput: HTMLInputElement): void {
    // Delete locally uploaded file
    this.localFiles.update((f) => f.filter((_, i) => i !== index));
    // Emit event
    this.emitInteractionEvent("clearFile", index);
    // Clear native input
    fileInput.value = "";
    // Update control value
    this.setControlValue();
  }

  public prevent(event: DragEvent): void {
    event.preventDefault();
  }

  public onDownload(file: FileInfo): void {
    if (file.file) {
      const blob = new Blob([file.file], { type: file.file.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      this.dlService.tryDownloadFile(file.src, file.name, false).subscribe();
    }
  }

  private setControlValue(): void {
    this.control().setValue(this.localFiles());
  }

  private async validateFilesList(
    filesList: FileList | null,
  ): Promise<FileInfo[]> {
    if (!filesList || !filesList?.length) {
      return [];
    }
    const files: FileInfo[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const maxFileSize = this.options().maxFileSize;
      if (maxFileSize && file.size > maxFileSize) {
        const message = $localize`:@@FileUpload_MaxFileSizeExceeded:Le fichier "${file.name}" dépasse la taille maximale autorisée de ${maxFileSize} octets.`;
        this.snackbarService.displayError(message);
        this.control().setErrors({ maxFileSize: true }); // does not work
        this.control().markAsTouched();
      } else {
        const fileInfo = await this.readLocalFile(file);
        files.push(fileInfo);
      }
    }
    return files;
  }

  private readLocalFile(file: File): Promise<FileInfo> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      if (this.isImage()) {
        reader.readAsDataURL(file as Blob);
      } else {
        reader.readAsText(file as Blob, "utf8");
      }
      reader.onload = () => {
        const fileInfo = new FileInfo({
          type: "local",
          file,
          src: reader.result as string,
        });
        resolve(fileInfo);
      };
    });
  }
}
