import { TestBed } from "@angular/core/testing";
import { NavigationEnd } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { of } from "rxjs";
import { SidenavService } from "./sidenav.service";

describe("SidenavService", () => {
  let service: SidenavService;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1280,
    });

    TestBed.configureTestingModule({
      providers: [
        SidenavService,
        {
          provide: APP_CONFIG,
          useValue: {
            sidenavItems: [{ label: "Home", routerLink: "/" }],
            storageKeys: {},
          },
        },
      ],
    });

    service = TestBed.inject(SidenavService);
  });

  it("exposes configured sidenav items", () => {
    expect(service.baseSideNavItems).toEqual([
      { label: "Home", routerLink: "/" },
    ]);
  });

  it("toggles expanded and pinned state", () => {
    expect(service.isExpanded()).toBe(true);

    service.toggleExpanded();
    expect(service.getExpanded()).toBe(true); // still pinned
    service.togglePinned();
    expect(service.isExpanded()).toBe(false);

    service.setExpanded(true);
    expect(service.getExpanded()).toBe(true);
  });

  it("tracks alert keys", () => {
    service.addAlertKey("routes");
    expect(service.alertKeys().has("routes")).toBe(true);

    service.removeAlertKey("routes");
    expect(service.alertKeys().has("routes")).toBe(false);
  });

  it("sets the active url from navigation events", () => {
    of(new NavigationEnd(1, "/consumers", "/consumers"))
      .pipe(service.setActiveUrl())
      .subscribe();

    expect(service.activeUrl()).toBe("/consumers");
  });

  it("collapses on mobile widths", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event("resize"));

    // debounceTime(150) — advance timers
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(service.getMobileDisplay()).toBe(true);
        expect(service.getPinned()).toBe(false);
        expect(service.getExpanded()).toBe(false);
        resolve();
      }, 200);
    });
  });
});
