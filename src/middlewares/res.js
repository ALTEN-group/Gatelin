import { isArray } from "@dwtechs/checkard";
import { deleteProps } from "@dwtechs/sparray";
import { log } from "@dwtechs/winstan";

function clear(rows, props) {
  if (isArray(props, ">=", 1)) {
    log.debug(`clear unsafe props : [${props.toString()}]`);
    return deleteProps(rows, props);
  }
  return rows;
}
/**
 * Prepare and send response back to the front-end
 * This JavaScript function, send, prepares and sends a response back to the front-end.
 * It takes two parameters: req (request) and res (response).
 * If res.rows exists, it creates a new object res.data containing rows and total (if available).
 * Then sends it as a JSON response. If res.rows doesn't exist, it sends a 204 status code (No Content) response.
 */
function send(req, res) {
  const rows = res.rows;
  const unsafeProps = res.unsafeProps;
  if (isArray(rows, ">", 0)) {
    const payload = { rows: clear(rows, unsafeProps) };
    if (res.total) payload.total = res.total;
    // Send 201 for POST requests (resource created), 200 for others
    const statusCode = req.method === 'POST' ? 201 : 200;
    res.status(statusCode).json(payload);
  } else res.status(204).send();
}

export default {
  send,
};
