// @ts-check
import express from "express";
const router = express.Router();

import rEnt from "../entities/route.js";
import history from "../middlewares/history.js";
import { checkRoutePattern } from "../middlewares/validators/check-route-pattern.js";
import schema from "../middlewares/schema.js";

// Get routes
router.post("/search", rEnt.get);
// Get version history of a specific route, including method/operation assignment changes
router.get(
  "/:id/history",
  history.get(["route", "route_operation", "route_method"]),
);
// add a route.
router.post("/", checkRoutePattern, rEnt.addArraySubstack);
// Update a route.
router.put("/", checkRoutePattern, rEnt.updateArraySubstack);
// Bulk archive
router.post("/archive", rEnt.archive);
// Get entity schema
router.get("/schema", schema.get(rEnt));

export default router;
