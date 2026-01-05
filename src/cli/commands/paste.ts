// src/cli/commands/paste.ts
import { applyDiff } from "../../core/diff";
import { readClipboard } from "../../core/clipboard";
import { validatePatches } from "../../core/schema";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";
import * as diff from "diff";
import "colors";

async function confirm(msg: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${msg} (y/N): `, (ans) => {
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

export async function paste(dir: string, runAll = false, dryRun = false, interactiveDiff = false) {
  const autoAccept = process.argv.includes("-y");

  try {
    const content = await readClipboard();
    if (!content) throw new Error("Clipboard empty");

    const { cleaned } = cleanCodeBlock(content);
    const items = validatePatches(JSON.parse(cleaned));

    if (dryRun) process.stdout.write("--- DRY RUN MODE ---\n");

    for (const item of items) {
      if (item.type === 'console' && item.command) {
        if (dryRun) {
          process.stdout.write(`[DRY-RUN] Would execute: ${item.command}\n`);
        } else if (runAll) {
          if (autoAccept || await confirm(`> Execute: ${item.command}`)) {
            execSync(item.command, { stdio: 'inherit', cwd: dir });
          }
        }
      } else if (item.path) {
        const fullPath = path.join(dir, item.path);
        const exists = fs.existsSync(fullPath);
        const oldContent = exists ? fs.readFileSync(fullPath, 'utf8') : "";
        const newContent = item.content || "";

        if (interactiveDiff && item.content !== null) {
          showDiff(item.path, oldContent, newContent);
          if (await confirm(`Apply changes to ${item.path}?`)) {
            applyDiff(dir, [item]);
          } else {
            console.log(`Skipped: ${item.path}`);
          }
        } else if (dryRun) {
          process.stdout.write(`[DRY-RUN] Would ${item.content === null ? 'Delete' : 'Write'}: ${item.path}\n`);
        } else {
          applyDiff(dir, [item]);
        }
      }
    }

    process.stdout.write("✔ Operation completed\n");
  } catch (error: any) {
    process.stderr.write(`✘ Failed: ${error.message}\n`);
    process.exit(1);
  }
}