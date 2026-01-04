"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = sync;
// src/cli/commands/sync.ts
const scan_1 = require("../../core/scan");
const diff_1 = require("../../core/diff");
const clipboard_1 = require("../../core/clipboard");
const validation_1 = require("../../core/validation");
const vm_1 = require("../../core/vm");
async function sync(dir) {
    try {
        const snapshotBefore = (0, scan_1.scanDir)(dir);
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
        await (0, clipboard_1.copyToClipboard)(template.trim());
        process.stdout.write("✔ Prompt with snapshot copied to clipboard\n");
        const input = await readStdin();
        let patches;
        try {
            patches = (0, vm_1.runInVm)(`module.exports = function() { return ${input}; }`)();
        }
        catch {
            throw new Error("Invalid JSON input or execution in VM failed");
        }
        const validated = (0, validation_1.validatePatches)(patches);
        (0, diff_1.applyDiff)(dir, validated);
        const snapshotAfter = (0, scan_1.scanDir)(dir);
        await (0, clipboard_1.copyToClipboard)(JSON.stringify(snapshotAfter, null, 2));
        process.stdout.write("✔ Sync applied and new snapshot copied to clipboard\n");
    }
    catch (error) {
        process.stderr.write("✖ Sync failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}
function readStdin() {
    return new Promise(resolve => {
        let data = "";
        process.stdin.on("data", c => (data += c));
        process.stdin.on("end", () => resolve(data));
    });
}
