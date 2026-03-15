// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/cors.js";
import history from "../middlewares/history.js";
import {
  addToCache,
  updateCache,
  deleteFromCache,
} from "../middlewares/cache/cors.js";

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

export default router;
