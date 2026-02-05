// @ts-check
import express from "express";
const router = express.Router();

import sEnt from "../entities/service.js";

const getMany = [
  sEnt.get,
];

// const getHistory = [
//   // history.get,
// ];

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

const del = [
  sEnt.delete,
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
