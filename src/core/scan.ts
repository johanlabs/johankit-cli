// src/core/scan.ts
import fs from "fs";
import path from "path";
import { FileSnapshot, ScanOptions } from "../types";

export function scanDir(basePath: string, options: ScanOptions = {}): FileSnapshot[] {
  const result: FileSnapshot[] = [];
  const base = path.resolve(basePath);
  const exts = options.extensions?.map(e => e.startsWith(".") ? e : `.${e}`);

  const ignorePatterns = ["node_modules", ".git", "dist", "build", ".DS_Store", "coverage", ".env", "yarn.lock"];
  const gitignorePath = path.join(base, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    try {
      const lines = fs.readFileSync(gitignorePath, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          ignorePatterns.push(trimmed.replace(/^\//, "").replace(/\/$/, ""));
        }
      }
    } catch (e) {}
  }

  function loop(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(base, fullPath).replace(/\\/g, "/");

      if (ignorePatterns.some(p => relPath === p || relPath.startsWith(p + "/"))) continue;

      if (entry.isDirectory()) {
        loop(fullPath);
      } else {
        if (exts && !exts.includes(path.extname(entry.name))) continue;

        result.push({
          path: relPath,
          content: fs.readFileSync(fullPath, "utf8"),
        });
      }
    }
  }

  loop(base);
  return result;
}