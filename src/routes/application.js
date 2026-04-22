// @ts-check
import express from "express";
const router = express.Router();

import aEnt from "../entities/application.js";
import history from "../middlewares/history.js";

// Search applications
router.post("/search", aEnt.get);
// Get version history of a specific application
router.get("/:id/history", history.get("application"));
// Add a new application
router.post("/", aEnt.addArraySubstack);
// Update an application
router.put("/", aEnt.updateArraySubstack);
// Archive applications
router.post("/archive", aEnt.archive);

export default router;
