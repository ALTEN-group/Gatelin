import { TestBed } from "@angular/core/testing";
import { LocationInterceptorService } from "./location-interceptor.service";

describe("LocationInterceptorService", () => {
  let service: LocationInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationInterceptorService);
  });

  it("tracks waiting state and stores a location", () => {
    expect(service.waitingForLocationHeader()).toBe(false);

    service.enableLocationHeaderWaiting();
    expect(service.waitingForLocationHeader()).toBe(true);

    service.setLocation("/exports/file.xlsx");
    expect(service.waitingForLocationHeader()).toBe(false);
    expect(service.consumeLocation()).toBe("/exports/file.xlsx");
    expect(service.consumeLocation()).toBeUndefined();
  });

  it("clears waiting when consuming without a stored location", () => {
    service.enableLocationHeaderWaiting();
    expect(service.consumeLocation()).toBeUndefined();
    expect(service.waitingForLocationHeader()).toBe(false);
  });
});
