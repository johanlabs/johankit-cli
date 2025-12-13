"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanDir = void 0;
// src/core/scan.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function scanDir(basePath, options = {}) {
    const result = [];
    const base = path_1.default.resolve(basePath);
    const exts = options.extensions?.map(e => e.startsWith(".") ? e : `.${e}`);
    // Default ignores
    const ignoreSet = new Set([
        "node_modules", ".git", "dist", "build", ".DS_Store", "coverage", ".env", "yarn.lock",
    ]);
    // Read .gitignore if exists
    const gitignorePath = path_1.default.join(base, ".gitignore");
    if (fs_1.default.existsSync(gitignorePath)) {
        try {
            const lines = fs_1.default.readFileSync(gitignorePath, "utf8").split("\n");
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith("#")) {
                    ignoreSet.add(trimmed.replace(/^\//, "").replace(/\/$/, ""));
                }
            }
        }
        catch (e) {
            // ignore read errors
        }
    }
    function shouldIgnore(name) {
        if (ignoreSet.has(name))
            return true;
        for (const pattern of ignoreSet) {
            if (pattern.startsWith("*") && name.endsWith(pattern.slice(1)))
                return true;
            if (name.startsWith(pattern + "/"))
                return true;
        }
        return false;
    }
    function loop(currentPath) {
        const entries = fs_1.default.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            if (shouldIgnore(entry.name))
                continue;
            const fullPath = path_1.default.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                loop(fullPath);
            }
            else {
                if (exts && !exts.includes(path_1.default.extname(entry.name)))
                    continue;
                result.push({
                    path: path_1.default.relative(base, fullPath).replace(/\\/g, "/"),
                    content: fs_1.default.readFileSync(fullPath, "utf8"),
                });
            }
        }
    }
    loop(base);
    return result;
}
exports.scanDir = scanDir;
