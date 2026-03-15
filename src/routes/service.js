// @ts-check
import express from "express";
const router = express.Router();

import sEnt from "../entities/service.js";
import history from "../middlewares/history.js";

// Get services
router.post("/search", sEnt.get);
// Get version history of a specific service
router.get("/:id/history", history.get("service"));
// add a service.
router.post("/", sEnt.addArraySubstack);
// Update a service.
router.put("/", sEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", sEnt.archive);

export default router;
