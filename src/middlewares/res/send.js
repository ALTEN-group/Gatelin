import { filterFields } from "../validators/check-acl.js";

/**
 * Prepare and send response back to the front-end
 * This JavaScript function, send, prepares and sends a response back to the front-end.
 * It takes two parameters: req (request) and res (response).
 * If res.locals exists, it sends it as a JSON response.
 * If res.locals doesn't exist, it sends a 204 status code (No Content) response.
 *
 * When checkAcl restricted the role to a subset of fields, rows are projected
 * down to that subset here — the same allowlist that strips write payloads also
 * has to strip what is read back, or the restriction is trivially bypassed.
 */
function send(_req, res) {
  const data = res.locals;
  const allowed = data.aclFields;
  const rows =
    allowed && Array.isArray(data.rows)
      ? data.rows.map((row) => filterFields(row, allowed))
      : data.rows;
  res.status(200).json({ rows, total: data.total });
}

export { send };
