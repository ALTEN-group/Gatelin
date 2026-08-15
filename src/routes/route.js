// @ts-check
import express from "express";

const router = express.Router();

import rEnt from "../entities/route.js";
import { reloadRoutes } from "../middlewares/cache/reload.js";
import history from "../middlewares/history.js";
import schema from "../middlewares/schema.js";
import { checkRoutePattern } from "../middlewares/validators/check-route-pattern.js";

// Get routes
router.post("/search", rEnt.get);
// Get version history of a specific route, including method/operation assignment changes
router.get(
  "/:id/history",
  history.get(["route", "route_operation", "route_method"]),
);
// add a route.
router.post("/", checkRoutePattern, rEnt.addArraySubstack, reloadRoutes);
// Update a route.
router.put("/", checkRoutePattern, rEnt.updateArraySubstack, reloadRoutes);
// Bulk archive
router.post("/archive", rEnt.archive, reloadRoutes);
// Get entity schema
router.get("/schema", schema.get(rEnt));

export default router;
