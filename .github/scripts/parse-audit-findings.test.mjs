import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAuditReport } from './parse-audit-findings.mjs';

const sampleAuditReport = `
# Weekly Audit — 2026-08-13

Some preamble text...

<!-- AUDIT-REPORT:START -->
## Executive Summary
Audit found several issues in src/ and db/liquibase/.

## Critical
### AUDIT-001: SQL injection in user authentication
- **Location:** \`src/routes/auth.js:42\`
- **Category:** Security
- **Evidence:** User input interpolated into SQL query string without escaping.
- **Impact:** Authentication bypass and data exfiltration.
- **Recommendation:** Use parameterized SQL query.

## Important (2)
### AUDIT-002: Missing rate limit on password reset endpoint
- **Location:** \`src/routes/password.js:15\`
- **Category:** Security
- **Evidence:** Rate limiter middleware omitted.
- **Impact:** Brute-force attacks against password reset.
- **Recommendation:** Apply express-rate-limit.

### Un-numbered finding title
- **Location:** \`db/liquibase/changelog-1.0.xml:88\`
- **Category:** Database
- **Evidence:** Missing index on user_id foreign key.
- **Impact:** Slow queries under load.
- **Recommendation:** Add index tag.

### Out of scope location finding
- **Location:** \`package.json:10\`
- **Category:** Quality
- **Evidence:** Out of scope file.
- **Impact:** None.
- **Recommendation:** Ignore.

## Suggestions
_No findings._
<!-- AUDIT-REPORT:END -->
`;

test('parses findings with default options (Critical and Important only, max 5)', () => {
  const findings = parseAuditReport(sampleAuditReport);
  assert.equal(findings.length, 3);

  assert.equal(findings[0].id, 'AUDIT-001');
  assert.equal(findings[0].severity, 'Critical');
  assert.equal(findings[0].title, 'SQL injection in user authentication');
  assert.equal(findings[0].location, 'src/routes/auth.js:42');
  assert.equal(findings[0].key, 'src-routes-auth-js-sql-injection-in-user-authentication');

  assert.equal(findings[1].id, 'AUDIT-002');
  assert.equal(findings[1].severity, 'Important');

  assert.equal(findings[2].id, null);
  assert.equal(findings[2].title, 'Un-numbered finding title');
  assert.equal(findings[2].location, 'db/liquibase/changelog-1.0.xml:88');
});

test('respects max option', () => {
  const findings = parseAuditReport(sampleAuditReport, { max: 1 });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].id, 'AUDIT-001');
});

test('respects severities option', () => {
  const findings = parseAuditReport(sampleAuditReport, { severities: ['Critical'] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].severity, 'Critical');
});

test('filters by ids when provided', () => {
  const findings = parseAuditReport(sampleAuditReport, { ids: ['AUDIT-002'] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].id, 'AUDIT-002');
});

test('handles missing END marker gracefully', () => {
  const reportWithoutEnd = `
<!-- AUDIT-REPORT:START -->
## Critical
### AUDIT-001: SQL injection in user authentication
- **Location:** \`src/routes/auth.js:42\`
- **Category:** Security
- **Evidence:** User input interpolated into SQL query string without escaping.
- **Impact:** Authentication bypass and data exfiltration.
- **Recommendation:** Use parameterized SQL query.
`;
  const findings = parseAuditReport(reportWithoutEnd);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].id, 'AUDIT-001');
});

test('filters out path traversal or out-of-scope locations', () => {
  const reportPathTraversal = `
<!-- AUDIT-REPORT:START -->
## Critical
### AUDIT-001: Path traversal attempt in report
- **Location:** \`../etc/passwd:1\`
- **Category:** Security
- **Evidence:** Malicious path.
- **Impact:** System compromised.
- **Recommendation:** Reject.

### AUDIT-002: Absolute path attempt
- **Location:** \`/src/routes/auth.js:1\`
- **Category:** Security
- **Evidence:** Absolute path.
- **Impact:** High.
- **Recommendation:** Reject.
`;
  const findings = parseAuditReport(reportPathTraversal);
  assert.equal(findings.length, 0);
});
