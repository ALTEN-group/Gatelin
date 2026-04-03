import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { distinctUntilChanged, filter, map } from "rxjs/operators";

// const HOME: MenuItem = {
//   label: $localize`:@@Home_homeNav:Accueil`,
//   routerLink: `${AppPaths.HOME}`,
// };

@Component({
  selector: "adm-breadcrumb",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
  imports: [BreadcrumbModule],
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly events$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    distinctUntilChanged(),
  );

  private readonly breadcrumbs$ = this.events$.pipe(
    map(() => this.buildBreadCrumb(this.activatedRoute.root)),
    // map((breadcrumbs) => [HOME, ...breadcrumbs]),
  );

  public readonly breadcrumbs = toSignal(this.breadcrumbs$, {
    initialValue: [],
  });

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  private buildBreadCrumb(
    route: ActivatedRoute,
    url = "",
    breadcrumbs: MenuItem[] = [],
  ): MenuItem[] {
    //If no routeConfig is avalailable we are on the root path
    const configData = route.routeConfig?.data;
    let label = configData?.breadcrumb ? configData.breadcrumb : "";
    const icon = configData?.icon ? configData.icon : "";

    let path = configData?.path ? configData.path : "";

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split("/").pop();
    const isDynamicRoute = lastRoutePart.startsWith(":");
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(":")[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: MenuItem = {
      label: label,
      routerLink: nextUrl,
      icon: icon,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];

    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }
}
