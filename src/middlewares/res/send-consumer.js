// @ts-check
import { deleteProps } from "@dwtechs/sparray";
import cEnt from "../../entities/consumer.js";

/**
 * Express middleware that sends a single consumer object as JSON response.
 * Removes unsafe properties from the consumer data before sending.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} _next - Express next function (unused)
 * @return {void} Sends JSON response with consumer data
 * @example
 * // Use as final middleware in route
 * router.post('/consumers', addConsumer, sendConsumer);
 */
export function sendConsumer(req, res, _next) {
  const data = deleteProps(req.body.rows, cEnt.unsafeProps);
  res.status(200).json(data[0]);
}
