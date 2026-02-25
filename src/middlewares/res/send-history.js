// @ts-check

/**
 * Sends the route history from res.locals.history to the client
 * Part of route history middleware stack in GET /routes/:id/history route
 *
 * @param {Object} _req - Express request (unused)
 * @param {Object} res - Express response
 * @param {Object} res.locals - Response locals object
 * @param {Array} res.locals.history - Array of history records
 *
 * INPUT:
 *   res.locals.history = [{
 *     id: number,
 *     tstamp: timestamp,
 *     operation: string,
 *     consumerId: number,
 *     consumerName: string,
 *     record: object
 *   }]
 *
 * OUTPUT:
 *   HTTP 200 JSON response with history array
 */
export function sendHistory(_req, res) {
  const history = res.locals.history || [];
  res.status(200).json({ history, total: history.length });
}
