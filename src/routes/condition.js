// @ts-check
import express from "express";

const router = express.Router();

import cEnt from "../entities/condition.js";
import { reloadRoles } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search conditions
router.post("/search", cEnt.get);
// Get version history of a specific condition
router.get("/:id/history", history.get("condition"));
// Add conditions
router.post("/", cEnt.addArraySubstack, reloadRoles);
// Update conditions
router.put("/", cEnt.updateArraySubstack, reloadRoles);
// Bulk archive
router.post("/archive", cEnt.archive, reloadRoles);
// Get entity schema
router.get("/schema", schema.get(cEnt));

export default router;
