"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paste = void 0;
// src/cli/commands/paste.ts
const write_1 = require("../../core/write");
const clipboard_1 = require("../../core/clipboard");
async function paste(dir) {
    try {
        const content = await (0, clipboard_1.readClipboard)();
        if (!content) {
            throw new Error("Clipboard empty or inaccessible");
        }
        let files;
        try {
            let cleanContent = content.replace(/^\uFEFF/, "").trim();
            // Remove code block markers ``` ou ````` caso existam
            cleanContent = cleanContent.replace(/```+\s*json?/g, "").replace(/```+/g, "");
            files = JSON.parse(cleanContent);
        }
        catch (e) {
            throw new Error("Clipboard content is not valid JSON");
        }
        if (!Array.isArray(files)) {
            throw new Error("Clipboard content is not a JSON array");
        }
        // Validação simples do snapshot
        const isValidSnapshot = files.every(f => typeof f.path === 'string' && typeof f.content === 'string');
        if (!isValidSnapshot) {
            throw new Error("JSON does not match FileSnapshot structure {path, content}");
        }
        (0, write_1.writeFiles)(dir, files, true);
        process.stdout.write("✔ Pasted from clipboard\n");
    }
    catch (error) {
        process.stderr.write("✖ Paste failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}
exports.paste = paste;
