// src/cli/commands/copy.ts
import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export async function copy(dir: string, exts?: string[]) {
  try {
    const files = scanDir(dir, { extensions: exts });
    const output = JSON.stringify(files, null, 2);

    await copyToClipboard(output);

    process.stdout.write("✔ Copied to clipboard\n");
  } catch (error) {
    process.stderr.write("✖ Clipboard copy failed\n");

    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`);
    }

    process.exit(1);
  }
}
