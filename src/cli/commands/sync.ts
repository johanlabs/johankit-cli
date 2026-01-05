// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { validatePatches } from "../../core/schema";
import { applyDiff } from "../../core/diff";
import { execSync } from "child_process";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import readline from "readline";
import { copyToClipboard } from "../../core/clipboard";
import fs from "fs";
import path from "path";
import * as diff from "diff";
import "colors";

async function confirm(msg: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${msg} (y/N): `, ans => {
      rl.close();
      resolve(ans.toLowerCase() === 'y');
    });
  });
}

function showDiff(filename: string, oldContent: string, newContent: string) {
  console.log(`\n--- DIFF FOR: ${filename.bold} ---`);
  const patches = diff.diffLines(oldContent, newContent);
  patches.forEach((part) => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'gray';
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    const value = part.value.endsWith('\n') ? part.value : part.value + '\n';
    process.stdout.write((value.split('\n').map(line => line ? `${prefix}${line}` : '').join('\n'))[color as any]);
  });
  console.log('\n-----------------------');
}

export async function sync(dir: string, runAll = false, dryRun = false, interactiveDiff = false) {
  const autoAccept = process.argv.includes('-y');
  try {
    const snapshotBefore = scanDir(dir);
    await copyToClipboard(JSON.stringify(snapshotBefore, null, 2));
    process.stdout.write('✔ Snapshot copied. Paste AI response and press Ctrl+D (or Ctrl+Z on Win)\n');

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
        const fullPath = path.join(dir, patch.path);
        const exists = fs.existsSync(fullPath);
        const oldContent = exists ? fs.readFileSync(fullPath, 'utf8') : "";
        const newContent = patch.content || "";

        if (interactiveDiff && patch.content !== null) {
          showDiff(patch.path, oldContent, newContent);
          if (await confirm(`Apply changes to ${patch.path}?`)) {
            applyDiff(dir, [patch]);
          } else {
            console.log(`Skipped: ${patch.path}`);
          }
        } else if (dryRun) {
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
      process.stdout.write('--- DRY RUN COMPLETED ---\n');
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