const s = require('./coverage/coverage-summary.json');
const rows = Object.entries(s).filter(([k]) => k !== 'total').map(([k, v]) => ({
  file: k.replace(process.cwd() + '/', ''),
  stmts: v.statements.pct,
  branch: v.branches.pct,
  funcs: v.functions.pct,
  lines: v.lines.pct,
}));
rows.sort((a, b) => a.stmts - b.stmts);
for (const r of rows) {
  console.log(String(r.stmts).padStart(6), String(r.branch).padStart(6), String(r.funcs).padStart(6), String(r.lines).padStart(6), r.file);
}
