import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewEncapsulation, } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from "@angular/forms";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { LoadingService } from "@core/utils/loading/loading.service";
import { RoutingListener } from "@core/utils/routing.listener";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { LoginBackgroundComponent } from "app/login/ui/login-background/login-background.component";
import { SharedModule } from "primeng/api";
import { AutoFocusModule } from "primeng/autofocus";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
let LoginComponent = class LoginComponent {
    constructor() {
        this.authService = inject(AuthenticationService);
        this.loadingService = inject(LoadingService);
        this.snackbarService = inject(SnackbarService);
        this.destroyRef = inject(DestroyRef);
        this.routingListener = inject(RoutingListener);
        this.userServerUrl = inject(APP_CONFIG).apiGateway;
        this.isPasswordHidden = true;
        this.isLoading = false;
        this.isRedirecting = false;
        this.formGroup = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email]),
            password: new FormControl("", [Validators.required]),
        });
    }
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
        this.routingListener.navigationStart$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
            this.isRedirecting = true;
        });
    }
    login() {
        if (this.formGroup.invalid) {
            return;
        }
        if (this.email && this.password) {
            this.isLoading = true;
            this.loadingService.start();
            this.authService
                .login(this.email.value, this.password.value)
                .subscribe((res) => {
                if (res) {
                    const { firstName, lastName } = this.authService.user() || {};
                    this.snackbarService.displayInfo(`Bienvenue ${firstName} ${lastName}`);
                }
                else {
                    this.formGroup.setErrors({ incorrect: true });
                }
                this.loadingService.stop();
                this.isLoading = false;
            });
        }
    }
};
LoginComponent = __decorate([
    Component({
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
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map