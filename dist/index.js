#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const copy_1 = require("./cli/commands/copy");
const paste_1 = require("./cli/commands/paste");
const prompt_1 = require("./cli/commands/prompt");
const sync_1 = require("./cli/commands/sync");
const [, , command, ...args] = process.argv;
async function main() {
    switch (command) {
        case "copy": {
            const dir = args[0] ?? ".";
            const exts = args[1]?.split(",");
            await (0, copy_1.copy)(dir);
            break;
        }
        case "paste": {
            const dir = args[0] ?? ".";
            await (0, paste_1.paste)(dir);
            break;
        }
        case "prompt": {
            const dir = args[0] ?? ".";
            const userPrompt = args.slice(1).join(" ");
            if (!userPrompt) {
                console.error("Missing user prompt");
                process.exit(1);
            }
            await (0, prompt_1.prompt)(dir, userPrompt);
            break;
        }
        case "sync": {
            const dir = args[0] ?? ".";
            await (0, sync_1.sync)(dir);
            break;
        }
        default:
            help();
    }
}
function help() {
    console.log(`
Usage:
  johankit copy <dir> [exts]
  johankit paste <dir>
  johankit prompt <dir> "<user request>"
  johankit sync <dir>

Examples:
  johankit prompt src "refatorar para async/await"
  johankit sync src
`);
}
main();
