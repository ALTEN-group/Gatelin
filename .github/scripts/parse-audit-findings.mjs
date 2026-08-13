#!/usr/bin/env node
import fs from 'node:fs';

function parseArgs(args) {
  const options = {
    inputFile: null,
    severities: ['Critical', 'Important'],
    max: 5,
    ids: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--input' && i + 1 < args.length) {
      options.inputFile = args[++i];
    } else if (arg === '--severities' && i + 1 < args.length) {
      options.severities = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (arg === '--max' && i + 1 < args.length) {
      options.max = Number.parseInt(args[++i], 10) || 5;
    } else if (arg === '--ids' && i + 1 < args.length) {
      options.ids = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return options;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function deriveKey(location, title) {
  const filePath = location.split(':')[0].trim();
  const fileSlug = slugify(filePath);
  const titleSlug = slugify(title);
  const combined = `${fileSlug}-${titleSlug}`.replace(/^-+|-+$/g, '');
  return combined.slice(0, 60).replace(/-+$/, '');
}

function isLocationInScope(location) {
  if (!location) return false;
  // Clean backticks or whitespace
  const cleanLoc = location.replace(/`/g, '').trim();
  const filePath = cleanLoc.split(':')[0].trim();

  if (!filePath) return false;
  if (filePath.startsWith('/') || filePath.includes('..')) return false;

  const allowedPrefixes = ['src/', 'db/liquibase/'];
  return allowedPrefixes.some((prefix) => filePath.startsWith(prefix));
}

export function parseAuditReport(markdown, options = {}) {
  const {
    severities = ['Critical', 'Important'],
    max = 5,
    ids = null,
  } = options;

  let content = markdown;

  // Extract content between markers if present
  const startIdx = content.indexOf('<!-- AUDIT-REPORT:START -->');
  if (startIdx !== -1) {
    content = content.slice(startIdx + '<!-- AUDIT-REPORT:START -->'.length);
    const endIdx = content.indexOf('<!-- AUDIT-REPORT:END -->');
    if (endIdx !== -1) {
      content = content.slice(0, endIdx);
    }
  }

  // Split into sections by h2 headings
  const sectionRegex = /^##\s+([A-Za-z]+)(?:\s*\(\d+\))?/gm;
  const sections = [];
  const matches = [];
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    matches.push({
      name: match[1].trim(),
      index: match.index,
      headerLength: match[0].length,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const sectionContent = content.slice(
      current.index + current.headerLength,
      next ? next.index : content.length
    );
    sections.push({
      severity: current.name,
      content: sectionContent,
    });
  }

  const normalizedSeverities = severities.map((s) => s.toLowerCase());
  const findings = [];

  for (const section of sections) {
    if (!normalizedSeverities.includes(section.severity.toLowerCase())) {
      continue;
    }

    if (section.content.includes('_No findings._')) {
      continue;
    }

    // Split findings by h3 headings
    const rawFindings = section.content.split(/^###\s+/m).slice(1);

    for (const rawFinding of rawFindings) {
      const lines = rawFinding.trim().split('\n');
      if (lines.length === 0) continue;

      const titleLine = lines[0].trim();
      const headingMatch = titleLine.match(/^(?:(AUDIT-\d{3}):\s*)?(.+)$/);
      if (!headingMatch) continue;

      const rawId = headingMatch[1] || null;
      const title = headingMatch[2].trim();

      const bodyText = lines.slice(1).join('\n');

      const getFieldValue = (pattern) => {
        const fieldMatch = bodyText.match(pattern);
        return fieldMatch ? fieldMatch[1].trim() : '';
      };

      const locationRaw = getFieldValue(/-\s*\*\*Location:\*\*\s*`?([^`\n]+)`?/i);
      const category = getFieldValue(/-\s*\*\*Category:\*\*\s*(.+)/i);
      const evidence = getFieldValue(/-\s*\*\*Evidence:\*\*\s*(.+)/i);
      const impact = getFieldValue(/-\s*\*\*Impact:\*\*\s*(.+)/i);
      const recommendation = getFieldValue(/-\s*\*\*Recommendation:\*\*\s*(.+)/i);

      if (!isLocationInScope(locationRaw)) {
        continue;
      }

      if (ids && ids.length > 0) {
        if (!rawId || !ids.includes(rawId)) {
          continue;
        }
      }

      const key = deriveKey(locationRaw, title);

      const markdownBlock = [
        `### ${rawId ? `${rawId}: ` : ''}${title}`,
        `- **Location:** \`${locationRaw}\``,
        category ? `- **Category:** ${category}` : null,
        evidence ? `- **Evidence:** ${evidence}` : null,
        impact ? `- **Impact:** ${impact}` : null,
        recommendation ? `- **Recommendation:** ${recommendation}` : null,
      ].filter(Boolean).join('\n');

      findings.push({
        key,
        id: rawId,
        severity: section.severity,
        title,
        location: locationRaw,
        category,
        evidence,
        impact,
        recommendation,
        markdown: markdownBlock,
      });

      if (findings.length >= max) {
        break;
      }
    }

    if (findings.length >= max) {
      break;
    }
  }

  return findings;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  let rawMarkdown = '';
  if (options.inputFile) {
    rawMarkdown = fs.readFileSync(options.inputFile, 'utf8');
  } else {
    rawMarkdown = fs.readFileSync(0, 'utf8');
  }

  const findings = parseAuditReport(rawMarkdown, options);
  process.stdout.write(JSON.stringify(findings, null, 2) + '\n');
}

if (process.argv[1] && process.argv[1].endsWith('parse-audit-findings.mjs')) {
  main();
}
