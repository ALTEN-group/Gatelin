// @ts-check
import express from "express";
const router = express.Router();

import mEnt from "../entities/method.js";

// Search methods
router.post("/search", mEnt.get);
// Add a method
router.post("/", mEnt.addArraySubstack);
// Update a method
router.put("/", mEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", mEnt.archive);

export default router;
