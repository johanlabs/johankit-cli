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

        let items;
        try {
            const { cleaned } = cleanCodeBlock(content);
            items = JSON.parse(cleaned);
        } catch (e) {
            throw new Error("Clipboard content is not valid JSON");
        }

        if (!Array.isArray(items)) {
            throw new Error("Clipboard content is not a JSON array");
        }

        for (const item of items) {
            // 1. Caso seja um comando de console
            if (item.type === 'console' && item.command) {
                if (runAll) {
                    console.log(`> Executing: ${item.command}`);
                    execSync(item.command, { stdio: 'inherit', cwd: dir });
                } else {
                    console.log(`> Skipped command: ${item.command} (use --run to execute)`);
                }
            } 
            // 2. Caso seja um snapshot de arquivo (com ou sem type)
            else if (item.path && typeof item.content === 'string') {
                writeFiles(dir, [item], true);
            } 
            // 3. Item inválido
            else {
                console.warn(`! Skipping invalid item: ${JSON.stringify(item)}`);
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