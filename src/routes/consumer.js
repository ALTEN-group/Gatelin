// @ts-check
import express from "express";
const router = express.Router();

import cEnt from "../entities/consumer.js";
import { deleteFromCache } from "../middlewares/cache/consumer.js";
import { send204 } from "../middlewares/res/send-204.js";
import { send } from "../middlewares/res/send.js";

// middleware sub-stacks

const deleteConsumer = [cEnt.archive, deleteFromCache, send204];

const getMany = [cEnt.get, send];

const del = [deleteConsumer];

//Routes

// Get routes
router.post("/search", getMany);

// Bulk archive consumers.
router.patch("/archive", del);

export default router;
