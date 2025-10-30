// @ts-check
import http from "httpclient";

const { MSUSER_URL } = process.env;

let access = null;

// Call once when app starts to initialize reference data.
function init() {
  return http.query("get", `${MSUSER_URL}/access`, null).then((res) => {
    access = res.data.rows;
  });
}

function getAll() {
  return access;
}

function getOne(routeId) {
  return access.find((r) => +r.routeId === +routeId);
}

function updateAll(newAccess) {
  access = newAccess;
}

export default {
  getAll,
  getOne,
  updateAll,
  init,
};
