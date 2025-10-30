// @ts-check
import { log } from "@dwtechs/winstan";
import http from "httpclient";

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
      log.debug(`ms_user response: ${u.toString()}`);
      // Add user data to response rows for final response
      res.rows = u;
      // Add user id to request body for pwd validation and Token refresh
      req.body.id = u.id;
      // Add user nickname and roles for consumer creation
      req.body.nickname = u.nickname;
      req.body.roles = u.roles;
      // Add active to res locals for activation check
      res.locals.active = u.active;
      next();
    })
    .catch((err) => next(err));
}
