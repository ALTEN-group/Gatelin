import express from "express";
const router = express.Router();
import Prom from "prom-client";
const register = new Prom.Registry();

router.get("/", (req, res, next) => {
  res.setHeader("Content-Type", register.contentType);
  register
    .metrics()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      const status = err.status || 400;
      res.status(status).send(err.msg);
    });
});

export default router;
