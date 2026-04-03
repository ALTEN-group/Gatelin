import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthenticationService } from "@core/auth/auth.service";
import { LoginBackgroundComponent } from "app/login/ui/login-background/login-background.component";
import { PasswordConfirmValidator } from "app/login/utils/validators/password-confirm.validator";
import { PasswordStrengthValidator } from "app/login/utils/validators/password-strength.validator";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "adm-reset-pwd",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./reset-pwd.component.html",
  styleUrls: ["./reset-pwd.component.scss"],
  imports: [
    LoginBackgroundComponent,
    CardModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class ResetPwdComponent implements OnInit {
  public passwordFormGroup!: FormGroup;
  public isPasswordHidden = true;
  public isPasswordConfirmHidden = true;

  private readonly authService = inject(AuthenticationService);

  ngOnInit() {
    this.passwordFormGroup = new FormGroup(
      {
        email: new FormControl(this.authService.user()?.email),
        password: new FormControl("", [
          Validators.required,
          PasswordStrengthValidator,
        ]),
        passwordConfirm: new FormControl("", [Validators.required]),
      },
      { validators: PasswordConfirmValidator },
    );
  }

  public get password() {
    return this.passwordFormGroup?.get("password");
  }

  public get passwordConfirm() {
    return this.passwordFormGroup?.get("passwordConfirm");
  }

  public resetPassword(): void {
    console.log("reset password");
  }

  public toggleValue(value: string): void {
    const val = value as keyof typeof this;
    (this[val] as boolean) = !this[val];
  }
}
