// src/core/write.ts
import fs from "fs";
import path from "path";
import { FileSnapshot } from "../types";
import { ensureGitCommit } from "./git";

export function writeFiles(basePath: string, files: FileSnapshot[], commit = true) {
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