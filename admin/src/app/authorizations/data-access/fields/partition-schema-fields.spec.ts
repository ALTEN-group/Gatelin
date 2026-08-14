import { partitionSchemaFields } from "./partition-schema-fields";

describe("partitionSchemaFields", () => {
  it("partitions schema fields into create and update lists", () => {
    expect(
      partitionSchemaFields([
        { key: "name", operations: ["INSERT", "UPDATE"] },
        { key: "secret", operations: ["INSERT"] },
        { key: "path", operations: ["UPDATE"] },
        { key: "id", operations: ["SELECT"] },
      ]),
    ).toEqual({
      create: ["name", "secret"],
      update: ["name", "path"],
    });
  });

  it("returns empty lists for an empty schema", () => {
    expect(partitionSchemaFields([])).toEqual({ create: [], update: [] });
  });
});
