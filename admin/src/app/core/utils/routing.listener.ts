import { Injectable, inject } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { filter, map } from "rxjs";

const loginUrl = "/login";

@Injectable({ providedIn: "root" })
export class RoutingListener {
  private readonly router = inject(Router);
  private readonly sidenavService = inject(SidenavService);

  public readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );

  public readonly navigationStart$ = this.router.events.pipe(
    filter(
      (event): event is NavigationStart => event instanceof NavigationStart,
    ),
  );

  private readonly routeManager$ = this.navigationEnd$.pipe(
    this.sidenavService.setActiveUrl(),
  );

  public readonly isLoginPage$ = this.routeManager$.pipe(
    map((event) => event.url.includes(loginUrl)),
  );
}
