// @ts-check
import express from "express";
const router = express.Router();

import mEnt from "../entities/method.js";

// Search methods
router.post("/search", mEnt.get);
// Update a method
router.put("/", mEnt.updateArraySubstack);

export default router;
