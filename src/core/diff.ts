// src/core/diff.ts
import fs from "fs";
import path from "path";
import { PatchItem } from "./schema";

export function applyDiff(basePath: string, patches: PatchItem[]) {
  for (const patch of patches) {
    if (!patch.path) continue;
    const fullPath = path.join(basePath, patch.path);

    if (patch.content === null || patch.content === undefined) {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } else {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, patch.content, "utf8");
    }
  }
}