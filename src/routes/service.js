// @ts-check
import express from "express";

const router = express.Router();

import sEnt from "../entities/service.js";
import { reloadRoutes } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Get services
router.post("/search", sEnt.get);
// Get version history of a specific service
router.get("/:id/history", history.get("service"));
// add a service.
router.post("/", sEnt.addArraySubstack, reloadRoutes);
// Update a service.
router.put("/", sEnt.updateArraySubstack, reloadRoutes);
// Bulk archive
router.post("/archive", sEnt.archive, reloadRoutes);
// Get entity schema
router.get("/schema", schema.get(sEnt));

export default router;
