import { TitleCasePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { MessageService, ToastMessageOptions } from "primeng/api";

@Injectable({ providedIn: "root" })
export class SnackbarService {
  constructor(private readonly messageService: MessageService) {}

  public displayError(message = "Une erreur est survenue") {
    this.show({
      severity: "error",
      detail: message,
      key: "bottomCenter",
    });
  }

  public displaySuccess() {
    this.show({
      key: "topRight",
      severity: "success",
      closable: false,
    });
  }

  public displayInfo(message: string) {
    this.show({
      detail: message,
      key: "topRight",
    });
  }

  private show(messageConfig: ToastMessageOptions): void {
    if (!messageConfig.key) {
      if (!messageConfig.severity) {
        messageConfig.severity = "info";
      }
      if (!messageConfig.summary) {
        messageConfig.summary = TitleCasePipe.prototype.transform(
          messageConfig.severity,
        );
      }
    }
    this.messageService.add(messageConfig);
  }
}
