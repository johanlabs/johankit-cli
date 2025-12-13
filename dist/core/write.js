"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFiles = void 0;
// src/core/write.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const git_1 = require("./git");
function writeFiles(basePath, files, commit = true) {
    if (commit) {
        (0, git_1.ensureGitCommit)("johankit: before paste");
    }
    for (const file of files) {
        const fullPath = path_1.default.join(basePath, file.path);
        const dir = path_1.default.dirname(fullPath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        fs_1.default.writeFileSync(fullPath, file.content, "utf8");
    }
}
exports.writeFiles = writeFiles;
