import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  const data = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  res.status(200).send(data);
});

export default router;
