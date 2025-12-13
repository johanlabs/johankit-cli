// src/core/git.ts
import { execSync } from "child_process";
import crypto from "crypto";

function getDiffHash() {
  try {
    const diff = execSync("git diff --staged", { encoding: "utf8" });
    if (!diff.trim()) return null;

    return crypto
      .createHash("sha1")
      .update(diff)
      .digest("hex")
      .slice(0, 7);
  } catch {
    return null;
  }
}

function defaultCommitMessage(prefix = "Auto Commit") {
  const timestamp = new Date().toISOString().slice(0, 16);
  const diffHash = getDiffHash();

  return diffHash
    ? `${prefix}: ${timestamp} · ${diffHash}`
    : `${prefix}: ${timestamp}`;
}

export function ensureGitCommit(message?: string) {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    execSync("git add .");

    const commitMessage = message ?? defaultCommitMessage();
    execSync(`git commit -m "${commitMessage}"`, { stdio: "ignore" });
  } catch {
    // noop: no git or nothing to commit
  }
}
