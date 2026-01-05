// src/cli/commands/paste.ts
import { applyDiff } from "../../core/diff";
import { readClipboard } from "../../core/clipboard";
import { validatePatches } from "../../core/schema";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import { execSync } from "child_process";
import readline from "readline";

async function confirm(msg: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${msg} (y/N): `, (ans) => {
      rl.close();
      resolve(ans.toLowerCase() === 'y');
    });
  });
}

export async function paste(dir: string, runAll = false) {
  const autoAccept = process.argv.includes("-y");
  try {
    const content = await readClipboard();
    if (!content) throw new Error("Clipboard empty");

    const { cleaned } = cleanCodeBlock(content);
    const items = validatePatches(JSON.parse(cleaned));

    for (const item of items) {
      if (item.type === 'console' && item.command) {
        if (runAll) {
          const shouldRun = autoAccept || await confirm(`> Execute: ${item.command}`);
          if (shouldRun) {
            execSync(item.command, { stdio: 'inherit', cwd: dir });
          }
        } else {
          console.log(`> Skipped command: ${item.command} (use --run)`);
        }
      } else if (item.path) {
        // Agora usamos applyDiff que aceita content null para deletar e ignora type
        applyDiff(dir, [item]);
      }
    }

    process.stdout.write("✔ Paste completed\n");
  } catch (error: any) {
    process.stderr.write(`✖ Paste failed: ${error.message}\n`);
    process.exit(1);
  }
}