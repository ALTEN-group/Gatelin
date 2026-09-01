// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const requirePg = createRequire(
  fileURLToPath(import.meta.resolve("@dwtechs/antity-pgsql")),
);
/** @type {typeof import("pg").Pool} */
const Pool = requirePg("pg").Pool;

let _pool = null;

/**
 * Pool for the cron DB role (hard-delete of archived rows and history purge).
 * Distinct from the app pool (`DB_USER`), which must not DELETE those tables.
 */
function getJobPool() {
  if (_pool === null) {
    const { DB_HOST, DB_JOB_USER, DB_JOB_PWD, DB_NAME, DB_PORT, DB_MAX } =
      process.env;
    _pool = new Pool({
      host: DB_HOST,
      user: DB_JOB_USER,
      password: DB_JOB_PWD,
      database: DB_NAME,
      port: +(DB_PORT || 5432),
      max: DB_MAX ? +DB_MAX : 10,
    });
  }
  return _pool;
}

/**
 * @param {string} query
 * @param {unknown[]} args
 */
export function executeJob(query, args) {
  return execute(query, args, getJobPool());
}
