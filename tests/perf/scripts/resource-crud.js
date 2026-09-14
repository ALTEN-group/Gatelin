// Authenticated CRUD flow: search + schema on a control-plane resource.
// Covers checkRequest (ACL) + antity-pgsql query path under sustained load.
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, authHeaders, login } from "./common.js";

export const options = {
  vus: Number(__ENV.K6_VUS) || 10,
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<300"],
    http_req_failed: ["rate<0.01"],
  },
};

// One login per VU, reused across iterations.
export function setup() {
  return { accessToken: login() };
}

export default function (data) {
  const params = authHeaders(data.accessToken);

  const searchRes = http.post(
    `${BASE_URL}/resources/search`,
    JSON.stringify({ filters: [] }),
    { ...params, tags: { name: "resources:search" } },
  );
  check(searchRes, { "resources search: status 200": (r) => r.status === 200 });

  const schemaRes = http.get(`${BASE_URL}/resources/schema`, {
    ...params,
    tags: { name: "resources:schema" },
  });
  check(schemaRes, { "resources schema: status 200": (r) => r.status === 200 });

  sleep(1);
}
