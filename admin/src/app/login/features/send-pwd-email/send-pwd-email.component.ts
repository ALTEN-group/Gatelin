import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthenticationService } from "@core/auth/auth.service";
import { LoadingService } from "@core/utils/loading/loading.service";
import { EmailValidator } from "@form/utils/email.validator";
import { SharedModule } from "primeng/api";
import { CardModule } from "primeng/card";
@Component({
  selector: "adm-send-pwd-email",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./send-pwd-email.component.html",
  styleUrls: ["./send-pwd-email.component.scss"],
  imports: [CardModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class SendPwdEmailComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthenticationService);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  public emailFormGroup!: FormGroup;

  ngOnInit() {
    this.emailFormGroup = new FormGroup({
      emailFormControl: new FormControl(this.authService.user()?.email || "", [
        Validators.required,
        EmailValidator,
      ]),
    });

    this.listenToEmailFormControlStatusChanges();
  }

  public get email() {
    return this.emailFormGroup.get("emailFormControl");
  }

  public cancel(): void {
    this.location.back();
  }

  public send(): void {
    console.log("todo: send email");
  }

  private listenToEmailFormControlStatusChanges() {
    this.email?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status: string) => {
        switch (status) {
          case "INVALID":
            this.loadingService.stop();
            break;
          case "PENDING":
            this.loadingService.start();
            break;
          case "VALID":
            this.loadingService.stop();
            break;
        }
      });
  }
}
