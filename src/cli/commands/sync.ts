// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { validatePatches } from "../../core/schema";
import { applyDiff } from "../../core/diff";
import { execSync } from "child_process";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import readline from "readline";
import { copyToClipboard, readClipboard } from "../../core/clipboard";
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

async function processInput(input: string, dir: string, runAll: boolean, dryRun: boolean, interactiveDiff: boolean) {
  const autoAccept = process.argv.includes('-y');
  const { cleaned } = cleanCodeBlock(input);
  let patchesData;
  
  try {
    patchesData = JSON.parse(cleaned);
  } catch (e) {
    return false;
  }

  const patches = validatePatches(patchesData);
  if (patches.length === 0) return false;

  for (const patch of patches) {
    if (patch.type === 'console' && patch.command) {
      if (dryRun) {
        process.stdout.write(`[DRY-RUN] Would execute: ${patch.command}\n`);
      } else if (runAll) {
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
  return true;
}

export async function sync(dir: string, runAll = false, dryRun = false, interactiveDiff = false, watch = false) {
  try {
    const snapshotBefore = scanDir(dir);
    const systemPrompt = `
YOU ARE AN AI SOFTWARE ENGINEER.
ALWAYS RESPOND USING THE FOLLOWING JSON PATCH FORMAT ONLY.

FORMAT:
[{"path": "file.ts", "content": "full code"}, {"type": "console", "command": "npm install"}]

SNAPSHOT:
${JSON.stringify(snapshotBefore, null, 2)}

PLEASE APPLY THE USER REQUESTS TO THIS SNAPSHOT AND RETURN ONLY THE JSON ARRAY.`;

    await copyToClipboard(systemPrompt);
    process.stdout.write('Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬╝Ôö£┬í├ö├Â┬úÔö£Ôòæ├ö├Â┬úÔö£├æÔö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö£ÔòæÔö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö¼Ôòæ System Prompt + Snapshot copied to clipboard.\n');

    if (watch) {
      process.stdout.write('Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬╝Ôö£┬í├ö├Â┬úÔö£Ôòæ├ö├Â┬úÔö£├æÔö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö¼┬╝Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö¼Ôòæ Watching clipboard for AI response (Press Ctrl+C to stop)...\n');
      let lastClipboard = await readClipboard();
      
      while (true) {
        await new Promise(r => setTimeout(r, 1000));
        const currentClipboard = await readClipboard();
        
        if (currentClipboard !== lastClipboard && currentClipboard.trim().length > 0) {
          lastClipboard = currentClipboard;
          const success = await processInput(currentClipboard, dir, runAll, dryRun, interactiveDiff);
          if (success) {
            process.stdout.write('Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö£├®Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬ú├ö├▓├ªÔö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö£┬í Patch applied automatically from clipboard!\n');
            const snapshotAfter = scanDir(dir);
            await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));
            process.stdout.write('Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬╝Ôö£┬í├ö├Â┬úÔö£Ôòæ├ö├Â┬úÔö£├æÔö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö£┬«Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬ú├ö├╗├å Updated snapshot copied to clipboard. Ready for next turn.\n');
          }
        }
      }
    } else {
      process.stdout.write('Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬╝Ôö£┬í├ö├Â┬úÔö£Ôòæ├ö├Â┬úÔö£├æÔö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö¼┬╝Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö¼├│ Go to your AI, paste it, copy the result, and come back here.\n');
      await confirm('Press [Enter] when you have the AI response in your clipboard...');
      
      const input = await readClipboard();
      if (!input) throw new Error("Clipboard is empty");

      const success = await processInput(input, dir, runAll, dryRun, interactiveDiff);
      
      if (success && !dryRun) {
        const snapshotAfter = scanDir(dir);
        await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));
        process.stdout.write('Ôö£├ÂÔö£├éÔö¼ÔòØ├ö├Â┬╝Ôö£┬í├ö├Â┬úÔö£Ôòæ├ö├Â┬úÔö£├æÔö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö£ÔòæÔö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö¼Ôòæ Sync applied! Updated snapshot is now in your clipboard.\n');
      }
    }
  } catch (e: any) {
    process.stderr.write(`Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬úÔö£├®Ôö£├ÂÔö£├éÔö¼├║├ö├Â┬ú├ö├Â├ëÔö£├ÂÔö£├éÔö¼├║├ö├Â┬╝Ôö¼┬ó Sync failed: ${e.message}\n`);
    process.exit(1);
  }
}