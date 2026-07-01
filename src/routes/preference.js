// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/preference.js";
import { injectFilters } from "../middlewares/mappers/preference/injectFilters.js";
import { injectBody } from "../middlewares/mappers/preference/injectBody.js";
import { deduplicatePreferences } from "../middlewares/mappers/preference/deduplicatePreferences.js";
import schema from "../middlewares/schema.js";

// Get entity schema
router.get("/schema", schema.get(pEnt));
router.get("/:resource", injectFilters, pEnt.get, deduplicatePreferences);
// Upsert user preferences: creates user copies of system defaults on first save,
// updates existing user rows on subsequent saves.
router.put("/:resource", injectBody, pEnt.upsertArraySubstack);

export default router;
