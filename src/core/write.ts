// src/core/write.ts
import fs from "fs";
import path from "path";
import { ensureGitCommit } from "./git";

/**
 * @deprecated Use applyDiff from core/diff for more flexibility (supports deletes and console commands).
 */
export function writeFiles(basePath: string, files: any, commit = true) {
  if (commit && files.length > 0) {
    ensureGitCommit("johankit: before write");
  }

  for (const file of files) {
    if (!file.path) continue;
    const fullPath = path.join(basePath, file.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content || "", "utf8");
  }
}