// @ts-check
import express from "express";

const router = express.Router();

import mEnt from "../entities/method.js";
import { reloadRoutes } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search methods
router.post("/search", mEnt.get);
// Get version history of a specific method
router.get("/:id/history", history.get("method"));
// Update a method
router.put("/", mEnt.updateArraySubstack, reloadRoutes);
// Get entity schema
router.get("/schema", schema.get(mEnt));

export default router;
