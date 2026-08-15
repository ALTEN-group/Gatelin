// @ts-check
import express from "express";

const router = express.Router();

import fEnt from "../entities/field.js";
import { reloadRoles } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search fields
router.post("/search", fEnt.get);
// Get version history of a specific field
router.get("/:id/history", history.get("field"));
// Add fields
router.post("/", fEnt.addArraySubstack, reloadRoles);
// Update fields
router.put("/", fEnt.updateArraySubstack, reloadRoles);
// Bulk archive
router.post("/archive", fEnt.archive, reloadRoles);
// Get entity schema
router.get("/schema", schema.get(fEnt));

export default router;
