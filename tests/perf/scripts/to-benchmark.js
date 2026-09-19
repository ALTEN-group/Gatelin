#!/usr/bin/env node
// Flattens k6 --summary-export JSON files into the flat array format expected
// by github-action-benchmark's "customSmallerIsBetter" tool.
import { readFileSync, writeFileSync } from "node:fs";

const RESULTS_DIR = "tests/perf/results";
const SCENARIOS = ["health", "login", "resource-crud"];
const OUT_FILE = `${RESULTS_DIR}/benchmark.json`;

const entries = [];

for (const scenario of SCENARIOS) {
  const file = `${RESULTS_DIR}/${scenario}.summary.json`;
  let summary;
  try {
    summary = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.warn(`skipping ${file}: not found or unreadable`);
    continue;
  }

  const duration = summary.metrics?.http_req_duration?.values || summary.metrics?.http_req_duration;
  const failed = summary.metrics?.http_req_failed?.values || summary.metrics?.http_req_failed;

  const p95 = duration?.["p(95)"];
  const failRate = failed?.rate !== undefined ? failed.rate : failed?.value;

  if (p95 !== undefined) {
    entries.push({
      name: `${scenario}: http_req_duration p95`,
      unit: "ms",
      value: Math.round(p95 * 100) / 100,
    });
  }
  if (failRate !== undefined) {
    entries.push({
      name: `${scenario}: http_req_failed rate`,
      unit: "%",
      value: Math.round(failRate * 10000) / 100,
    });
  }
}

writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2));
console.log(`wrote ${entries.length} benchmark entries to ${OUT_FILE}`);

if (entries.length === 0) {
  console.error("no benchmark entries were extracted from k6 summary files");
  process.exitCode = 1;
}
