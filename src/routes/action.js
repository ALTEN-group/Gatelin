// @ts-check
import express from "express";
const router = express.Router();

import aEnt from "../entities/action.js";

const getMany = [
  aEnt.get,
];

// const getHistory = [
//   // history.get,
// ];

const add = [
  aEnt.normalizeArray,
  aEnt.validateArray,
  aEnt.add,
];

const update = [
  aEnt.normalizeArray,
  aEnt.validateArray,
  aEnt.update,
];

const del = [
  aEnt.delete,
];

// Get routes
router.post("/search", getMany);
// Get updates history of a user
// router.get("/:id/history", getHistory);
// add a route.
router.post("/", add);
// Update a route.
router.put("/", update);
// delete a route.
router.delete("/", del);

export default router;
