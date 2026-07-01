// @ts-check
import express from "express";
const router = express.Router();

import mEnt from "../entities/method.js";
import schema from "../middlewares/schema.js";

// Search methods
router.post("/search", mEnt.get);
// Update a method
router.put("/", mEnt.updateArraySubstack);
// Get entity schema
router.get("/schema", schema.get(mEnt));

export default router;
