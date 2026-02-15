import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { PrimeNgTranslations } from "@core/app-config/primeng-translations";
import { AuthenticationService } from "@core/auth/auth.service";
import { NavbarComponent } from "@core/ui/navbar/navbar.component";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { LoadingService } from "@core/utils/loading/loading.service";
import { RoutingListener } from "@core/utils/routing.listener";
import { PrimeNG } from "primeng/config";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ToastModule } from "primeng/toast";
import { SidenavComponent } from "./core/ui/sidenav/sidenav.component";

@Component({
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
export class AppComponent implements OnInit {
  private readonly routingListener = inject(RoutingListener);
  private readonly authService = inject(AuthenticationService);
  private readonly sidenavService = inject(SidenavService);
  private readonly primeNgConfig = inject(PrimeNG);
  private readonly aclService = inject(AclService);
  private readonly loadingService = inject(LoadingService);

  public readonly isAuthenticated = this.authService.isAuthenticated;
  public readonly areAclResolved = this.aclService.areAclResolved;
  public readonly isLoading = this.loadingService.isLoading;
  public readonly loadingMode = this.loadingService.mode;

  get getExpanded(): boolean {
    return this.sidenavService.getExpanded();
  }
  get getPinned(): boolean {
    return this.sidenavService.getPinned();
  }
  get getMobileDisplay(): boolean {
    return this.sidenavService.getMobileDisplay();
  }

  ngOnInit() {
    // Watch for route changes
    this.listenToRoutesChanges();

    // Set translations for primeNG components
    this.setTranslations();
  }

  private listenToRoutesChanges() {
    this.routingListener.isLoginPage$.subscribe((isLoginPage) => {
      // TODO: that should probably be better in a guard
      if (isLoginPage && this.isAuthenticated()) {
        this.authService.redirectToApp();
      }
    });
  }

  private setTranslations() {
    this.primeNgConfig.setTranslation(PrimeNgTranslations);
  }
}
