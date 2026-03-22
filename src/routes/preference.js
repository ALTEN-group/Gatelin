// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/preference.js";
import { injectFilters } from "../middlewares/mappers/preference/injectFilters.js";
import { injectBody } from "../middlewares/mappers/preference/injectBody.js";
import { upsertRows } from "../middlewares/mappers/preference/upsertRows.js";

// GET all preferences for the authenticated user and the given table
router.get("/:tableName", injectFilters, pEnt.get);
// Upsert preferences: insert rows without IDs, update rows with IDs
router.put("/:tableName", injectBody, upsertRows);

export default router;
