// Baseline load test: unauthenticated liveness/readiness endpoint.
// Establishes the floor latency (no auth, no DB-backed permission resolution).
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "./common.js";

export const options = {
  vus: Number(__ENV.K6_VUS) || 10,
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/health`, { tags: { name: "health" } });
  check(res, { "health: status 200": (r) => r.status === 200 });
  sleep(1);
}
