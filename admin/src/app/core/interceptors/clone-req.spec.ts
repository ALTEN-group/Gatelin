import { HttpRequest } from "@angular/common/http";
import { cloneReq } from "./clone-req";

describe("cloneReq", () => {
  it("adds a Bearer Authorization header", () => {
    const req = new HttpRequest("GET", "/api/consumers");
    const cloned = cloneReq(req, "token-123");

    expect(cloned.headers.get("Authorization")).toBe("Bearer token-123");
    expect(req.headers.has("Authorization")).toBe(false);
  });
});
