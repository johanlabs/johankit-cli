"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = sync;
// src/cli/commands/sync.ts
const scan_1 = require("../../core/scan");
const diff_1 = require("../../core/diff");
const clipboard_1 = require("../../core/clipboard");
const validation_1 = require("../../core/validation");
async function sync(dir) {
    try {
        const input = await readStdin();
        let patches;
        try {
            patches = JSON.parse(input);
        }
        catch (e) {
            throw new Error("Invalid JSON input");
        }
        const validated = (0, validation_1.validatePatches)(patches);
        (0, diff_1.applyDiff)(dir, validated);
        const snapshot = (0, scan_1.scanDir)(dir);
        const output = JSON.stringify(snapshot, null, 2);
        await (0, clipboard_1.copyToClipboard)(output);
        process.stdout.write("✔ Sync applied and new snapshot copied to clipboard\n");
    }
    catch (error) {
        process.stderr.write("✖ Sync failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}
function readStdin() {
    return new Promise(resolve => {
        let data = "";
        process.stdin.on("data", c => (data += c));
        process.stdin.on("end", () => resolve(data));
    });
}
