import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import saveAs from "file-saver";
import { delay, retry, tap } from "rxjs";

const delayBetweenTries = 2000;
const maxRetry = 5;

const noPrintingInfoMessage = $localize`:@@Download_PrintingErrorMessage:Le fichier n'est pas un PDF, l'impression n'est pas disponible. Il sera téléchargé à la place.`;

@Injectable({ providedIn: "root" })
export class DownloadService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  /**
   * Downloads a blob as a file or opens it in a print module for PDFs.
   *
   * @param data - The blob data to download. Throws an error if null.
   * @param fileName - The name to use for the downloaded file.
   * @param openPrintModule - If true, opens PDF files in print module instead of downloading.
   *                          Shows info message for non-PDF files. Defaults to false.
   *
   * @throws {Error} When data is null or undefined.
   */
  public downloadBlob(
    data: Blob | null,
    fileName: string,
    openPrintModule = false,
  ) {
    if (!data) {
      throw new Error("No data to download");
    }
    const blob = new Blob([data], {
      type: data.type,
    });
    // If an automatic print is requested and blob is .pdf, open the print module
    const isPdf = data.type === "application/pdf";
    if (openPrintModule) {
      if (isPdf) {
        this.openPrintModule(blob);
        return;
      }
      this.snackbarService.displayInfo(noPrintingInfoMessage);
    }
    // Otherwise, download the file
    saveAs(blob, fileName);
  }

  /**
   * Downloads a file from the given location and saves it locally.
   * If the file is not found, it retries the download up to 5 times with a
   * 2 second delay between each try.
   *
   * @param location the URL of the file to download
   * @returns an Observable that emits nothing
   * @throws an error if the file is not found after the maximum number of retries
   */
  public tryDownloadFile(
    location: string,
    filename = "",
    openPrintModule = false,
  ) {
    console.log("Downloading file from:", location, filename);
    return this.http.get(location, { responseType: "blob" }).pipe(
      delay(delayBetweenTries),
      tap((blob) => {
        const filenameFromLocation = location.split("/").pop();
        const finalFilename =
          filename || filenameFromLocation || "downloaded_file";
        this.downloadBlob(blob, finalFilename, openPrintModule);
      }),
      retry(maxRetry),
    );
  }

  private openPrintModule(blob: Blob) {
    // Create object URL
    const fileUrl = URL.createObjectURL(blob);

    // Open in new window and print
    const printWindow = window.open(fileUrl, "_blank");

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // Clean up URL after a delay
        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      };
    }
  }

  /**
   * Extracts the file name from the content disposition header of the response.
   * @param response The HTTP response containing the blob.
   * @returns The extracted file name or "undefined" if not found.
   */
  public extractFileInfo(response: HttpResponse<Blob>): string {
    // Extract content disposition header
    const contentDisposition =
      response.headers.get("content-disposition") ?? "";
    // Extract the file name
    const filename = contentDisposition
      .split(";")[1]
      .split("filename")[1]
      .split("=")[1]
      .trim();
    return filename;
  }
}
