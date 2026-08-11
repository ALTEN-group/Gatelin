// @ts-check
import express from "express";

const router = express.Router();

import cEnt from "../entities/cors.js";
import {
	addToCache,
	deleteFromCache,
	updateCache,
} from "../middlewares/cache/cors.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

const add = [cEnt.addArraySubstack, addToCache];
const update = [cEnt.updateArraySubstack, updateCache];
const del = [cEnt.archive, deleteFromCache];

// Get routes
router.post("/search", cEnt.get);
// Get version history of a specific CORS entry
router.get("/:id/history", history.get("cors"));
// add a CORS entry.
router.post("/", add);
// Update a CORS entry.
router.put("/", update);
// Bulk archive
router.post("/archive", del);
// Get entity schema
router.get("/schema", schema.get(cEnt));

export default router;
