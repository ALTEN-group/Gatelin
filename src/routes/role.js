// @ts-check
import express from "express";

const router = express.Router();

import rEnt from "../entities/role.js";
import { reloadRoles } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search roles
router.post("/search", rEnt.get);
// Get version history of a specific role
router.get("/:id/history", history.get("role"));
// Add a new role
router.post("/", rEnt.addArraySubstack, reloadRoles);
// Update a role
router.put("/", rEnt.updateArraySubstack, reloadRoles);
// Archive roles
router.post("/archive", rEnt.archive, reloadRoles);
// Get entity schema
router.get("/schema", schema.get(rEnt));

export default router;
