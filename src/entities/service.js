// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

export default new SQLEntity("service", [
  {
    key: "id",
    type: "integer",
    min: 1,
    max: 999999999,
    typeCheck: true,
    filter: true,
    methods: ["GET"],
    operations: ["SELECT"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: false,
    validate: true,
    sanitizer: null,
    normalizer: null,
    validator: null
  },
  {
    key: "name",
    type: "string",
    min: 1,
    max: 10,
    typeCheck: true,
    filter: true,
    methods: ["GET", "POST", "PUT"],
    operations: ["SELECT", "INSERT", "UPDATE"],
    required: true,
    safe: true,
    sanitize: true,
    normalize: false,
    validate: true,
    sanitizer: null,
    normalizer: null,
    validator: null
  }
]);
