// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { validatePatches } from "../../core/validation";
import { writeFiles } from "../../core/write";
import { applyDiff } from "../../core/diff";
import { copyToClipboard } from "../../core/clipboard";
import { execSync } from "child_process";

export async function sync(dir: string, runAll = false) {
  try {
    const snapshotBefore = scanDir(dir);

    const template = `
You are an AI software engineer.

You will receive a JSON array representing a snapshot of a codebase.
Each item has the following structure:

\`\`\`json
{
  "path": "relative/path/to/file.ext",
  "content": "full file content"
}
\`\`\`

---

SNAPSHOT
${JSON.stringify(snapshotBefore, null, 2)}

---

YOUR TASK
Propose changes according to the user request.

Return ONLY a JSON array of patches or console commands.

PATCH FORMAT (STRICT)
{
  "path": "relative/path/to/file.ext",
  "content": "FULL updated file content (omit for delete)"
}
OR
{
  "type": "console",
  "command": "shell command to run"
}

IMPORTANT RULES
- Do NOT return explanations
- Do NOT return markdown
- Return ONLY valid JSON

USER REQUEST
<Replace this with the user request>
`;

    await copyToClipboard(template.trim());
    process.stdout.write("✔ Prompt with snapshot copied to clipboard\n");

    const input = await readStdin();

    let patches;
    try {
      patches = JSON.parse(input);
    } catch {
      throw new Error("Invalid JSON input");
    }

    const validated = validatePatches(patches);

    for (const patch of validated) {
      if (patch.type === 'console') {
        if (runAll) {
          console.log(`> Executing: ${patch.command}`);
          execSync(patch.command, { stdio: 'inherit', cwd: dir });
        } else {
          console.log(`> Skipped command: ${patch.command} (use flag to run)`);
        }
      } else {
        applyDiff(dir, [patch]);
      }
    }

    const snapshotAfter = scanDir(dir);
    await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));

    process.stdout.write("��� Sync applied and new snapshot copied to clipboard\n");
  } catch (error) {
    process.stderr.write("✖ Sync failed\n");
    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`);
    }
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