import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "file-saver": path.resolve(__dirname, "src/testing/file-saver.stub.ts"),
    },
  },
});
