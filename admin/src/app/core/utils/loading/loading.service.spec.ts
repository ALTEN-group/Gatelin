import { TestBed } from "@angular/core/testing";
import { LoadingService } from "./loading.service";

describe("LoadingService", () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it("starts in a non-loading bar mode", () => {
    expect(service.isLoading()).toBe(false);
    expect(service.mode()).toBe("bar");
  });

  it("starts loading with the requested mode", () => {
    service.start("spin");
    expect(service.isLoading()).toBe(true);
    expect(service.mode()).toBe("spin");
  });

  it("stops loading without resetting the mode", () => {
    service.start("spin");
    service.stop();
    expect(service.isLoading()).toBe(false);
    expect(service.mode()).toBe("spin");
  });
});
