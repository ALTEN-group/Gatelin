// Login/logout flow: exercises Pwd verification, RBAC permission resolution,
// and session cache writes — the most expensive path per request in Gatelin.
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, CREDENTIALS } from "./common.js";

export const options = {
  vus: Number(__ENV.K6_LOGIN_VUS) || 1,
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<600"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  // Stagger concurrent VUs so they don't collision-generate the exact same
  // JWT in the same second when logging in as the single mock admin persona.
  if (__ITER === 0 && __VU > 1) {
    sleep((__VU - 1) * 0.15);
  }

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
    let csrfToken = loginRes.cookies.csrfToken?.[0]?.value;
    if (!csrfToken) {
      const setCookie = loginRes.headers["Set-Cookie"] || "";
      const match = setCookie.match(/csrfToken=([^;]+)/);
      if (match) csrfToken = match[1];
    }
    const logoutHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (csrfToken) {
      logoutHeaders["X-CSRF-Token"] = csrfToken;
    }
    const logoutRes = http.del(`${BASE_URL}/sessions`, null, {
      headers: logoutHeaders,
      tags: { name: "logout" },
    });
    check(logoutRes, { "logout: status 204": (r) => r.status === 204 });
  }

  sleep(1 + Math.random() * 0.5);
}
