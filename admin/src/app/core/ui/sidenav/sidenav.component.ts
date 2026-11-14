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
import { MenuItem } from "@openng/optimus-ui/api";
import { PanelModule } from "@openng/optimus-ui/panel";
import { PanelMenu, PanelMenuModule } from "@openng/optimus-ui/panelmenu";
import { isSet } from "@dwtechs/checkard";
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

  // Last model handed to the panel menu. The panel menu mutates `expanded` on
  // these objects when the user toggles a group, so reading it back lets us keep
  // manually opened groups open when the model is rebuilt on navigation.
  private previousItems: MenuItem[] | undefined;

  public readonly sideNavItems = computed<MenuItem[]>(() => {
    const activeUrl = this.activeUrl();
    const alertKeys = this.sidenavService.alertKeys();
    const items = activeUrl
      ? this.getSidenavItems(activeUrl, alertKeys, this.previousItems)
      : this.baseSideNavItems;
    this.previousItems = items;
    return items;
  });

  private getSidenavItems(
    activeUrl: string,
    alertKeys: Set<string>,
    previousItems: MenuItem[] | undefined,
  ): MenuItem[] {
    return this.baseSideNavItems.map((item, i) =>
      this.recursivelyGetExpandedAndVisible(
        item,
        activeUrl,
        alertKeys,
        previousItems?.[i],
      ),
    );
  }

  private recursivelyGetExpandedAndVisible(
    item: MenuItem,
    activeUrl: string,
    alertKeys: Set<string>,
    previous?: MenuItem,
  ): MenuItem {
    const children = item.items?.map((child, i) =>
      this.recursivelyGetExpandedAndVisible(
        child,
        activeUrl,
        alertKeys,
        previous?.items?.[i],
      ),
    );
    const areAllChildrenHidden = children?.every((child) => !child.visible);
    const hasActiveDescendant =
      children?.some((child) => child.expanded) ?? false;
    const isActive = item.routerLink === activeUrl || hasActiveDescendant;
    const keepOpen = isActive || (!!children?.length && !!previous?.expanded);
    return {
      ...item,
      ...this.getExpandedAndVisible(
        item,
        keepOpen,
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
    const hasAlert =
      item.id && isSet(alertKeys, ">", 0) ? alertKeys.has(item.id) : false;
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
