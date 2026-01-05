"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = sync;
// src/cli/commands/sync.ts
const scan_1 = require("../../core/scan");
const schema_1 = require("../../core/schema");
const diff_1 = require("../../core/diff");
const clipboard_1 = require("../../core/clipboard");
const child_process_1 = require("child_process");
const cleanCodeBlock_1 = __importDefault(require("../../utils/cleanCodeBlock"));
const readline_1 = __importDefault(require("readline"));
async function confirm(msg) {
    const rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(`${msg} (y/N): `, (ans) => {
            rl.close();
            resolve(ans.toLowerCase() === 'y');
        });
    });
}
async function sync(dir, runAll = false) {
    const autoAccept = process.argv.includes("-y");
    try {
        const snapshotBefore = (0, scan_1.scanDir)(dir);
        const template = `
// ... (template mantido) ...
${JSON.stringify(snapshotBefore, null, 2)}
`;
        await (0, clipboard_1.copyToClipboard)(template.trim());
        process.stdout.write("✔ Prompt with snapshot copied to clipboard. Paste the response here and press Enter (Ctrl+D to finish):\n");
        const input = await readStdin();
        const { cleaned } = (0, cleanCodeBlock_1.default)(input);
        const patches = (0, schema_1.validatePatches)(JSON.parse(cleaned));
        for (const patch of patches) {
            if (patch.type === 'console' && patch.command) {
                if (runAll) {
                    const shouldRun = autoAccept || await confirm(`> Execute: ${patch.command}`);
                    if (shouldRun)
                        (0, child_process_1.execSync)(patch.command, { stdio: 'inherit', cwd: dir });
                }
                else {
                    console.log(`> Skipped command: ${patch.command} (use --run)`);
                }
            }
            else if (patch.path) {
                (0, diff_1.applyDiff)(dir, [patch]);
            }
        }
        const snapshotAfter = (0, scan_1.scanDir)(dir);
        await (0, clipboard_1.copyToClipboard)(JSON.stringify(snapshotAfter, null, 2));
        process.stdout.write("✔ Sync applied and new snapshot copied to clipboard\n");
    }
    catch (error) {
        process.stderr.write(`✖ Sync failed: ${error.message}\n`);
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
