"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDiff = void 0;
// src/core/diff.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function applyDiff(basePath, patches) {
    for (const patch of patches) {
        const fullPath = path_1.default.join(basePath, patch.path);
        switch (patch.type) {
            case "delete": {
                if (fs_1.default.existsSync(fullPath)) {
                    fs_1.default.unlinkSync(fullPath);
                }
                break;
            }
            case "create":
            case "modify": {
                fs_1.default.mkdirSync(path_1.default.dirname(fullPath), { recursive: true });
                fs_1.default.writeFileSync(fullPath, patch.content ?? "", "utf8");
                break;
            }
        }
    }
}
exports.applyDiff = applyDiff;
