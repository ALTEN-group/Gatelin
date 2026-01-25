import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";

@Injectable({
  providedIn: "root",
})
export class CustomTitleStrategyService extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly APP_TITLE = inject(APP_CONFIG).title;

  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.title.setTitle(`${this.APP_TITLE} - ${title}`);
    }
  }
}
