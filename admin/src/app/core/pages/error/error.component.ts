import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorTranslatePipe } from "@core/pages/error/error-translate.pipe";
import { CardModule } from "primeng/card";
import { map } from "rxjs";

@Component({
  selector: "adm-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
  imports: [CardModule, AsyncPipe, ErrorTranslatePipe],
})
export class ErrorComponent {
  private readonly route = inject(ActivatedRoute);

  public code$ = this.route.params.pipe(map(({ code }) => code));
}
