// Login/logout flow: exercises Pwd verification, RBAC permission resolution,
// and session cache writes — the most expensive path per request in Gatelin.
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, CREDENTIALS } from "./common.js";

export const options = {
  vus: Number(__ENV.K6_VUS) || 10,
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<400"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const loginRes = http.post(
    `${BASE_URL}/sessions`,
    JSON.stringify(CREDENTIALS),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "login" },
    },
  );
  const ok = check(loginRes, {
    "login: status 200": (r) => r.status === 200,
    "login: has accessToken": (r) => !!r.json("accessToken"),
  });

  if (ok) {
    const accessToken = loginRes.json("accessToken");
    const logoutRes = http.del(`${BASE_URL}/sessions`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
      tags: { name: "logout" },
    });
    check(logoutRes, { "logout: status 204": (r) => r.status === 204 });
  }

  sleep(1);
}
