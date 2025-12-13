// src/core/scan.ts
import fs from "fs";
import path from "path";
import { FileSnapshot, ScanOptions } from "../types";

export function scanDir(
  basePath: string,
  options: ScanOptions = {}
): FileSnapshot[] {
  const result: FileSnapshot[] = [];
  const base = path.resolve(basePath);

  const exts = options.extensions?.map(e =>
    e.startsWith(".") ? e : `.${e}`
  );

  // Default ignores
  const ignoreSet = new Set([
    "node_modules", ".git", "dist", "build", ".DS_Store", "coverage", ".env", "yarn.lock",
  ]);

  // Read .gitignore if exists
  const gitignorePath = path.join(base, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    try {
      const lines = fs.readFileSync(gitignorePath, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          ignoreSet.add(trimmed.replace(/^\//, "").replace(/\/$/, ""));
        }
      }
    } catch (e) {
      // ignore read errors
    }
  }
  
  function shouldIgnore(name: string): boolean {
    if (ignoreSet.has(name)) return true;
    for (const pattern of ignoreSet) {
       if (pattern.startsWith("*") && name.endsWith(pattern.slice(1))) return true;
       if (name.startsWith(pattern + "/")) return true;
    }
    return false;
  }

  function loop(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;

      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        loop(fullPath);
      } else {
        if (exts && !exts.includes(path.extname(entry.name))) continue;

        result.push({
          path: path.relative(base, fullPath).replace(/\\/g, "/"),
          content: fs.readFileSync(fullPath, "utf8"),
        });
      }
    }
  }

  loop(base);
  return result;
}
