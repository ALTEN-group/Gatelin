import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { LoadingService } from "@core/utils/loading/loading.service";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { EmailValidator } from "@form/utils/email.validator";
import { LoginBackgroundComponent } from "app/login/ui/login-background/login-background.component";
import { SharedModule } from "primeng/api";
import { AutoFocusModule } from "primeng/autofocus";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    AutoFocusModule,
    LoginBackgroundComponent,
    AvatarModule,
    InputGroupAddonModule,
    InputGroupModule,
    ThemeToggleButtonComponent,
  ],
})
export class LoginComponent implements AfterViewInit {
  private readonly authService = inject(AuthenticationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly userServerUrl = inject(APP_CONFIG).apiPrefix;

  public isPasswordHidden = true;
  public isLoading = false;

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, EmailValidator]),
    password: new FormControl("", [Validators.required]),
  });

  get email() {
    return this.formGroup.get("email");
  }

  get password() {
    return this.formGroup.get("password");
  }

  ngAfterViewInit() {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formGroup.setErrors(null);
      });
  }

  public login(): void {
    if (this.formGroup.invalid) {
      return;
    }

    if (this.email && this.password) {
      this.isLoading = true;
      this.loadingService.start();
      this.authService
        .login(this.email.value, this.password.value)
        .subscribe((res: boolean) => {
          if (res) {
            this.authService.redirectToApp();
            const { firstName, lastName } = this.authService.user() || {};
            this.snackbarService.displayInfo(
              `Bienvenue ${firstName} ${lastName}`,
            );
          } else {
            this.formGroup.setErrors({ incorrect: true });
          }
          this.loadingService.stop();
          this.isLoading = false;
        });
    }
  }
}
