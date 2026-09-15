import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(scriptDirectory, "../../admin/src/assets/shader");
const targetDirectory = resolve(scriptDirectory, "../docs/public/shader");
const shaders = ["frog-face_vert-ready.glsl", "frog-face_frag-ready.glsl"];

mkdirSync(targetDirectory, { recursive: true });

for (const shader of shaders) {
  cpSync(resolve(sourceDirectory, shader), resolve(targetDirectory, shader));
}

console.log(`Copied ${shaders.length} shader(s) from admin assets.`);