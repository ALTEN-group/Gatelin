import { TestBed } from "@angular/core/testing";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LocalStorageService } from "@core/utils/local-storage/local-storage.service";
import { TokenService } from "./token.service";

describe("TokenService", () => {
  let service: TokenService;
  let storage: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: LocalStorageService, useValue: storage },
        {
          provide: APP_CONFIG,
          useValue: { storageKeys: { TOKEN: "access_token" } },
        },
      ],
    });

    service = TestBed.inject(TokenService);
  });

  it("saves the access token under the configured key", () => {
    service.saveAccessToken("abc");
    expect(storage.setItem).toHaveBeenCalledWith("access_token", "abc");
  });

  it("reads the access token from the configured key", () => {
    storage.getItem.mockReturnValue("abc");
    expect(service.getAccessToken()).toBe("abc");
    expect(storage.getItem).toHaveBeenCalledWith("access_token");
  });

  it("deletes the access token from the configured key", () => {
    service.deleteAccessToken();
    expect(storage.removeItem).toHaveBeenCalledWith("access_token");
  });
});
