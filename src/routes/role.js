// @ts-check
import express from "express";

const router = express.Router();

import rEnt from "../entities/role.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search roles
router.post("/search", rEnt.get);
// Get version history of a specific role
router.get("/:id/history", history.get("role"));
// Add a new role
router.post("/", rEnt.addArraySubstack);
// Update a role
router.put("/", rEnt.updateArraySubstack);
// Archive roles
router.post("/archive", rEnt.archive);
// Get entity schema
router.get("/schema", schema.get(rEnt));

export default router;
