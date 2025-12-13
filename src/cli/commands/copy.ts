import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export function copy(dir: string) {
  const snapshot = scanDir(dir);
  const clipboardJSON = JSON.stringify(snapshot, null, 2); // <- garante JSON válido
  copyToClipboard(clipboardJSON);
}
