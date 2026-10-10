// @ts-check
import express from "express";

const router = express.Router();

import aEnt from "../entities/audit.js";
import { buildChanges } from "../middlewares/mappers/audit-changes.js";

//Routes
// Search the audit log (read-only: no history, add, update, archive or schema)
router.post("/search", aEnt.get, buildChanges);

export default router;
