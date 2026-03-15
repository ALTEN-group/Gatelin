// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/resource.js";
import history from "../middlewares/history.js";

// Get routes
router.post("/search", rEnt.get);
// Get version history of a specific resource
router.get("/:id/history", history.get("resource"));
// add a resource.
router.post("/", rEnt.addArraySubstack);
// Update a resource.
router.put("/", rEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", rEnt.archive);

export default router;
