import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export async function copy(dir: string, extensions?: string[]) {
  const snapshot = scanDir(dir, { extensions });
  const clipboardJSON = JSON.stringify(snapshot);
  await copyToClipboard(clipboardJSON);

  process.stdout.write(`✔ Snapshot de ${dir} copiado (${(clipboardJSON.length / 1024).toFixed(2)} KB)\n`);
}