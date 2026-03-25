// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/preference.js";
import { injectFilters } from "../middlewares/mappers/preference/injectFilters.js";
import { injectBody } from "../middlewares/mappers/preference/injectBody.js";
import { send } from "../middlewares/res/send.js";

// GET all preferences for the authenticated user and the given table
router.get("/:tableName", injectFilters, pEnt.get, send);
// Add new preferences for the authenticated user and the given table
router.put("/:tableName", injectBody, pEnt.syncArraySubstack, send);

export default router;
