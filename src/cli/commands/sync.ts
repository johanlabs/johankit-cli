// src/cli/commands/sync.ts
import { scanDir } from "../../core/scan";
import { applyDiff } from "../../core/diff";
import { copyToClipboard } from "../../core/clipboard";
import { validatePatches } from "../../core/validation";

export async function sync(dir: string) {
  try {
    const input = await readStdin();
    let patches;
    try {
        patches = JSON.parse(input);
    } catch (e) {
        throw new Error("Invalid JSON input");
    }

    const validated = validatePatches(patches);
    applyDiff(dir, validated);

    const snapshot = scanDir(dir);
    const output = JSON.stringify(snapshot, null, 2);

    await copyToClipboard(output);

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
