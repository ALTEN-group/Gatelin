window.BENCHMARK_DATA = {
  "lastUpdate": 1790146772550,
  "repoUrl": "https://github.com/ALTEN-group/Gatelin",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "name": "LCluber",
            "username": "LCluber",
            "email": "ludovic.cluber@gmail.com"
          },
          "committer": {
            "name": "LCluber",
            "username": "LCluber",
            "email": "ludovic.cluber@gmail.com"
          },
          "id": "f41031c2ef11300f3d79c0fa39f52b0744f6444d",
          "message": "chore: add user configuration for k6 container to ensure proper permissions",
          "timestamp": "2026-09-16T14:07:09Z",
          "url": "https://github.com/ALTEN-group/Gatelin/commit/f41031c2ef11300f3d79c0fa39f52b0744f6444d"
        },
        "date": 1789569021918,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "health: http_req_duration p95",
            "value": 3.96,
            "unit": "ms"
          },
          {
            "name": "health: http_req_failed rate",
            "value": 0,
            "unit": "%"
          },
          {
            "name": "login: http_req_duration p95",
            "value": 219.02,
            "unit": "ms"
          },
          {
            "name": "login: http_req_failed rate",
            "value": 0,
            "unit": "%"
          },
          {
            "name": "resource-crud: http_req_duration p95",
            "value": 6.79,
            "unit": "ms"
          },
          {
            "name": "resource-crud: http_req_failed rate",
            "value": 0,
            "unit": "%"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Ludovic CLUBER",
            "username": "LCluber",
            "email": "LCluber@users.noreply.github.com"
          },
          "committer": {
            "name": "GitHub",
            "username": "web-flow",
            "email": "noreply@github.com"
          },
          "id": "d33db0492dee99c8b80023717a207b1740ae64a7",
          "message": "chore: update mock user credentials and dependencies in setup scripts (#144)\n\n* chore: update mock user credentials and dependencies in setup scripts\n\n* chore: update dependencies in apm.yml for performance and fuzz tests\n\n* chore: enhance performance testing scripts with benchmark conversion and error handling\n\n* chore: update checkout action to support manual dispatch targeting any branch\n\n* chore: add user configuration for k6 container to ensure proper permissions\n\n* feat: add agents and instructions for audit fixing, code auditing, fuzz testing, and performance testing\n\n- Introduced `Audit Finding Fixer` agent for remediating individual audit findings with minimal changes.\n- Added `Code Auditor` agent for conducting complete, evidence-based code audits.\n- Created `Fuzz Tester` agent for designing and implementing fuzz-testing suites for applications.\n- Implemented `Performance Tester` agent for creating performance-test suites tailored to specific services.\n- Established detailed instructions for k6 performance tests and RESTler fuzzing tests, including architecture, scenarios, authentication, and CI integration.\n- Added command prompts for fuzz tests and performance tests to facilitate user interaction.\n\n* chore: pin APM CLI installation to specific version for reproducibility\n\n* chore: remove APM CLI installation steps from weekly audit workflow\n\n* chore: update agent names in audit workflows for clarity\n\n* chore: enhance audit report validation and retry mechanism\n\n* chore: update mock credentials and dependencies for audit reporting\n\n* docs: add Roles & Permissions feature to documentation\n\n* feat: Introduce E2E Tester agent for Playwright end-to-end testing\n\n- Updated references from Unit Tester to E2E Tester in angular-e2e-tests documentation and prompts.\n- Modified VitePress documentation to reflect changes in development port.\n- Added new E2E Tester agent files in .claude, .cursor, and .github directories.\n- Updated apm.lock.yaml and apm.yml to include new E2E Tester agent.\n- Ensured all related dependencies and content hashes are updated accordingly.",
          "timestamp": "2026-09-22T14:38:59Z",
          "url": "https://github.com/ALTEN-group/Gatelin/commit/d33db0492dee99c8b80023717a207b1740ae64a7"
        },
        "date": 1790146770958,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "health: http_req_duration p95",
            "value": 2.92,
            "unit": "ms"
          },
          {
            "name": "health: http_req_failed rate",
            "value": 0,
            "unit": "%"
          },
          {
            "name": "login: http_req_duration p95",
            "value": 219.05,
            "unit": "ms"
          },
          {
            "name": "login: http_req_failed rate",
            "value": 0,
            "unit": "%"
          },
          {
            "name": "resource-crud: http_req_duration p95",
            "value": 5.85,
            "unit": "ms"
          },
          {
            "name": "resource-crud: http_req_failed rate",
            "value": 0,
            "unit": "%"
          }
        ]
      }
    ]
  }
}