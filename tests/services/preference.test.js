/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

describe("getMany (getMergedRows)", () => {
  let getMany;

  beforeAll(async () => {
    const module = await import("../../src/services/preference.js");
    getMany = module.getMany;
  });

  beforeEach(() => {
    execute.mockReset();
  });

  it("should query the preferences view joined against preference_selection with (userId, resource) and return the rows as-is", async () => {
    const rows = [
      {
        id: 1,
        resource: "dashboard",
        name: "Default",
        conf: {},
        locked: true,
        isActive: true,
      },
      {
        id: 5,
        resource: "dashboard",
        name: "Custom",
        conf: {},
        locked: false,
        isActive: false,
      },
    ];
    execute.mockResolvedValue({ rows });

    const result = await getMany(11, "dashboard");

    expect(execute).toHaveBeenCalledTimes(1);
    const [query, args, client] = execute.mock.calls[0];
    expect(args).toEqual([11, "dashboard"]);
    expect(client).toBeNull();
    expect(query).toEqual(expect.stringContaining("FROM preferences"));
    expect(query).toEqual(expect.stringContaining("preference_selection"));
    expect(result).toBe(rows);
  });

  it("should propagate errors from the query", async () => {
    const err = new Error("db error");
    execute.mockRejectedValue(err);

    await expect(getMany(11, "dashboard")).rejects.toThrow(err);
  });
});
