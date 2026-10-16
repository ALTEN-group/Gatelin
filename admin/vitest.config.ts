import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "file-saver": path.resolve(__dirname, "src/testing/file-saver.stub.ts"),
    },
  },
  test: {
    // force Vite to transform this package (applying the file-saver alias)
    // instead of letting Node's native ESM loader resolve its CJS import.
    server: {
      deps: {
        inline: ["@dwtechs/ngx-crud-builder"],
      },
    },
  },
});
