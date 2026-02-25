// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/resource.js";
import history from "../middlewares/history.js";

const getHistory = [
  history.get("route")
];

const add = [
  rEnt.normalizeArray,
  rEnt.validateArray,
  rEnt.add,
];

const update = [
  rEnt.normalizeArray,
  rEnt.validateArray,
  rEnt.update,
];

const del = [rEnt.archive];

// Get routes
router.post("/search", rEnt.get);
// Get version history of a specific resource
router.get("/:id/history", getHistory);
// add a resource.
router.post("/", add);
// Update a resource.
router.put("/", update);
// Bulk archive
router.post("/archive", del);

export default router;
