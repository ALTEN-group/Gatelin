/** @jest-environment node */
// @ts-check
import { jest } from "@jest/globals";

const execute = jest.fn();

jest.unstable_mockModule("@dwtechs/antity-pgsql", () => ({ execute }));

const { assertRowsOwnedOrTemplate } = await import(
  "../../../../src/middlewares/mappers/preference/assertRowsOwnedOrTemplate.js"
);

const run = async (rows, userId = 3, resource = "passwords") => {
  const req = { body: { rows }, params: { resource } };
  const res = { locals: { consumer: { userId } } };
  const next = jest.fn();
  await assertRowsOwnedOrTemplate(
    /** @type {any} */ (req),
    /** @type {any} */ (res),
    next,
  );
  return next;
};

describe("assertRowsOwnedOrTemplate", () => {
  beforeEach(() => execute.mockReset());

  it("rejects an empty or missing rows array with 400", async () => {
    const next = await run([]);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    expect(execute).not.toHaveBeenCalled();
  });

  it("rejects a row without a valid integer id with 400", async () => {
    const next = await run([{ id: 1 }, { id: "x" }]);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    expect(execute).not.toHaveBeenCalled();
  });

  it("accepts a batch of templates and personal rows (the grid re-sends every view)", async () => {
    execute.mockResolvedValue({ rows: [{ id: 3 }, { id: 4 }, { id: 2 }, { id: 1 }] });
    const next = await run([{ id: 3 }, { id: 4 }, { id: 2 }, { id: 1, isActive: true }]);
    expect(next).toHaveBeenCalledWith();
  });

  it("scopes the lookup to the resource and to the caller's own rows or templates", async () => {
    execute.mockResolvedValue({ rows: [{ id: 1 }] });
    await run([{ id: 1 }], 7, "policies");
    const [sql, args] = execute.mock.calls[0];
    expect(sql).toContain('"resourceName" = $2');
    expect(sql).toContain('"userId" = $3 OR "userId" IS NULL');
    expect(args).toEqual([[1], "policies", 7]);
  });

  it("rejects the whole batch with 403 when any row is not visible to the caller", async () => {
    execute.mockResolvedValue({ rows: [{ id: 1 }] });
    const next = await run([{ id: 1 }, { id: 99 }]);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it("does not 403 a batch that repeats the same id", async () => {
    execute.mockResolvedValue({ rows: [{ id: 1 }] });
    const next = await run([{ id: 1 }, { id: 1 }]);
    expect(next).toHaveBeenCalledWith();
  });

  it("forwards database errors", async () => {
    const err = new Error("db down");
    execute.mockRejectedValue(err);
    const next = await run([{ id: 1 }]);
    expect(next).toHaveBeenCalledWith(err);
  });
});
