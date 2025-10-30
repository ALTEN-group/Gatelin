// @ts-check
import { log } from "@dwtechs/winstan";

import accessSvc from "../services/access.js";

async function updateAll(req, res, next) {
  log.debug("access - updateAll()");

  const access = req.body.data.rows;
  const total = req.body.data.total;
  if (!total) return next({ status: 400, msg: "Missing access" });

  accessSvc.updateAll(access);

  next();
}

export default {
  updateAll,
};
