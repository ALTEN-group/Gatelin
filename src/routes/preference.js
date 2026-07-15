// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/preference.js";
import { injectFilters } from "../middlewares/mappers/preference/injectFilters.js";
import { injectBody } from "../middlewares/mappers/preference/injectBody.js";
import { deduplicatePreferences } from "../middlewares/mappers/preference/deduplicatePreferences.js";
import checkPreferenceOwnership from "../middlewares/validators/check-preference-ownership.js";

// Get entity schema
router.get("/:resource", injectFilters, pEnt.get, deduplicatePreferences);
// Upsert user preferences: creates user copies of system defaults on first save,
// updates existing user rows on subsequent saves.
router.put("/:resource", injectBody, pEnt.upsertArraySubstack);
// Delete a single user-owned preference. checkPreferenceOwnership guarantees
// the row belongs to the authenticated user for this resource, so a shared
// system default (userId=-1) or another user's row can never be deleted.
router.delete("/:resource/:id", checkPreferenceOwnership, pEnt.delete);

export default router;
