// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

export default new SQLEntity("cors", [
  {
    key: "id",
    type: "integer",
    min: 1,
    max: 999999999,
    typeCheck: true,
    filter: true,
    need: [],
    operations: ["SELECT"],
    send: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "name",
    type: "string",
    min: 1,
    max: 50,
    typeCheck: true,
    filter: true,
    need: ["POST", "PUT"],
    operations: ["SELECT", "INSERT", "UPDATE"],
    send: true,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
]);
