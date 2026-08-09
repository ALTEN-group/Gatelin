// @ts-check
import { log } from "@dwtechs/winstan";
import { getMany } from "../../../services/preference.js";

/**
 * Express middleware that returns the merged view list for a resource:
 * system templates (locked=true) and this user's personal preferences
 * (locked=false), each tagged isActive from preference_selection.
 *
 * @param {import('express').Request} req
 * @param {Object} req.params
 * @param {string} req.params.resource - Table/component identifier from URL
 * @param {import('express').Response} res
 * @param {number} res.locals.consumer.userId - Authenticated user ID
 * @param {import('express').NextFunction} next
 */
export async function getPreferences(req, res, next) {
  const userId = res.locals.consumer.userId;
  const { resource } = req.params;
  log.debug(() => `getPreferences(userId=${userId}, resource=${resource})`);

  try {
    const rows = await getMany(userId, resource);
    res.locals.rows = rows;
    res.locals.total = rows.length;
    next();
  } catch (err) {
    next(err);
  }
}
