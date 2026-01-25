import { inject, Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { filter, map } from "rxjs";

const loginUrl = "/login";

@Injectable({ providedIn: "root" })
export class RoutingListener {
  private readonly router = inject(Router);
  private readonly sidenavService = inject(SidenavService);

  public readonly events$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );

  private readonly routeManager$ = this.events$.pipe(
    this.sidenavService.setActiveUrl(),
  );

  public readonly isLoginPage$ = this.routeManager$.pipe(
    map((event) => event.url.includes(loginUrl)),
  );
}
