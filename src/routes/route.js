// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/route.js";

const getMany = [
  rEnt.get,
];

// const getHistory = [
//   // history.get,
// ];

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

const del = [
  rEnt.delete,
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
