import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export async function copy(dir: string, extensions?: string[]) {
  const snapshot = scanDir(dir, { extensions });
  const clipboardJSON = JSON.stringify(snapshot, null, 2);
  await copyToClipboard(clipboardJSON);
  process.stdout.write(`✔ Snapshot of ${dir} copied to clipboard\n`);
}