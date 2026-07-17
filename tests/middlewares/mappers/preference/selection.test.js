/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

const execute = jest.fn();
jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

describe("upsertSelection", () => {
  let upsertSelection;

  beforeAll(async () => {
    const module = await import(
      "../../../../src/middlewares/mappers/preference/selection.js"
    );
    upsertSelection = module.upsertSelection;
  });

  beforeEach(() => {
    execute.mockReset();
    execute.mockResolvedValue({ rows: [] });
  });

  it("should upsert with templateId set and preferenceId null", async () => {
    await upsertSelection(11, "dashboard", 7, null);

    expect(execute).toHaveBeenCalledTimes(1);
    const [query, args, client] = execute.mock.calls[0];
    expect(args).toEqual([11, "dashboard", 7, null]);
    expect(client).toBeNull();
    expect(query).toEqual(expect.stringContaining("preference_selection"));
    expect(query).toEqual(expect.stringContaining("ON CONFLICT"));
  });

  it("should upsert with preferenceId set and templateId null", async () => {
    await upsertSelection(11, "dashboard", null, 99);

    const [, args] = execute.mock.calls[0];
    expect(args).toEqual([11, "dashboard", null, 99]);
  });

  it("should propagate errors from execute", async () => {
    const err = new Error("db error");
    execute.mockRejectedValue(err);

    await expect(upsertSelection(11, "dashboard", 7, null)).rejects.toThrow(
      err,
    );
  });
});
