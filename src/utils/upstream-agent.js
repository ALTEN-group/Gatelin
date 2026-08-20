// @ts-check

import http from "node:http";
import https from "node:https";
import { isString } from "@dwtechs/checkard";

/**
 * Shared keep-alive agents for outbound proxy hops.
 *
 * Node's default Agent opens a new TCP socket per request (`keepAlive: false`).
 * Internal Docker/K8s hostnames are hit on every proxied call, so reusing
 * sockets is the cheap latency win. Retries stay off: streamed bodies cannot
 * be replayed safely.
 *
 * @returns {http.Agent.Options}
 */
function agentOptions() {
  return {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: Number(process.env.UPSTREAM_MAX_SOCKETS) || 256,
    maxFreeSockets: Number(process.env.UPSTREAM_MAX_FREE_SOCKETS) || 64,
    scheduling: "lifo",
  };
}

export const httpAgent = new http.Agent(agentOptions());
export const httpsAgent = new https.Agent(agentOptions());

/**
 * @param {URL|string} target
 * @returns {http.Agent}
 */
export function agentFor(target) {
  const protocol = isString(target)
    ? new URL(target).protocol
    : target.protocol;
  return protocol === "https:" ? httpsAgent : httpAgent;
}
