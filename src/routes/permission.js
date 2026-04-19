// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/permission.js";
import { permissionsToTree } from "../middlewares/mappers/permission/to-tree.js";
import { requireRoleIdFilter } from "../middlewares/validators/check-permission-filter.js";

// Search permissions
router.post("/search", requireRoleIdFilter, pEnt.get, permissionsToTree);
// Add permissions
router.post("/", pEnt.addArraySubstack);
// Update permissions
router.put("/", pEnt.updateArraySubstack);
// Archive (hard delete via INSTEAD OF UPDATE trigger)
router.post("/archive", pEnt.archive);

export default router;
