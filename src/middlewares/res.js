import { isObject } from "@dwtechs/checkard";

/**
 * Prepare and send response back to the front-end
 * This JavaScript function, send, prepares and sends a response back to the front-end.
 * It takes two parameters: req (request) and res (response).
 * If res.locals exists, it sends it as a JSON response.
 * If res.locals doesn't exist, it sends a 204 status code (No Content) response.
 */
function send(req, res) {
  const data = res.locals;
  if (isObject(data, true))
    res.status(200).json(data);
  else 
    res.status(204).send();
}

export default {
  send,
};
