// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/color.js";
import history from "../middlewares/history.js";

// Search colors
router.post("/search", cEnt.get);
// Get version history of a specific color
router.get("/:id/history", history.get("color"));
// Add a new color
router.post("/", cEnt.addArraySubstack);
// Update a color
router.put("/", cEnt.updateArraySubstack);
// Archive colors
router.post("/archive", cEnt.archive);

export default router;
