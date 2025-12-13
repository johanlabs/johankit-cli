// src/core/diff.ts
import fs from "fs";
import path from "path";

export interface DiffPatch {
  type: "modify" | "create" | "delete";
  path: string;
  content?: string;
}

export function applyDiff(basePath: string, patches: DiffPatch[]) {
  for (const patch of patches) {
    const fullPath = path.join(basePath, patch.path);

    switch (patch.type) {
      case "delete": {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        break;
      }

      case "create":
      case "modify": {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, patch.content ?? "", "utf8");
        break;
      }
    }
  }
}
