// @ts-check
import express from "express";
const router = express.Router();

import pEnt from "../entities/permission.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";

// Search permissions
router.post("/search", pEnt.get);
// Get history of permissions for a specific route
router.get(
  "/history/route/:routeId",
  history.getByField("permission", "routeId"),
);
// Add permissions
router.post("/", pEnt.addArraySubstack);
// Update permissions
router.put("/", pEnt.updateArraySubstack);
// Delete permissions (uncheck route)
router.delete("/", pEnt.delete);
// Get entity schema
router.get("/schema", schema.get(pEnt));

export default router;
