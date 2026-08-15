import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { SchemaService } from "./schema.service";

describe("SchemaService", () => {
  let service: SchemaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SchemaService,
        {
          provide: APP_CONFIG,
          useValue: { apiGateway: "/api/" },
        },
      ],
    });

    service = TestBed.inject(SchemaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it("loads schema rows for an entity", () => {
    let rows: unknown;
    service.get("routes").subscribe((value) => {
      rows = value;
    });

    const req = http.expectOne("/api/routes/schema");
    expect(req.request.method).toBe("GET");
    req.flush({
      rows: [{ key: "name", operations: ["INSERT"] }],
    });

    expect(rows).toEqual([{ key: "name", operations: ["INSERT"] }]);
  });

  it("returns an empty array when rows are missing", () => {
    let rows: unknown;
    service.get("routes").subscribe((value) => {
      rows = value;
    });

    http.expectOne("/api/routes/schema").flush({});
    expect(rows).toEqual([]);
  });
});
