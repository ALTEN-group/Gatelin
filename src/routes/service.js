// @ts-check
import express from "express";
const router = express.Router();

import sEnt from "../entities/service.js";
import history from "../middlewares/history.js";

const getHistory = [
  history.get("route")
];

const add = [
  sEnt.normalizeArray,
  sEnt.validateArray,
  sEnt.add,
];

const update = [
  sEnt.normalizeArray,
  sEnt.validateArray,
  sEnt.update,
];

const del = [sEnt.archive];

// Get services
router.post("/search", sEnt.get);
// Get version history of a specific service
router.get("/:id/history", getHistory);
// add a service.
router.post("/", add);
// Update a service.
router.put("/", update);
// Bulk archive
router.post("/archive", del);

export default router;
