// @ts-check
import express from "express";
const router = express.Router();

import oEnt from "../entities/operation.js";

const getMany = [
  oEnt.get,
];

// const getHistory = [
//   // history.get,
// ];

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

const del = [
  oEnt.delete,
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
