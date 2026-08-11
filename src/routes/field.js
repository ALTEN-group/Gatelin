// @ts-check
import express from "express";

const router = express.Router();

import fEnt from "../entities/field.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search fields
router.post("/search", fEnt.get);
// Get version history of a specific field
router.get("/:id/history", history.get("field"));
// Add fields
router.post("/", fEnt.addArraySubstack);
// Update fields
router.put("/", fEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", fEnt.archive);
// Get entity schema
router.get("/schema", schema.get(fEnt));

export default router;
