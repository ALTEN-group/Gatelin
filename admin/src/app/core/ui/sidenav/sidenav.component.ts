import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { AdminEntity } from "@core/app-config/app.entities";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { MenuItem } from "primeng/api";
import { PanelModule } from "primeng/panel";
import { PanelMenu, PanelMenuModule } from "primeng/panelmenu";
import { filter, map, startWith } from "rxjs";

@Component({
  selector: "adm-sidenav",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [PanelModule, RouterLink, PanelMenuModule],
  host: { class: "sidenav" },
})
export class SidenavComponent {
  private readonly aclService = inject(AclService);
  public readonly sidenavService = inject(SidenavService);
  private readonly router = inject(Router);

  public readonly panelMenu = viewChild("panelMenu", { read: PanelMenu });
  private readonly baseSideNavItems = this.sidenavService.baseSideNavItems;

  private readonly activeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.url),
      startWith(this.router.url),
      map((url) => url.split("?")[0]),
    ),
  );

  public readonly sideNavItems = computed<MenuItem[]>(() => {
    const activeUrl = this.activeUrl();
    const alertKeys = this.sidenavService.alertKeys();
    const items = activeUrl
      ? this.getSidenavItems(activeUrl, alertKeys)
      : this.baseSideNavItems;
    return items;
  });

  private getSidenavItems(
    activeUrl: string,
    alertKeys: Set<string>,
  ): MenuItem[] {
    return this.baseSideNavItems.map((item) =>
      this.recursivelyGetExpandedAndVisible(item, activeUrl, alertKeys),
    );
  }

  private recursivelyGetExpandedAndVisible(
    item: MenuItem,
    activeUrl: string,
    alertKeys: Set<string>,
  ): MenuItem {
    const children = item.items?.map((child) =>
      this.recursivelyGetExpandedAndVisible(child, activeUrl, alertKeys),
    );
    const areAllChildrenHidden = children?.every((child) => !child.visible);
    const hasActiveDescendant =
      children?.some((child) => child.expanded) ?? false;
    const isActive = item.routerLink === activeUrl || hasActiveDescendant;
    return {
      ...item,
      ...this.getExpandedAndVisible(
        item,
        isActive,
        alertKeys,
        areAllChildrenHidden,
      ),
      items: children,
    };
  }

  private getExpandedAndVisible(
    item: MenuItem,
    isActive: boolean,
    alertKeys: Set<string>,
    forceHidden = false,
  ): Pick<MenuItem, "expanded" | "visible" | "icon"> {
    const expanded = isActive;
    const visible = forceHidden
      ? false
      : this.hasAccess(item.data?.functionality) && item.visible !== false;
    const hasAlert = item.id ? alertKeys.has(item.id) : false;
    return {
      expanded,
      visible,
      icon: hasAlert ? "pi pi-exclamation-triangle text-red-500" : item.icon,
    };
  }

  private hasAccess(functionality: AdminEntity | undefined) {
    return this.aclService.hasAccess(functionality, "get");
  }
}
