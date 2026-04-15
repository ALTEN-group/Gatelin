// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/permission.js";

// Search permissions
router.post("/search", pEnt.get);
// Add permissions
router.post("/", pEnt.addArraySubstack);
// Update permissions
router.put("/", pEnt.updateArraySubstack);
// Archive (hard delete via INSTEAD OF UPDATE trigger)
router.post("/archive", pEnt.archive);

export default router;
