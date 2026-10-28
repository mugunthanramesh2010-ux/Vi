import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testsDir = path.resolve('tests');
const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.mjs')).sort();

console.log('========================================================================');
console.log(`  RUNNING FULL REGRESSION SWEEP ACROSS ALL ${files.length} TEST SUITES`);
console.log('========================================================================\n');

let passed = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  process.stdout.write(`• ${file.padEnd(55)} `);
  const fullPath = path.join(testsDir, file);
  try {
    execSync(`node "${fullPath}"`, { stdio: 'pipe', encoding: 'utf8' });
    console.log('[ PASS ]');
    passed++;
  } catch (err) {
    console.log('[ FAIL ]');
    failed++;
    failures.push({ file, output: err.stdout || err.stderr || err.message });
  }
}

console.log('\n========================================================================');
console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL ${files.length} SUITES)`);
console.log('========================================================================\n');

if (failures.length > 0) {
  console.error('FAILURES:');
  for (const f of failures) {
    console.error(`\n--- ${f.file} ---`);
    console.error(f.output);
  }
  process.exit(1);
} else {
  console.log('ALL TEST SUITES PASSED CLEANLY! ZERO REGRESSIONS!');
  process.exit(0);
}
