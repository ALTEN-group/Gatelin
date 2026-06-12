// scripts/audit.js
// Monthly AI audit — runs checks on main, calls GitHub Copilot (via GitHub Models API),
// and posts a Markdown report as a GitHub issue.

import { Octokit } from '@octokit/rest';
import { execSync } from 'node:child_process';

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

async function callCopilot(prompt) {
  const token = process.env.GITHUB_MODELS_TOKEN;
  if (!token) return '_No `GITHUB_MODELS_TOKEN` configured — skipping Copilot summary._';

  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a concise codebase auditor. Produce a Markdown report with: a 2-line executive summary, top findings (bullet list), and prioritized action items (High / Medium / Low severity).',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return `_Copilot API call failed (${res.status}): ${err}_`;
  }

  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() || '_No content returned._';
}

async function runAudit() {
  const date = new Date().toISOString().slice(0, 10);

  const checks = [
    {
      label: 'Tests',
      cmd: "NODE_OPTIONS='--experimental-vm-modules' npm test --silent || true",
    },
    { label: 'npm audit', cmd: 'npm audit || true' },
    { label: 'Lint (Biome)', cmd: 'npx biome check . || true' },
    { label: 'Outdated dependencies', cmd: 'npm outdated || true' },
    { label: 'TODOs / FIXMEs', cmd: 'git grep -n "TODO\\|FIXME" -- src/ || true' },
  ];

  const rawParts = [`# Monthly Audit — ${date}`, ''];

  for (const { label, cmd } of checks) {
    const output = run(cmd);
    rawParts.push(`## ${label}`);
    rawParts.push('```');
    rawParts.push(output || '(no output)');
    rawParts.push('```');
    rawParts.push('');
  }

  const rawReport = rawParts.join('\n');

  const prompt = `Summarize this project audit and produce a Markdown report.

${rawReport.slice(0, 12000)}`;

  const summary = await callCopilot(prompt);
  const body = `${rawReport}\n---\n\n## Copilot Summary\n\n${summary}`;

  if (process.env.DRY_RUN === 'true') {
    console.log('DRY RUN — report preview:\n');
    console.log(body.slice(0, 4000));
    return;
  }

  const { data: issue } = await octokit.issues.create({
    owner,
    repo,
    title: `Monthly Audit — ${date}`,
    body,
    labels: ['audit'],
  });

  console.log(`Audit issue created: ${issue.html_url}`);
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
