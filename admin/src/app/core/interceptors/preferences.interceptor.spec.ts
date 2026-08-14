import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { preferencesInterceptor } from "./preferences.interceptor";

describe("preferencesInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([preferencesInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("activates the Default preference when none is active", () => {
    let body: { rows: { name: string; isActive?: boolean }[] } | undefined;
    http.get("/api/preferences/table").subscribe((res) => {
      body = res as typeof body;
    });

    httpMock.expectOne("/api/preferences/table").flush({
      rows: [
        { name: "Compact", isActive: false },
        { name: "Default", isActive: false },
      ],
    });

    expect(body?.rows.find((row) => row.name === "Default")?.isActive).toBe(
      true,
    );
  });

  it("leaves preferences unchanged when one is already active", () => {
    let body: { rows: { name: string; isActive?: boolean }[] } | undefined;
    http.get("/api/preferences/table").subscribe((res) => {
      body = res as typeof body;
    });

    httpMock.expectOne("/api/preferences/table").flush({
      rows: [
        { name: "Compact", isActive: true },
        { name: "Default", isActive: false },
      ],
    });

    expect(body?.rows.find((row) => row.name === "Default")?.isActive).toBe(
      false,
    );
  });

  it("ignores non-preferences GET responses", () => {
    let body: { rows: { name: string }[] } | undefined;
    http.get("/api/roles").subscribe((res) => {
      body = res as typeof body;
    });

    httpMock.expectOne("/api/roles").flush({
      rows: [{ name: "Default" }],
    });

    expect(body?.rows[0]).toEqual({ name: "Default" });
  });
});
