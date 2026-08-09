// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/consumer.js";
import { deleteFromCache } from "../middlewares/cache/consumer.js";
import { send204 } from "../middlewares/res/send-204.js";
import { send } from "../middlewares/res/send.js";
import schema from "../middlewares/schema.js";

// middleware sub-stacks
const getMany = [cEnt.get, send];
const del = [cEnt.archive, deleteFromCache, send204];

// Get routes
router.post("/search", getMany);
// Bulk archive
router.post("/archive", del);
// Get entity schema
router.get("/schema", schema.get(cEnt), send);

export default router;
