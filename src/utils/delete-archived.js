// @ts-check
import { execute } from "@dwtechs/antity-pgsql";

/**
 * Creates a deleteArchived function bound to an entity's deleteArchive query.
 * Used by the scheduled job to permanently remove records archived before `date`.
 *
 * @param {{ query: { deleteArchive: () => string } }} entity
 * @returns {(date: Date) => Promise<number>} deleted row count
 */
export function makeDeleteArchived(entity) {
	return function deleteArchived(date) {
		const q = entity.query.deleteArchive();
		return execute(q, [date], null).then((r) => r.rowCount || 0);
	};
}
