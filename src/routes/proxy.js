// @ts-check
import express from "express";
const router = express.Router();

import forwardToService from "../controllers/forward.js";

import stripUrl from "../middlewares/mappers/stripUrl.js";
import { checkRequest } from "../middlewares/validators/check-request.js";

// Dispatch request
router.all("*", 
  ...checkRequest, 
  stripUrl,
  forwardToService
);

export default router;
