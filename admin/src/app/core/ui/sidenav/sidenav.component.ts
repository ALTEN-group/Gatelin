import {
  Component,
  computed,
  inject,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { MenuItem } from "primeng/api";
import { PanelModule } from "primeng/panel";
import { PanelMenu, PanelMenuModule } from "primeng/panelmenu";

@Component({
  selector: "adm-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [PanelModule, RouterLink, PanelMenuModule],
  host: { class: "sidenav" },
})
export class SidenavComponent {
  private readonly aclService = inject(AclService);
  public readonly sidenavService = inject(SidenavService);

  public readonly panelMenu = viewChild("panelMenu", { read: PanelMenu });
  private readonly baseSideNavItems = this.sidenavService.baseSideNavItems;

  public readonly sideNavItems = computed<MenuItem[]>(() => {
    const activeUrl = this.sidenavService.activeUrl();
    const alertKeys = this.sidenavService.alertKeys();
    if (!activeUrl) return this.baseSideNavItems;
    const url = this.parseUrl(activeUrl);
    return this.getSidenavItems(url, alertKeys);
  });

  private parseUrl(url: string): string[] {
    const urlWithoutRootSlash = url.replace("/", "");
    if (!urlWithoutRootSlash) return [];
    return urlWithoutRootSlash.split("/");
  }

  private getSidenavItems(url: string[], alertKeys: Set<string>): MenuItem[] {
    return this.baseSideNavItems.map((item) =>
      this.recursivelyGetExpandedAndVisible(item, url, alertKeys),
    );
  }

  private recursivelyGetExpandedAndVisible(
    item: MenuItem,
    url: string[],
    alertKeys: Set<string>,
    index = 0,
  ): MenuItem {
    const children = item.items?.map((child) =>
      this.recursivelyGetExpandedAndVisible(child, url, alertKeys, index + 1),
    );
    const areAllChildrenHidden = children?.every((child) => !child.visible);
    return {
      ...item,
      ...this.getExpandedAndVisible(
        item,
        url[index],
        alertKeys,
        areAllChildrenHidden,
      ),
      items: children,
    };
  }

  private getExpandedAndVisible(
    item: MenuItem,
    path: string,
    alertKeys: Set<string>,
    forceHidden = false,
  ): Pick<MenuItem, "expanded" | "visible" | "icon"> {
    const expanded = item.id === path;
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

  private hasAccess(functionality: string | undefined) {
    return this.aclService.hasAccess(functionality, "get");
  }
}
