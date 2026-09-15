/**
 * @jest-environment node
 */

import ccEnt from "../../src/entities/consumer-cache.js";
import cEnt from "../../src/entities/consumer.js";

describe("consumer entities", () => {
  it("should never select live tokens on the searchable entity", () => {
    // Super admin and Admin have no field ACL on getConsumers, so anything the
    // SELECT returns reaches the client. Keeping the tokens out of the column
    // list is what stops a search from handing over hijackable sessions.
    const { query } = cEnt.query.select(0, 10, "id", "ASC", null);

    expect(query).not.toContain("accessToken");
    expect(query).not.toContain("refreshToken");
    expect(cEnt.properties.map((p) => p.key)).not.toContain("accessToken");
    expect(cEnt.properties.map((p) => p.key)).not.toContain("refreshToken");
  });

  it("should select live tokens on the cache entity so sessions can be indexed", () => {
    const { query } = ccEnt.query.select(0, null, "id", "ASC", null);

    expect(query).toContain("accessToken");
    expect(query).toContain("refreshToken");
  });

  it("should keep archived filterable on the cache entity, as getCache requires", () => {
    const archived = ccEnt.properties.find((p) => p.key === "archived");

    expect(archived?.isFilterable).toBe(true);
  });
});
