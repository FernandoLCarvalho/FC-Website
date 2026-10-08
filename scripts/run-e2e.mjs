import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cli = require.resolve("@playwright/test/cli");
const args = process.argv.slice(2);
// Separate processes keep visual captures serial and ensure a functional failure
// cannot suppress visual coverage. Preserve both phases' reports and exit status.
const phases = [
  ["functional", ["--project=*-functional"]],
  ["visual", ["--project=desktop", "--project=mobile", "--project=mobile-landscape", "--workers=1"]],
];
let failed = false;
for (const [phase, projects] of phases) {
  const result = spawnSync(process.execPath, [cli, "test", ...args, ...projects, `--output=test-results/${phase}`], {
    stdio: "inherit",
    env: {
      ...process.env,
      PLAYWRIGHT_HTML_OUTPUT_DIR: `playwright-report/${phase}`,
    },
  });
  if (result.error) console.error(result.error);
  if (result.signal) process.exit(1);
  failed ||= result.status !== 0;
}
process.exitCode = failed ? 1 : 0;
