// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/route.js";
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
// Get version history of a specific route
router.get("/:id/history", getHistory);
// add a route.
router.post("/", add);
// Update a route.
router.put("/", update);
// Bulk archive
router.post("/archive", del);

export default router;
