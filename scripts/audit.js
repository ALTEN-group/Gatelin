// scripts/audit.js
// Weekly AI audit — runs checks on main, calls GitHub Copilot CLI to summarize
// them, and posts a Markdown report as a GitHub issue.

import { Octokit } from '@octokit/rest';
import { execSync, execFileSync } from 'node:child_process';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'OWNER/REPO').split('/');

function run(cmd) {
  try {
    return execSync(cmd, {
      stdio: 'pipe',
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e) {
    return (e.stdout || e.message || '').toString().trim();
  }
}

function callCopilot(prompt) {
  const hasToken =
    process.env.COPILOT_GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!hasToken)
    return '_No Copilot-capable token configured (`COPILOT_GITHUB_TOKEN`/`GH_TOKEN`/`GITHUB_TOKEN`) — skipping Copilot summary._';

  try {
    // No --allow-tool grants: the prompt is self-contained (raw report inline),
    // so Copilot only needs to reason over text, not touch the filesystem or shell.
    const modelArgs = process.env.COPILOT_AUDITS_MODEL ? ['--model', process.env.COPILOT_AUDITS_MODEL] : [];
    const output = execFileSync('copilot', ['-p', prompt, '-s', '--no-ask-user', ...modelArgs], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
    return output || '_No content returned._';
  } catch (e) {
    return `_Copilot CLI call failed: ${(e.stderr || e.message || '').toString().trim()}_`;
  }
}

async function runAudit() {
  const date = new Date().toISOString().slice(0, 10);

  const checks = [
    {
      label: 'Tests',
      cmd: "NODE_OPTIONS='--experimental-vm-modules' npm test || true",
    },
    { label: 'npm audit', cmd: 'npm audit || true' },
    { label: 'Lint (Biome)', cmd: 'npx biome check . || true' },
    { label: 'Outdated dependencies', cmd: 'npm outdated || true' },
    { label: 'TODOs / FIXMEs', cmd: 'git grep -n "TODO\\|FIXME" -- src/ || true' },
  ];

  const rawParts = [`# Weekly Audit — ${date}`, ''];

  for (const { label, cmd } of checks) {
    const output = run(cmd);
    rawParts.push(`## ${label}`);
    rawParts.push('```');
    rawParts.push(output || '(no output)');
    rawParts.push('```');
    rawParts.push('');
  }

  const rawReport = rawParts.join('\n');

  const prompt = `You are a concise codebase auditor.
   Only audit src/ folder.
   Only report issues, no positive findings.
   Do not run npm audit / npm outdated, npx biome check and npm test.
   Summarize this project audit and produce a Markdown report with: a 2-line executive summary,
   top findings (bullet list), and prioritized action items (High / Medium / Low severity).`;

  const summary = callCopilot(prompt);
  const body = `${rawReport}\n---\n\n## Copilot Summary\n\n${summary}`;

  if (process.env.DRY_RUN === 'true') {
    console.log('DRY RUN — report preview:\n');
    console.log(body.slice(0, 4000));
    return;
  }

  const { data: issue } = await octokit.issues.create({
    owner,
    repo,
    title: `Weekly Audit — ${date}`,
    body,
    labels: ['audit'],
  });

  console.log(`Audit issue created: ${issue.html_url}`);
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
