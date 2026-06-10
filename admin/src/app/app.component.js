import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AuthenticationService } from "@core/auth/auth.service";
import { NavbarComponent } from "@core/ui/navbar/navbar.component";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { LoadingService } from "@core/utils/loading/loading.service";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ToastModule } from "primeng/toast";
import { SidenavComponent } from "./core/ui/sidenav/sidenav.component";
let AppComponent = class AppComponent {
    constructor() {
        this.authService = inject(AuthenticationService);
        this.sidenavService = inject(SidenavService);
        this.aclService = inject(AclService);
        this.loadingService = inject(LoadingService);
        this.isAuthenticated = this.authService.isAuthenticated;
        this.areAclResolved = this.aclService.areAclResolved;
        this.isLoading = this.loadingService.isLoading;
        this.loadingMode = this.loadingService.mode;
    }
    get getExpanded() {
        return this.sidenavService.getExpanded();
    }
    get getPinned() {
        return this.sidenavService.getPinned();
    }
    get getMobileDisplay() {
        return this.sidenavService.getMobileDisplay();
    }
};
AppComponent = __decorate([
    Component({
        selector: "adm-root",
        templateUrl: "./app.component.html",
        imports: [
            NavbarComponent,
            SidenavComponent,
            RouterOutlet,
            ToastModule,
            ProgressSpinnerModule,
            ProgressBarModule,
        ],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map