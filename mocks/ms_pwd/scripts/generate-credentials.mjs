// Generates mock passwords: plaintext for swagger docs, @dwtechs/hashitaka hash for credentials.js
// Usage: node generate-credentials.mjs <credentials.js path> <openapi.json path>
import { readFileSync, writeFileSync } from "node:fs";
import { randomPwd } from "@dwtechs/passken";
import { encrypt } from "@dwtechs/hashitaka";

const secret = process.env.MSPWD_SECRET;
if (!secret)
  throw new Error("Missing MSPWD_SECRET environment variable");

const [credentialsPath, openapiPath] = process.argv.slice(2);
if (!credentialsPath || !openapiPath)
  throw new Error("Usage: node generate-credentials.mjs <credentials.js path> <openapi.json path>");

const keys = [
  "GATELIN_ADMIN",
  "GATELIN_USER",
  "GATELIN_SUPER_ADMIN",
  "GATELIN_GUEST",
  "EBOUTIQUE_USER",
  "EBOUTIQUE_SUPER_ADMIN",
  "EBOUTIQUE_ADMIN",
];

let credentials = readFileSync(credentialsPath, "utf8");
let openapi = readFileSync(openapiPath, "utf8");
const plaintext = {};

for (const key of keys) {
  const pwd = randomPwd({ len: 16, num: true, ucase: true, lcase: true, sym: true, strict: true });
  const pwdHash = await encrypt(pwd, secret);
  credentials = credentials.replaceAll(`__PWD_${key}__`, pwdHash);
  openapi = openapi.replaceAll(`__PWD_${key}__`, pwd);
  plaintext[key] = pwd;
}

writeFileSync(credentialsPath, credentials);
writeFileSync(openapiPath, openapi);

console.log(`${credentialsPath} created.`);
console.log(`${openapiPath} created.`);
console.log("");
console.log("Auto-generated mock passwords (plaintext, for manual login/testing):");
for (const [key, pwd] of Object.entries(plaintext))
  console.log(`  ${key.padEnd(22)} = ${pwd}`);
