import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { LoadingService } from "@core/utils/loading/loading.service";
import { RoutingListener } from "@core/utils/routing.listener";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { SharedModule } from "@openng/optimus-ui/api";
import { AutoFocusModule } from "@openng/optimus-ui/autofocus";
import { AvatarModule } from "@openng/optimus-ui/avatar";
import { ButtonModule } from "@openng/optimus-ui/button";
import { CardModule } from "@openng/optimus-ui/card";
import { InputGroupModule } from "@openng/optimus-ui/inputgroup";
import { InputGroupAddonModule } from "@openng/optimus-ui/inputgroupaddon";
import { InputTextModule } from "@openng/optimus-ui/inputtext";
import { LoginBackgroundComponent } from "app/login/ui/login-background/login-background.component";

@Component({
  selector: "app-login",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly authService = inject(AuthenticationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly routingListener = inject(RoutingListener);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);

  public readonly userServerUrl = inject(APP_CONFIG).gatelinApi;
  /** Optional Foxnox (or other) recovery workflow URL. */
  public readonly passwordRecoveryUrl = inject(APP_CONFIG).passwordRecoveryUrl;

  public isPasswordHidden = true;
  public isLoading = false;
  public isRedirecting = false;

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  get email() {
    return this.formGroup.get("email");
  }

  get password() {
    return this.formGroup.get("password");
  }

  ngOnInit() {
    // Coming back from a mid-login challenge solved on the pwd service.
    const ticket = this.route.snapshot.queryParamMap.get("ticket");
    if (!ticket) return;

    // Avoid flashing the login form while the resume-login request completes.
    this.isRedirecting = true;
    this.isLoading = true;
    this.loadingService.start();
    this.authService
      .resumeLogin(ticket)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: boolean) => {
        if (res) {
          const { firstName, lastName } = this.authService.user() || {};
          this.snackbarService.displayInfo(
            `Bienvenue ${firstName} ${lastName}`,
          );
        } else {
          this.formGroup.setErrors({ incorrect: true });
          this.isRedirecting = false;
        }
        this.loadingService.stop();
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formGroup.setErrors(null);
      });

    this.routingListener.navigationStart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isRedirecting = true;
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
            const { firstName, lastName } = this.authService.user() || {};
            this.snackbarService.displayInfo(
              `Bienvenue ${firstName} ${lastName}`,
            );
          } else {
            this.formGroup.setErrors({ incorrect: true });
          }
          this.loadingService.stop();
          this.isLoading = false;
          this.cdr.markForCheck();
        });
    }
  }
}
