// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { validatePatches } from "../../core/schema";
import { applyDiff } from "../../core/diff";
import { execSync } from "child_process";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import readline from "readline";
import { copyToClipboard } from "../../core/clipboard";

async function confirm(msg: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${msg} (y/N): `, ans => {
      rl.close();
      resolve(ans.toLowerCase() === 'y');
    });
  });
}

export async function sync(dir: string, runAll = false, dryRun = false) {
  const autoAccept = process.argv.includes('-y');
  try {
    const snapshotBefore = scanDir(dir);
    await copyToClipboard(JSON.stringify(snapshotBefore, null, 2));
    process.stdout.write('✔ Snapshot copied. Paste AI response and press Ctrl+D\n');

    const input = await readStdin();
    const { cleaned } = cleanCodeBlock(input);
    const patches = validatePatches(JSON.parse(cleaned));

    if (dryRun) {
      process.stdout.write("--- DRY RUN MODE ---\n");
    }

    for (const patch of patches) {
      if (patch.type === 'console' && patch.command) {
        if (dryRun) {
          process.stdout.write(`[DRY-RUN] Would execute: ${patch.command}\n`);
          continue;
        }
        if (runAll) {
          const ok = autoAccept || await confirm(`> Execute: ${patch.command}`);
          if (ok) execSync(patch.command, { stdio: 'inherit', cwd: dir });
        }
      } else if (patch.path) {
        if (dryRun) {
          const action = patch.content === null ? "Delete" : "Write";
          process.stdout.write(`[DRY-RUN] Would ${action}: ${patch.path}\n`);
        } else {
          applyDiff(dir, [patch]);
        }
      }
    }

    if (!dryRun) {
      const snapshotAfter = scanDir(dir);
      await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));
      process.stdout.write('✔ Sync applied and new snapshot copied\n');
    } else {
      process.stdout.write('--- DRY RUN COMPLETED (Snapshot not updated) ---\n');
    }
  } catch (e: any) {
    process.stderr.write(`✘ Sync failed: ${e.message}\n`);
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise(resolve => {
    let data = '';
    process.stdin.on('data', c => (data += c));
    process.stdin.on('end', () => resolve(data));
  });
}