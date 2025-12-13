// src/core/write.ts
import fs from "fs";
import path from "path";
import { FileSnapshot } from "../types";
import { ensureGitCommit } from "./git";

export function writeFiles(
  basePath: string,
  files: FileSnapshot[],
  commit = true
) {
  if (commit) {
    ensureGitCommit("johankit: before paste");
  }

  for (const file of files) {
    const fullPath = path.join(basePath, file.path);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.content, "utf8");
  }
}
