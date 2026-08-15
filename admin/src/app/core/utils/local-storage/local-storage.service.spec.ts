import { TestBed } from "@angular/core/testing";
import { LocalStorageService } from "./local-storage.service";

describe("LocalStorageService", () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it("stores, reads and removes items", () => {
    service.setItem("k", "v");
    expect(service.getItem("k")).toBe("v");
    service.removeItem("k");
    expect(service.getItem("k")).toBeNull();
  });
});
