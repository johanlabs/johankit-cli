// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { applyDiff } from "../../core/diff";
import { copyToClipboard } from "../../core/clipboard";
import { validatePatches } from "../../core/validation";
import { writeFiles } from "../../core/write";
import { runInVm } from "../../core/vm";

export async function sync(dir: string) {
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

Return ONLY a JSON array of patches.

PATCH FORMAT (STRICT)
{
  \"path\": \"relative/path/to/file.ext\",
  \"content\": \"FULL updated file content (omit for delete)\"
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
      patches = runInVm(`module.exports = function() { return ${input}; }`)();
    } catch {
      throw new Error("Invalid JSON input or execution in VM failed");
    }

    const validated = validatePatches(patches);
    applyDiff(dir, validated);

    const snapshotAfter = scanDir(dir);
    await copyToClipboard(JSON.stringify(snapshotAfter, null, 2));

    process.stdout.write("✔ Sync applied and new snapshot copied to clipboard\n");
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