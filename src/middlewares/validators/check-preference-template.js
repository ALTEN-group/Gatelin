// @ts-check
import { log } from "@dwtechs/winstan";
import { isArray } from "@dwtechs/checkard";
// import { confEquals } from "../../../utils/preferenceConf.js";
import {
  getMany,
  getByResourceAndUserId,
} from "../../services/preference.js";
// import { upsertSelection } from "./selection.js";
// import { send } from "../../res/send.js";

/**
 * Express middleware that injects userId (from the JWT session) and resource
 * (from the URL param) into each row of req.body.rows sent by the front-end,
 * then diffs the resent whole-array payload against the current system
 * templates and the user's own preferences.
 *
 * Templates (locked=true) are shared, read-only presets: a user can only
 * alter one by forking its conf into a new, distinctly-named personal
 * preference. Selecting a view as active (locked or not) never forks.
 * it only points this user's preference_selection row at the chosen
 * template/preference id, resolved by finalizeSelection once the
 * upsert below (if any) has run.
 *
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {Array<object>} req.body.rows - Rows from the client
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export async function injectBody(req, res, next) {
  const userId = res.locals.consumer.userId;
  const resource = req.params.resource;
  log.debug(
    () => `injectPreferenceBody(userId=${userId}, resource=${resource})`,
  );

  const rows = req.body.rows;
  if (!isArray(rows, "!0")) {
    return next({
      statusCode: 422,
      message: "Missing or empty preference rows",
    });
  }

  let allPrefs = [];
  try {
    allPrefs = await getByResourceAndUserId(userId, resource);
    // const prefsByName = new Map(allPrefs.map((p) => [p.name, p]));
  } catch (err) {
    return next(err);
  }

  for (const row of allPrefs) {
    if (row.locked) {
      
    }
  }


//   const takenNames = new Set(prefsByName.keys());

//   // A template row only needs to be forked into a personal preference when
//   // its conf was actually customized (col width changed).
//   // Activating a row (locked or not) is handled separately via `target`,
//   // resolved into a preference_selection
//   let target = null;
//   const changedRows = [];
//   for (const row of rows) {
//     const resolved = resolveRow(row, prefsByName, takenNames);
//     if (resolved.changedRow) changedRows.push(resolved.changedRow);
//     if (resolved.target) target = resolved.target;
//   }

//   if (changedRows.length === 0) {
//     log.debug(() => `injectPreferenceBody: no rows to upsert`);
//     try {
//       await applySelectionAndRefresh(res, userId, resource, target, [
//         ...prefsByName.values(),
//       ]);
//     } catch (err) {
//       return next(err);
//     }
//     return send(req, res);
//   }

//   req.body.rows = changedRows.map((row) => ({ ...row, userId, resource }));

//   // Use upsert conflict resolution: INSERT the row if (userId, resource, name) doesn't
//   // exist yet, otherwise UPDATE it.
//   req.body.conflictTarget = ["userId", "resource", "name"];
//   res.locals.pendingSelectionTarget = target;

//   next();
// }

// /**
//  * Runs after pEnt.upsertArraySubstack has persisted req.body.rows into
//  * preference (each upserted row now carries the generated `id`). Resolves
//  * the pending selection target stashed by injectBody to a concrete
//  * templateId/preferenceId, upserts preference_selection, then replaces
//  * res.locals.rows with the full merged view list for the resource.
//  *
//  * @param {import('express').Request} req
//  * @param {Object} req.params
//  * @param {string} req.params.resource
//  * @param {import('express').Response} res
//  * @param {number} res.locals.consumer.userId
//  * @param {Array<object>} res.locals.rows - Upserted rows, each with `id`/`name`
//  * @param {import('express').NextFunction} next
//  */
// export async function finalizeSelection(req, res, next) {
//   const userId = res.locals.consumer.userId;
//   const resource = String(req.params.resource);
//   const target = res.locals.pendingSelectionTarget;

//   try {
//     await applySelectionAndRefresh(
//       res,
//       userId,
//       resource,
//       target,
//       res.locals.rows,
//     );
//     next();
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * Builds a unique "<name> (copy[ N])" name to fork a template's conf into a
//  * personal, distinctly-named view, avoiding collisions with the user's
//  * existing preference names for the same resource.
//  * @param {string} name
//  * @param {Set<string>} takenNames
//  * @returns {string}
//  */
// function uniqueCopyName(name, takenNames) {
//   let candidate = `${name} (copy)`;
//   let n = 2;
//   while (takenNames.has(candidate)) {
//     candidate = `${name} (copy ${n})`;
//     n++;
//   }
//   return candidate;
// }

// /**
//  * Resolves a single client row against the current templates + personal
//  * preferences (indexed by name): decides whether it needs to be persisted
//  * (changedRow) and/or become the active selection (target). Forks a
//  * template's conf into a new personal preference name when it was
//  * customized; a stale/removed template is treated as a new personal
//  * preference under its own name.
//  * @param {any} row - Row sent by the client
//  * @param {Map<string, any>} prefsByName - Current templates + this user's own preferences
//  * @param {Set<string>} takenNames - mutated in place as fork names are taken
//  * @returns {{ changedRow: {name: string, conf: object} | null, target: {kind: "template", id: number} | {kind: "preference", name: string} | null }}
//  */
// function resolveRow(row, prefsByName, takenNames) {
//   // Not locked, or locked but its template no longer exists (stale
//   // reference to a removed template): save as-is under its own name.
//   const tpl = row.locked ? prefsByName.get(row.name) : undefined;
//   if (!tpl) {
//     return {
//       changedRow: { name: row.name, conf: row.conf },
//       target: row.isActive ? { kind: "preference", name: row.name } : null,
//     };
//   }

//   if (!confEquals(tpl.conf, row.conf)) {
//     const forkedName = uniqueCopyName(row.name, takenNames);
//     takenNames.add(forkedName);
//     return {
//       changedRow: { name: forkedName, conf: row.conf },
//       target: row.isActive ? { kind: "preference", name: forkedName } : null,
//     };
//   }

//   return {
//     changedRow: null,
//     target: row.isActive ? { kind: "template", id: tpl.id } : null,
//   };
// }

// /**
//  * Resolves a pending selection target to concrete templateId/preferenceId
//  * values, looking up the preference id by name among the given rows.
//  * @param {{ kind: "template", id: number } | { kind: "preference", name: string }} target
//  * @param {Array<{ id: number, name: string }>} rows
//  * @returns {{ templateId: number | null, preferenceId: number | null }}
//  */
// function resolveSelectionIds(target, rows) {
//   if (target.kind === "template") {
//     return { templateId: target.id, preferenceId: null };
//   }
//   const preferenceId = rows.find((r) => r.name === target.name)?.id ?? null;
//   return { templateId: null, preferenceId };
// }

// /**
//  * Upserts the user's preference_selection row for the resolved target (if
//  * any), then refreshes res.locals.rows/total with the full merged view list
//  * for the resource.
//  * @param {import('express').Response} res
//  * @param {number} userId
//  * @param {string} resource
//  * @param {{ kind: "template", id: number } | { kind: "preference", name: string } | null} target
//  * @param {Array<{ id: number, name: string }>} rows - Rows to resolve preferenceId from
//  */
// async function applySelectionAndRefresh(res, userId, resource, target, rows) {
//   if (target) {
//     const { templateId, preferenceId } = resolveSelectionIds(target, rows);
//     await upsertSelection(userId, resource, templateId, preferenceId);
//   }
//   res.locals.rows = await getMany(userId, resource);
//   res.locals.total = res.locals.rows.length;
// }
