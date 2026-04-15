// @ts-check
import { execute } from "@dwtechs/antity-pgsql";

function deleteArchived(date) {
  return execute('DELETE FROM color WHERE archived = true AND "archivedAt" < $1', [date], null)
    .then((r) => r.rowCount || 0);
}

export default {
  deleteArchived,
};
