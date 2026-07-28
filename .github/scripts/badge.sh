#!/usr/bin/env bash
set -euo pipefail

SUMMARY=tests/coverage/coverage-summary.json
PCT=$(node -e "const c=require('./$SUMMARY').total; process.stdout.write(String(c.functions.pct))")

if   awk "BEGIN { exit !($PCT >= 90) }"; then COLOR="4c1"
elif awk "BEGIN { exit !($PCT >= 70) }"; then COLOR="dfb317"
else COLOR="e05d44"
fi

SVG_FILE=$(mktemp)
cat > "$SVG_FILE" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="130" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="130" height="20" fill="#555"/>
  <rect rx="3" x="63" width="67" height="20" fill="#${COLOR}"/>
  <rect x="63" width="4" height="20" fill="#${COLOR}"/>
  <rect rx="3" width="130" height="20" fill="url(#s)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="32" y="15" fill="#010101" fill-opacity=".3">coverage</text>
    <text x="32" y="14">coverage</text>
    <text x="96" y="15" fill="#010101" fill-opacity=".3">${PCT}%</text>
    <text x="96" y="14">${PCT}%</text>
  </g>
</svg>
SVGEOF

git config user.name  "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git fetch origin badges 2>/dev/null || true

if git ls-remote --exit-code origin badges >/dev/null 2>&1; then
  git worktree add /tmp/badges origin/badges
else
  git worktree add --orphan -b badges /tmp/badges
fi

mkdir -p /tmp/badges/badges
cp "$SVG_FILE" /tmp/badges/badges/coverage.svg

cd /tmp/badges
git add badges/coverage.svg
git diff --cached --quiet || git commit -m "chore: update coverage badge [skip ci]"
git push origin badges
