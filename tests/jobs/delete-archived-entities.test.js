/**
 * @jest-environment node
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schedulerPath = path.join(__dirname, "../../src/jobs/scheduler.js");

const scheduleDailyAt = jest.fn();
jest.unstable_mockModule(schedulerPath, () => ({ scheduleDailyAt }));

const log = { info: jest.fn(), error: jest.fn() };
jest.unstable_mockModule("@dwtechs/winstan", () => ({ log }));

// One deleteArchived mock per entity, keyed by its services/*.js filename.
const SERVICE_FILES = [
  "consumer",
  "service",
  "cors",
  "operation",
  "resource",
  "route",
  "role",
  "application",
  "scope",
  "condition",
  "field",
];
const deleteArchivedMocks = {};
for (const name of SERVICE_FILES) {
  const deleteArchived = jest.fn();
  deleteArchivedMocks[name] = deleteArchived;
  jest.unstable_mockModule(
    path.join(__dirname, `../../src/services/${name}.js`),
    () => ({ __esModule: true, default: { deleteArchived } }),
  );
}

describe("startDeleteArchivedEntitiesJob", () => {
  let startDeleteArchivedEntitiesJob;

  beforeAll(async () => {
    const module = await import("../../src/jobs/delete-archived-entities.js");
    startDeleteArchivedEntitiesJob = module.startDeleteArchivedEntitiesJob;
  });

  beforeEach(() => {
    scheduleDailyAt.mockReset();
    log.info.mockReset();
    log.error.mockReset();
    for (const mock of Object.values(deleteArchivedMocks)) mock.mockReset();
  });

  it("should register the job to run daily at 2 AM UTC", () => {
    startDeleteArchivedEntitiesJob();

    expect(scheduleDailyAt).toHaveBeenCalledWith(
      2,
      expect.any(Function),
      "delete-archived-entities",
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("initialized"),
    );
  });

  it("should call deleteArchived on every entity with a date ~2 months in the past", async () => {
    for (const mock of Object.values(deleteArchivedMocks))
      mock.mockResolvedValue(0);
    startDeleteArchivedEntitiesJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await callback();

    for (const mock of Object.values(deleteArchivedMocks)) {
      expect(mock).toHaveBeenCalledTimes(1);
      const [date] = mock.mock.calls[0];
      const daysAgo = (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000);
      expect(daysAgo).toBeGreaterThan(55);
      expect(daysAgo).toBeLessThan(65);
    }
  });

  it("should purge conditions before fields (fieldId ON DELETE RESTRICT)", async () => {
    const order = [];
    for (const [name, mock] of Object.entries(deleteArchivedMocks)) {
      mock.mockImplementation(async () => {
        order.push(name);
        return 0;
      });
    }
    startDeleteArchivedEntitiesJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await callback();

    expect(order.indexOf("condition")).toBeLessThan(order.indexOf("field"));
    expect(order.indexOf("condition")).toBeLessThan(order.indexOf("resource"));
  });

  it("should sum counts across entities and log the total", async () => {
    for (const mock of Object.values(deleteArchivedMocks))
      mock.mockResolvedValue(0);
    deleteArchivedMocks.consumer.mockResolvedValue(3);
    deleteArchivedMocks.route.mockResolvedValue(2);
    startDeleteArchivedEntitiesJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await callback();

    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("Total deleted: 5"),
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("Deleted 3 archived consumers"),
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("No archived services to delete"),
    );
  });

  it("should log an error for a failing entity but still process the others", async () => {
    for (const mock of Object.values(deleteArchivedMocks))
      mock.mockResolvedValue(0);
    deleteArchivedMocks.role.mockRejectedValue(new Error("db down"));
    deleteArchivedMocks.scope.mockResolvedValue(1);
    startDeleteArchivedEntitiesJob();
    const callback = scheduleDailyAt.mock.calls[0][1];

    await expect(callback()).resolves.toBeUndefined();

    expect(log.error).toHaveBeenCalledWith(expect.stringContaining("db down"));
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("Deleted 1 archived scopes"),
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("Total deleted: 1"),
    );
  });
});
