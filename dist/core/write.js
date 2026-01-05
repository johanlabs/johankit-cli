"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFiles = writeFiles;
// src/core/write.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const git_1 = require("./git");
/**
 * @deprecated Use applyDiff from core/diff for more flexibility (supports deletes and console commands).
 */
function writeFiles(basePath, files, commit = true) {
    if (commit && files.length > 0) {
        (0, git_1.ensureGitCommit)("johankit: before write");
    }
    for (const file of files) {
        if (!file.path)
            continue;
        const fullPath = path_1.default.join(basePath, file.path);
        fs_1.default.mkdirSync(path_1.default.dirname(fullPath), { recursive: true });
        fs_1.default.writeFileSync(fullPath, file.content || "", "utf8");
    }
}
