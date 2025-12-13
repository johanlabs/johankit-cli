"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGitCommit = void 0;
// src/core/git.ts
const child_process_1 = require("child_process");
const crypto_1 = __importDefault(require("crypto"));
function getDiffHash() {
    try {
        const diff = (0, child_process_1.execSync)("git diff --staged", { encoding: "utf8" });
        if (!diff.trim())
            return null;
        return crypto_1.default
            .createHash("sha1")
            .update(diff)
            .digest("hex")
            .slice(0, 7);
    }
    catch {
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
function ensureGitCommit(message) {
    try {
        (0, child_process_1.execSync)("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
        (0, child_process_1.execSync)("git add .");
        const commitMessage = message ?? defaultCommitMessage();
        (0, child_process_1.execSync)(`git commit -m "${commitMessage}"`, { stdio: "ignore" });
    }
    catch {
        // noop: no git or nothing to commit
    }
}
exports.ensureGitCommit = ensureGitCommit;
