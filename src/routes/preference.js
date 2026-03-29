// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/preference.js";
import { injectFilters } from "../middlewares/mappers/preference/injectFilters.js";
import { injectBody } from "../middlewares/mappers/preference/injectBody.js";

router.get("/:tableName", injectFilters, pEnt.get);
// Add new preferences for the authenticated user and the given table
router.put("/:tableName", injectBody, pEnt.syncArraySubstack);

export default router;
