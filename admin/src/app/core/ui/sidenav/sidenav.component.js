import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, computed, inject, viewChild, ViewEncapsulation, } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { SidenavService } from "@core/ui/sidenav/sidenav.service";
import { PanelModule } from "primeng/panel";
import { PanelMenu, PanelMenuModule } from "primeng/panelmenu";
import { filter, map, startWith } from "rxjs";
let SidenavComponent = class SidenavComponent {
    constructor() {
        this.aclService = inject(AclService);
        this.sidenavService = inject(SidenavService);
        this.router = inject(Router);
        this.panelMenu = viewChild("panelMenu", { read: PanelMenu });
        this.baseSideNavItems = this.sidenavService.baseSideNavItems;
        this.activeUrl = toSignal(this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map((e) => e.url), startWith(this.router.url), map((url) => url.split("?")[0])));
        this.sideNavItems = computed(() => {
            const activeUrl = this.activeUrl();
            const alertKeys = this.sidenavService.alertKeys();
            const isExpanded = this.sidenavService.isExpanded();
            const items = activeUrl
                ? this.getSidenavItems(activeUrl, alertKeys)
                : this.baseSideNavItems;
            if (isExpanded)
                return items;
            return this.forceAllExpanded(items);
        });
    }
    getSidenavItems(activeUrl, alertKeys) {
        return this.baseSideNavItems.map((item) => this.recursivelyGetExpandedAndVisible(item, activeUrl, alertKeys));
    }
    forceAllExpanded(items) {
        return items.map((item) => ({
            ...item,
            expanded: true,
            items: item.items ? this.forceAllExpanded(item.items) : item.items,
        }));
    }
    recursivelyGetExpandedAndVisible(item, activeUrl, alertKeys) {
        const children = item.items?.map((child) => this.recursivelyGetExpandedAndVisible(child, activeUrl, alertKeys));
        const areAllChildrenHidden = children?.every((child) => !child.visible);
        const hasActiveDescendant = children?.some((child) => child.expanded) ?? false;
        const isActive = item.routerLink === activeUrl || hasActiveDescendant;
        return {
            ...item,
            ...this.getExpandedAndVisible(item, isActive, alertKeys, areAllChildrenHidden),
            items: children,
        };
    }
    getExpandedAndVisible(item, isActive, alertKeys, forceHidden = false) {
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
    hasAccess(functionality) {
        return this.aclService.hasAccess(functionality, "get");
    }
};
SidenavComponent = __decorate([
    Component({
        selector: "adm-sidenav",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./sidenav.component.html",
        styleUrls: ["./sidenav.component.scss"],
        encapsulation: ViewEncapsulation.None,
        imports: [PanelModule, RouterLink, PanelMenuModule],
        host: { class: "sidenav" },
    })
], SidenavComponent);
export { SidenavComponent };
//# sourceMappingURL=sidenav.component.js.map