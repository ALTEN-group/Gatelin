import { TitleCasePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { MessageService, ToastMessageOptions } from "@openng/optimus-ui/api";

@Injectable({ providedIn: "root" })
export class SnackbarService {
  constructor(private readonly messageService: MessageService) {}

  public displayError(message = "Une erreur est survenue") {
    this.show({
      severity: "error",
      detail: message,
      key: "topRight",
    });
  }

  public displaySuccess() {
    this.show({
      key: "bottomCenter",
      severity: "success",
      closable: false,
    });
  }

  public displayInfo(message: string) {
    this.show({
      detail: message,
      key: "bottomCenter",
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
