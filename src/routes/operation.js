// @ts-check
import express from "express";
const router = express.Router();

import oEnt from "../entities/operation.js";
import history from "../middlewares/history.js";

const getHistory = [
  history.get("route"),
];

const add = [
  oEnt.normalizeArray,
  oEnt.validateArray,
  oEnt.add,
];

const update = [
  oEnt.normalizeArray,
  oEnt.validateArray,
  oEnt.update,
];

const del = [oEnt.archive];

// Get routes
router.post("/search", oEnt.get);
// Get version history of a specific operation
router.get("/:id/history", getHistory);
// add an operation.
router.post("/", add);
// Update an operation.
router.put("/", update);
// Bulk archive
router.post("/archive", del);

export default router;
