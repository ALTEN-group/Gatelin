import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from "@angular/forms";
import { AuthenticationService } from "@core/auth/auth.service";
import { LoginBackgroundComponent } from "app/login/ui/login-background/login-background.component";
import { PasswordConfirmValidator } from "app/login/utils/validators/password-confirm.validator";
import { PasswordStrengthValidator } from "app/login/utils/validators/password-strength.validator";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
let ResetPwdComponent = class ResetPwdComponent {
    constructor() {
        this.isPasswordHidden = true;
        this.isPasswordConfirmHidden = true;
        this.authService = inject(AuthenticationService);
    }
    ngOnInit() {
        this.passwordFormGroup = new FormGroup({
            email: new FormControl(this.authService.user()?.email),
            password: new FormControl("", [
                Validators.required,
                PasswordStrengthValidator,
            ]),
            passwordConfirm: new FormControl("", [Validators.required]),
        }, { validators: PasswordConfirmValidator });
    }
    get password() {
        return this.passwordFormGroup?.get("password");
    }
    get passwordConfirm() {
        return this.passwordFormGroup?.get("passwordConfirm");
    }
    resetPassword() {
        console.log("reset password");
    }
    toggleValue(value) {
        const val = value;
        this[val] = !this[val];
    }
};
ResetPwdComponent = __decorate([
    Component({
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
], ResetPwdComponent);
export { ResetPwdComponent };
//# sourceMappingURL=reset-pwd.component.js.map