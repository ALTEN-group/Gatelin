// @ts-check
import express from "express";

const router = express.Router();

import { forwardToService } from "../controllers/forward.js";
import updateHeaderWithConsumer from "../middlewares/mappers/additionalHeaders.js";

// Dispatch request - catch all routes using regex
router.all(/^\/.*/, updateHeaderWithConsumer, forwardToService);

export default router;
