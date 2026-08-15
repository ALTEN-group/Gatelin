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
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { LocationInterceptorService } from "./location-interceptor.service";
import { locationInterceptor } from "./location.interceptor";

describe("locationInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let locationService: LocationInterceptorService;
  let snackbar: { displayError: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackbar = { displayError: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([locationInterceptor])),
        provideHttpClientTesting(),
        LocationInterceptorService,
        { provide: SnackbarService, useValue: snackbar },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    locationService = TestBed.inject(LocationInterceptorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("does nothing when not waiting for a location header", () => {
    http.get("/api/export").subscribe();
    httpMock
      .expectOne("/api/export")
      .flush({}, { headers: { location: "/file.xlsx" } });

    expect(locationService.consumeLocation()).toBeUndefined();
    expect(snackbar.displayError).not.toHaveBeenCalled();
  });

  it("stores the location header when waiting", () => {
    locationService.enableLocationHeaderWaiting();

    http.get("/api/export").subscribe();
    httpMock
      .expectOne("/api/export")
      .flush({}, { headers: { location: "/file.xlsx" } });

    expect(locationService.consumeLocation()).toBe("/file.xlsx");
  });

  it("shows an error when the location header is missing", () => {
    locationService.enableLocationHeaderWaiting();

    http.get("/api/export").subscribe();
    httpMock.expectOne("/api/export").flush({});

    expect(snackbar.displayError).toHaveBeenCalledWith(
      "Export excel non disponible",
    );
  });
});
