import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export async function prompt(dir: string, userPrompt: string) {
  const snapshot = scanDir(dir);

  const template = `
You are an AI software engineer.

You will receive a JSON array representing a snapshot of a codebase.
Each item has the following structure:

{
  "path": "relative/path/to/file.ext",
  "content": "full file content"
}

---

SNAPSHOT
${JSON.stringify(snapshot, null, 2)}

---

YOUR TASK
Propose changes according to the user request.

Return ONLY a JSON array of patches.

PATCH FORMAT (STRICT)
{
  "path": "relative/path/to/file.ext",
  "content": "FULL updated file content (omit for delete)"
}

IMPORTANT RULES
- Do NOT return explanations
- Do NOT return markdown
- Return ONLY valid JSON inside the \"\`\`\`\"
- Always return within a Markdown Code Block (with \"\`\`\`json\" syntax highlighting)\")

USER REQUEST
${userPrompt}
`;

  try {
    await copyToClipboard(template.trim());
    process.stdout.write(template.trim());
    process.stdout.write("\n\n✔ Prompt + Snapshot copied to clipboard\n");
  } catch (e) {
    process.stdout.write(template.trim());
    process.stderr.write("\n✖ Failed to copy to clipboard (output only)\n");
  }
}