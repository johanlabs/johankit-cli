// src/cli/commands/sync.ts
import { scanDir } from "core/scan";
import { validatePatches } from "core/schema";
import { applyDiff } from "core/diff";
import { execSync } from "child_process";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import readline from "readline";

import { copyToClipboard } from "core/clipboard";

async function confirm(msg: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${msg} (y/N): `, (ans) => {
      rl.close();
      resolve(ans.toLowerCase() === 'y');
    });
  });
}

export async function sync(dir: string, runAll = false) {
  const autoAccept = process.argv.includes("-y");
  try {
    const snapshotBefore = scanDir(dir);
    const template = `
// ... (template mantido) ...
${JSON.stringify(snapshotBefore, null, 2)}
`;

    await copyToClipboard(template.trim());
    process.stdout.write("✔ Prompt with snapshot copied to clipboard. Paste the response here and press Enter (Ctrl+D to finish):\n");

    const input = await readStdin();
    const { cleaned } = cleanCodeBlock(input);
    const patches = validatePatches(JSON.parse(cleaned));

    for (const patch of patches) {
      if (patch.type === 'console' && patch.command) {
        if (runAll) {
          const shouldRun = autoAccept || await confirm(`> Execute: ${patch.command}`);
          if (shouldRun) execSync(patch.command, { stdio: 'inherit', cwd: dir });
        } else {
          console.log(`> Skipped command: ${patch.command} (use --run)`);
        }
      } else if (patch.path) {
        applyDiff(dir, [patch]);
      }
    }

    const snapshotAfter = scanDir(dir);
    await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));
    process.stdout.write("✔ Sync applied and new snapshot copied to clipboard\n");
  } catch (error: any) {
    process.stderr.write(`✖ Sync failed: ${error.message}\n`);
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise(resolve => {
    let data = "";
    process.stdin.on("data", c => (data += c));
    process.stdin.on("end", () => resolve(data));
  });
}