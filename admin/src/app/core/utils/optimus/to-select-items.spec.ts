import { toNamesSelectOptions, toSelectItems } from "./to-select-items";

describe("toSelectItems", () => {
  it("returns an empty list for nullish input", () => {
    expect(toSelectItems(null as unknown as [], "name")).toEqual([]);
  });

  it("maps entities to sorted select items", () => {
    const items = [
      { id: 2, name: "Bravo", color: "blue" },
      { id: 1, name: "Alpha", color: "red" },
    ];

    expect(toSelectItems(items, "name")).toEqual([
      { value: 1, label: "Alpha", color: "red", extraData: undefined },
      { value: 2, label: "Bravo", color: "blue", extraData: undefined },
    ]);
  });

  it("includes extraData when extraKeys are provided", () => {
    const items = [{ id: 1, name: "Alpha", code: "A" }];

    expect(toSelectItems(items, "name", ["code"])).toEqual([
      {
        value: 1,
        label: "Alpha",
        color: null,
        extraData: { code: "A" },
      },
    ]);
  });
});

describe("toNamesSelectOptions", () => {
  it("maps and sorts by name", () => {
    expect(
      toNamesSelectOptions([{ name: "Bravo" }, { name: "Alpha" }]),
    ).toEqual([
      { label: "Alpha", value: "Alpha" },
      { label: "Bravo", value: "Bravo" },
    ]);
  });
});
