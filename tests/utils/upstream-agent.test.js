/**
 * @jest-environment node
 */

import http from "node:http";
import https from "node:https";
import { agentFor, httpAgent, httpsAgent } from "../../src/utils/upstream-agent.js";

describe("upstream-agent", () => {
  it("reuses a keep-alive HTTP agent for http URLs", () => {
    expect(httpAgent).toBeInstanceOf(http.Agent);
    expect(httpAgent.keepAlive).toBe(true);
    expect(agentFor(new URL("http://foxnox:3000/pwd"))).toBe(httpAgent);
    expect(agentFor("http://foxnox:3000/pwd")).toBe(httpAgent);
  });

  it("reuses a keep-alive HTTPS agent for https URLs", () => {
    expect(httpsAgent).toBeInstanceOf(https.Agent);
    expect(httpsAgent.keepAlive).toBe(true);
    expect(agentFor(new URL("https://internal.example/v1"))).toBe(httpsAgent);
  });
});
