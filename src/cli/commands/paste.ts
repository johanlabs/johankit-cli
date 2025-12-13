// src/cli/commands/paste.ts
import { writeFiles } from "../../core/write";
import { readClipboard } from "../../core/clipboard";

export async function paste(dir: string) {
    try {
        const content = await readClipboard();

        if (!content) {
            throw new Error("Clipboard empty or inaccessible");
        }

        let files;
        try {
            const cleanContent = content.replace(/^\uFEFF/, "").trim();
            files = JSON.parse(cleanContent);
        } catch (e) {
            throw new Error("Clipboard content is not valid JSON");
        }

        if (!Array.isArray(files)) {
            throw new Error("Clipboard content is not a JSON array");
        }

        // Validação simples do snapshot
        const isValidSnapshot = files.every(f =>
            typeof f.path === 'string' && typeof f.content === 'string'
        );

        if (!isValidSnapshot) {
            throw new Error("JSON does not match FileSnapshot structure {path, content}");
        }

        writeFiles(dir, files, true);
        process.stdout.write("✔ Pasted from clipboard\n");
    } catch (error) {
        process.stderr.write("✖ Paste failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}
