// @ts-check
import http from "httpclient";

const { MSAUTH_URL } = process.env;
const url = `${MSAUTH_URL}/login/`;

export default function checkPwd(req, res, next) {
  const headers = req.additionalHeaders || {};
  http
    .query("POST", url, null, req.body, headers)
    .then(() => {
      next();
    })
    .catch((err) => next(err));
}
