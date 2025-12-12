// @ts-check
import { log } from "@dwtechs/winstan";
import http from "../../services/http.js";

const { MSUSER_URL } = process.env;
const url = `${MSUSER_URL}/users/`;

export default function getUserByEmail(req, res, next) {
  const { email } = req.body.rows[0];
  const filters = {
    email: { 
      value: email, 
      matchMode: "equals" 
    },
    archived: { 
      value: false, 
      matchMode: "is" 
    },
  };
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, null, { filters }, headers)
    .then((r) => {
      const u = r.data.rows[0];
      log.debug(`ms_user response: user id=${u.id}, nickname=${u.nickname}, email=${u.email}`);
      // Add user data to response rows for final response
      res.rows = u;
      // Add user id, nickname and roles to request body rows for consumer creation
      req.body.rows[0] = { ...req.body.rows[0], id: u.id, nickname: u.nickname, roles: u.roles };
      log.debug(`req.body.rows[0] after update: ${JSON.stringify(req.body.rows[0])}`);
      // Add active to res locals for activation check
      res.locals.active = u.active;
      next();
    })
    .catch((err) => next(err));
}
