// src/cli/commands/paste.ts
import { writeFiles } from "../../core/write";
import { readClipboard } from "../../core/clipboard";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import { execSync } from "child_process";

export async function paste(dir: string, runAll = false) {
    try {
        const content = await readClipboard();

        if (!content) {
            throw new Error("Clipboard empty or inaccessible");
        }

        let files;
        try {
            const { cleaned } = cleanCodeBlock(content);
            files = JSON.parse(cleaned);
        } catch (e) {
            throw new Error("Clipboard content is not valid JSON");
        }

        if (!Array.isArray(files)) {
            throw new Error("Clipboard content is not a JSON array");
        }

        for (const item of files) {
            if (item.type === 'console') {
                if (runAll) {
                    console.log(`> Executing: ${item.command}`);
                    execSync(item.command, { stdio: 'inherit', cwd: dir });
                } else {
                    console.log(`> Skipped command: ${item.command} (use flag to run)`);
                }
            } else if (item.path && typeof item.content === 'string') {
                writeFiles(dir, [item], true);
            } else {
                throw new Error(`Invalid item in clipboard: ${JSON.stringify(item)}`);
            }
        }

        process.stdout.write("✔ Paste completed\n");
    } catch (error) {
        process.stderr.write("✖ Paste failed\n");
        if (error instanceof Error) {
            process.stderr.write(`${error.message}\n`);
        }
        process.exit(1);
    }
}