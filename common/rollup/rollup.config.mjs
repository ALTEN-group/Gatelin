import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "../app/src/app.js",
  output: {
    file: "../app/dist/app.js",
    format: "cjs",
  },
  external: ['express'], // Exclude Express from the bundle as it will be required at runtime
  plugins: [
    nodeResolve({
      skipSelf: true,
      custom: {
        "node-resolve": { isRequire: true },
      },
    }),
    commonjs(),
    json(),
    terser({
      maxWorkers: 4,
      compress: { defaults: true, drop_console: true, passes: 2 },
      mangle: true,
    }),
  ],
};
