// src/cli/commands/paste.ts
import { writeFiles } from "../../core/write";
import { readClipboard } from "../../core/clipboard";
import cleanCodeBlock from "../../utils/cleanCodeBlock";
import { execSync } from "child_process";

export async function paste(dir: string, runAll = false) {
    try {
        const content = await readClipboard();
        if (!content) throw new Error("Clipboard empty");

        let items;
        try {
            const { cleaned } = cleanCodeBlock(content);
            items = JSON.parse(cleaned);
        } catch (e) {
            throw new Error("Invalid JSON in clipboard");
        }

        const itemsArray = Array.isArray(items) ? items : [items];

        for (const item of itemsArray) {
            if (item.type === 'console' && item.command) {
                if (runAll) {
                    console.log(`> Executing: ${item.command}`);
                    execSync(item.command, { stdio: 'inherit', cwd: dir });
                } else {
                    console.log(`> Skipped command: ${item.command} (use --run)`);
                }
            } else if (item.path && typeof item.content === 'string') {
                // Filtra para garantir que writeFiles receba apenas o necessário
                writeFiles(dir, [{ path: item.path, content: item.content }], true);
            }
        }

        process.stdout.write("✔ Paste completed\n");
    } catch (error: any) {
        process.stderr.write(`✖ Paste failed: ${error.message}\n`);
        process.exit(1);
    }
}