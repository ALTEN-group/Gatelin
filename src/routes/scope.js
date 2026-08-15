// @ts-check
import express from "express";

const router = express.Router();

import sEnt from "../entities/scope.js";
import { reloadScopes } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search scopes
router.post("/search", sEnt.get);
// Get version history of a specific scope
router.get("/:id/history", history.get("scope"));
// Add scopes
router.post("/", sEnt.addArraySubstack, reloadScopes);
// Update scopes
router.put("/", sEnt.updateArraySubstack, reloadScopes);
// Bulk archive
router.post("/archive", sEnt.archive, reloadScopes);
// Get entity schema
router.get("/schema", schema.get(sEnt));

export default router;
