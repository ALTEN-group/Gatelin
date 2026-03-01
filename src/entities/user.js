// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

// let { PWD_MIN_LENGTH_POLICY, PWD_MAX_LENGTH_POLICY } = process.env;
// const PWD_MIN = PWD_MIN_LENGTH_POLICY ? +PWD_MIN_LENGTH_POLICY : 9;
// const PWD_MAX = PWD_MAX_LENGTH_POLICY ? +PWD_MAX_LENGTH_POLICY : 64;
// Used to login users via email and password
export default new SQLEntity("user", [
  {
    key: "email",
    type: "email",
    min: 5,
    max: 50,
    typeCheck: true,
    filter: true,
    need: ["POST"],
    operations: [],
    send: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "pwd",
    type: "password",
    min: null,
    max: null,
    typeCheck: true,
    filter: true,
    need: ["POST"],
    operations: [],
    send: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
]);
