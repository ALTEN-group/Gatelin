// @ts-check
import express from "express";

const router = express.Router();

import pEnt from "../entities/preference.js";
import rEnt from "../entities/resource.js";
import { filterByIdAndUserIdAndResource } from "../middlewares/filters/byIdAndUserIdAndResource.js";
import { filterByName } from "../middlewares/filters/byName.js";
import { assertRowsOwnedAndUnlocked } from "../middlewares/mappers/preference/assertRowsOwnedAndUnlocked.js";
import { getPreferences } from "../middlewares/mappers/preference/getPreferences.js";
import { injectUserIdAndResourceId } from "../middlewares/mappers/preference/injectUserIdAndResourceId.js";

// Get the merged view list (system templates + this user's own preferences)
router.get("/:resource", getPreferences);
// Create a preference conf
router.post(
  "/:resource",
  filterByName, // injects resource filter
  rEnt.get, // fetches the resource to res.locals.rows. Fails with 404 if the resource name doesn't exist
  injectUserIdAndResourceId, // inject userId and resourceId to req.body.rows
  pEnt.addArraySubstack, // adds the preference to db
);
// Update preferences.
// Fail-closed pre-flight: reject unless every req.body.rows[].id is owned by
// the caller, unlocked, and belongs to :resource. Without this middleware,
// updateArraySubstack would batch-UPDATE by id alone, allowing any authenticated
// user to overwrite other users' rows or locked system templates (IDOR).
router.put("/:resource", assertRowsOwnedAndUnlocked, pEnt.updateArraySubstack);
// Delete a single user-owned preference.
// guarantee the row belongs to the authenticated user
router.delete(
  "/:resource/:id",
  filterByIdAndUserIdAndResource, // injects preference filter
  pEnt.get, // fetches the row to res.locals.rows. Fails with 404 if the preference is not owned by this user
  pEnt.delete, // deletes the row from preference
);

export default router;
