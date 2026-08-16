#!/usr/bin/env bash
set -euo pipefail

# Defaults match the backend Jest coverage layout.
SUMMARY="${SUMMARY:-tests/coverage/coverage-summary.json}"
BADGE_NAME="${BADGE_NAME:-coverage.svg}"
BADGE_LABEL="${BADGE_LABEL:-coverage}"

PCT=$(node -e "const c=require('./$SUMMARY').total; process.stdout.write(String(c.functions.pct))")

if awk "BEGIN { exit !($PCT >= 50) }"; then COLOR="4c1"
else COLOR="e05d44"
fi

# Size the badge from the text so longer labels (e.g. "Gateway coverage")
# don't clip. ~6.5px/char approximates DejaVu Sans at 11px; PAD is the
# breathing room on each side of a text segment.
CHAR_W=6.5
PAD=10
VALUE_TEXT="${PCT}%"

LABEL_WIDTH=$(awk -v s="$BADGE_LABEL" -v cw="$CHAR_W" -v pad="$PAD" 'BEGIN { printf "%d", (length(s) * cw) + pad }')
VALUE_WIDTH=$(awk -v s="$VALUE_TEXT" -v cw="$CHAR_W" -v pad="$PAD" 'BEGIN { printf "%d", (length(s) * cw) + pad }')
TOTAL_WIDTH=$((LABEL_WIDTH + VALUE_WIDTH))
LABEL_X=$((LABEL_WIDTH / 2))
VALUE_X=$((LABEL_WIDTH + VALUE_WIDTH / 2))

SVG_FILE=$(mktemp)
cat > "$SVG_FILE" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="${TOTAL_WIDTH}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${TOTAL_WIDTH}" height="20" fill="#555"/>
  <rect rx="3" x="${LABEL_WIDTH}" width="$((TOTAL_WIDTH - LABEL_WIDTH))" height="20" fill="#${COLOR}"/>
  <rect x="${LABEL_WIDTH}" width="4" height="20" fill="#${COLOR}"/>
  <rect rx="3" width="${TOTAL_WIDTH}" height="20" fill="url(#s)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${LABEL_X}" y="15" fill="#010101" fill-opacity=".3">${BADGE_LABEL}</text>
    <text x="${LABEL_X}" y="14">${BADGE_LABEL}</text>
    <text x="${VALUE_X}" y="15" fill="#010101" fill-opacity=".3">${PCT}%</text>
    <text x="${VALUE_X}" y="14">${PCT}%</text>
  </g>
</svg>
SVGEOF

git config user.name  "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git fetch origin badges 2>/dev/null || true

if git ls-remote --exit-code origin badges >/dev/null 2>&1; then
  git worktree add /tmp/badges origin/badges
else
  git worktree add --orphan -b badges /tmp/badges
fi

mkdir -p /tmp/badges/badges
cp "$SVG_FILE" "/tmp/badges/badges/${BADGE_NAME}"

cd /tmp/badges
git add "badges/${BADGE_NAME}"
git diff --cached --quiet || git commit -m "chore: update ${BADGE_NAME} [skip ci]"
git push origin HEAD:badges
