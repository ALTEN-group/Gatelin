import { __decorate } from "tslib";
import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from "@angular/forms";
import { AuthenticationService } from "@core/auth/auth.service";
import { LoadingService } from "@core/utils/loading/loading.service";
import { EmailValidator } from "@dwtechs/crud-builder";
import { SharedModule } from "primeng/api";
import { CardModule } from "primeng/card";
let SendPwdEmailComponent = class SendPwdEmailComponent {
    constructor() {
        this.loadingService = inject(LoadingService);
        this.authService = inject(AuthenticationService);
        this.location = inject(Location);
        this.destroyRef = inject(DestroyRef);
    }
    ngOnInit() {
        this.emailFormGroup = new FormGroup({
            emailFormControl: new FormControl(this.authService.user()?.email || "", [
                Validators.required,
                EmailValidator,
            ]),
        });
        this.listenToEmailFormControlStatusChanges();
    }
    get email() {
        return this.emailFormGroup.get("emailFormControl");
    }
    cancel() {
        this.location.back();
    }
    send() { }
    listenToEmailFormControlStatusChanges() {
        this.email?.statusChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((status) => {
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
};
SendPwdEmailComponent = __decorate([
    Component({
        selector: "adm-send-pwd-email",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./send-pwd-email.component.html",
        styleUrls: ["./send-pwd-email.component.scss"],
        imports: [CardModule, SharedModule, FormsModule, ReactiveFormsModule],
    })
], SendPwdEmailComponent);
export { SendPwdEmailComponent };
//# sourceMappingURL=send-pwd-email.component.js.map