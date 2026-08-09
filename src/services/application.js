// @ts-check
import { execute } from "@dwtechs/antity-pgsql";
import aEnt from "../entities/application.js";

function deleteArchived(date) {
  const q = aEnt.query.deleteArchive();
  return execute(q, [date], null).then((r) => r.rowCount || 0);
}

export default {
  deleteArchived,
};
