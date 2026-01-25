import { supplant } from "./supplant.utils";
describe("Supplant", () => {
  it("should replace a single interpolation when given a valid object map", () => {
    const str = "I'm {age} years old!";
    const obj = { age: 33 };
    const result = supplant(str, obj);
    expect(result).toBe("I'm 33 years old!");
  });

  it("should replace multiple interpolations when given a valid object map", () => {
    const str = "The {a} says {n}, {n}, {n}!";
    const obj = { a: "cow", n: "moo" };
    const result = supplant(str, obj);
    expect(result).toBe("The cow says moo, moo, moo!");
  });

  it("should replace interpolations with numeric values when given a valid object map", () => {
    const str = "The answer is {number}.";
    const obj = { number: 42 };
    const result = supplant(str, obj);
    expect(result).toBe("The answer is 42.");
  });

  it("should replace interpolations with values containing curly braces when given a valid object map", () => {
    const str = "The value is {value}.";
    const obj = { value: "{example}" };
    const result = supplant(str, obj);
    expect(result).toBe("The value is {example}.");
  });

  it("should replace interpolations with values containing square brackets when given a valid object map", () => {
    const str = "The value is {value}.";
    const obj = { value: "[example]" };
    const result = supplant(str, obj);
    expect(result).toBe("The value is [example].");
  });

  it("should replace interpolations with values containing backslashes when given a valid object map", () => {
    const str = "The value is {value}.";
    const obj = { value: "\\example\\" };
    const result = supplant(str, obj);
    expect(result).toBe("The value is \\example\\.");
  });
});
