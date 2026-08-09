// @ts-check
import express from "express";
const router = express.Router();

import oEnt from "../entities/operation.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Get routes
router.post("/search", oEnt.get);
// Get version history of a specific operation
router.get("/:id/history", history.get("operation"));
// add an operation.
router.post("/", oEnt.addArraySubstack);
// Update an operation.
router.put("/", oEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", oEnt.archive);
// Get entity schema
router.get("/schema", schema.get(oEnt));

export default router;
