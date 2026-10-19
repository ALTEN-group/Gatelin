// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

// Used to login users via email and password
export default new SQLEntity("user", [
  {
    key: "email",
    type: "email",
    min: 5,
    max: 50,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: ["POST"],
    operations: [],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "pwd",
    type: "string", // the password service owns the policy; login only bounds the size
    min: 1,
    max: 255,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: ["POST"],
    operations: [],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
]);
