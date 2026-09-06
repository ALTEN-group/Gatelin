// @ts-check
import express from "express";

const router = express.Router();

import pEnt from "../entities/permission.js";
import { reloadRoles } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import { assertGrantSubset } from "../middlewares/mappers/permission/assertGrantSubset.js";
import schema from "../middlewares/schema.js";

// Search permissions
router.post("/search", pEnt.get);
// Get history of permissions for a specific route, including condition assignment changes
router.get(
  "/history/route/:routeId",
  history.getByField(["permission", "permission_condition"], "routeId"),
);
// Add permissions
router.post("/", assertGrantSubset, pEnt.addArraySubstack, reloadRoles);
// Update permissions
router.put("/", assertGrantSubset, pEnt.updateArraySubstack, reloadRoles);
// Hard-delete permission rows (uncheck in the admin is PUT active: false)
router.delete("/", assertGrantSubset, pEnt.delete, reloadRoles);
// Get entity schema
router.get("/schema", schema.get(pEnt));

export default router;
