// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/route.js";
import history from "../middlewares/history.js";

// Get routes
router.post("/search", rEnt.get);
// Get version history of a specific route
router.get("/:id/history", history.get("route"));
// add a route.
router.post("/", rEnt.add);
// Update a route.
router.put("/", rEnt.update);
// Bulk archive
router.post("/archive", rEnt.archive);

export default router;
