/**
 * @jest-environment node
 */

import { stripTrailingSlash } from "../../src/utils/url.js";

describe("stripTrailingSlash", () => {
	it("should remove a single trailing slash", () => {
		expect(stripTrailingSlash("/api/users/")).toBe("/api/users");
	});

	it("should leave a URL without a trailing slash unchanged", () => {
		expect(stripTrailingSlash("/api/users")).toBe("/api/users");
	});

	it("should only remove the last trailing slash", () => {
		expect(stripTrailingSlash("/api/users//")).toBe("/api/users/");
	});

	it("should not touch slashes in the middle of the path", () => {
		expect(stripTrailingSlash("/api/users/123")).toBe("/api/users/123");
	});

	it("should return an empty string unchanged", () => {
		expect(stripTrailingSlash("")).toBe("");
	});

	it("should reduce a lone slash to an empty string", () => {
		expect(stripTrailingSlash("/")).toBe("");
	});
});
