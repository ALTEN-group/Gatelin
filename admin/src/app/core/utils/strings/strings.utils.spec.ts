import { interpolate } from "./strings.utils";

describe("interpolate", () => {
  it("replaces a single placeholder", () => {
    expect(interpolate("Hello {name}", { name: "Ada" })).toBe("Hello Ada");
  });

  it("replaces multiple placeholders", () => {
    expect(
      interpolate("{count} items in {bucket}", { count: 3, bucket: "cart" }),
    ).toBe("3 items in cart");
  });

  it("replaces missing keys with an empty string", () => {
    expect(interpolate("Hello {name}", {})).toBe("Hello ");
  });
});
