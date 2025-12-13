"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = copy;
// src/cli/commands/copy.ts
const scan_1 = require("../../core/scan");
const clipboard_1 = require("../../core/clipboard");
async function copy(dir, exts) {
    try {
        const files = (0, scan_1.scanDir)(dir, { extensions: exts });
        const output = JSON.stringify(files, null, 2);
        await (0, clipboard_1.copyToClipboard)(output);
        process.stdout.write("✔ Copied to clipboard\n");
    }
    catch (error) {
        process.stderr.write("✖ Clipboard copy failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}
