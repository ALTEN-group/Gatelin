// @ts-check
import express from "express";
const router = express.Router();

import res from "../middlewares/res.js";
import access from "../controllers/access.js";

// Update all access from ms_user
router.put("/", access.updateAll, res.send);

export default router;
