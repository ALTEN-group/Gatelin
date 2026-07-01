// @ts-check
import express from "express";
const router = express.Router();

import sEnt from "../entities/scope.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search scopes
router.post("/search", sEnt.get);
// Get version history of a specific scope
router.get("/:id/history", history.get("scope"));
// Add scopes
router.post("/", sEnt.addArraySubstack);
// Update scopes
router.put("/", sEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", sEnt.archive);
// Get entity schema
router.get("/schema", schema.get(sEnt));

export default router;
