import { ApplicationRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { ThemeService } from "./theme.service";

describe("ThemeService", () => {
  const themeKey = "theme";

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  function createService(stored?: string) {
    if (stored) localStorage.setItem(themeKey, stored);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: APP_CONFIG,
          useValue: { storageKeys: { THEME: themeKey } },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    TestBed.inject(ApplicationRef).tick();
    return service;
  }

  it("defaults to light and applies it to the document", () => {
    const service = createService();

    expect(service.theme()).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem(themeKey)).toBe("light");
  });

  it("restores a stored dark theme", () => {
    const service = createService("dark");

    expect(service.theme()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles between light and dark", () => {
    const service = createService("light");

    service.toggleTheme();
    TestBed.inject(ApplicationRef).tick();
    expect(service.theme()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    service.toggleTheme();
    TestBed.inject(ApplicationRef).tick();
    expect(service.theme()).toBe("light");
  });

  it("falls back to light for invalid stored values", () => {
    const service = createService("neon");
    expect(service.theme()).toBe("light");
  });
});
