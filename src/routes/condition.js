// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/condition.js";
import history from "../middlewares/history.js";

// Search conditions
router.post("/search", cEnt.get);
// Get version history of a specific condition
router.get("/:id/history", history.get("condition"));
// Add conditions
router.post("/", cEnt.addArraySubstack);
// Update conditions
router.put("/", cEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", cEnt.archive);

export default router;
