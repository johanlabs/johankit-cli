import { scanDir } from "../../core/scan";
import { copyToClipboard } from "../../core/clipboard";

export function copy(input: string | string[]) {
  let snapshot;

  if (Array.isArray(input)) {
    snapshot = input.map(path => {
      const fileSnapshot = scanDir(path);
      if (fileSnapshot.length !== 1) {
        throw new Error(`Expected single file for path: ${path}`);
      }
      return fileSnapshot[0];
    });
  } else {
    const stat = scanDir(input);
    snapshot = stat.length === 1 ? stat : scanDir(input);
  }

  const clipboardJSON = JSON.stringify(snapshot, null, 2); // <- garante JSON válido
  copyToClipboard(clipboardJSON);
}