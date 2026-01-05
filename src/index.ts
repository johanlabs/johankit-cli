#!/usr/bin/env node

import { copy } from "./cli/commands/copy";
import { paste } from "./cli/commands/paste";
import { prompt } from "./cli/commands/prompt";
import { sync } from "./cli/commands/sync";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  const runAll = process.argv.includes("--run");
  const cleanArgs = args.filter(a => a !== "--run" && a !== "-y");

  try {
    switch (command) {
      case "copy": {
        const dir = cleanArgs[1] ?? ".";
        const exts = cleanArgs[2]?.split(",");
        await copy(dir, exts);
        break;
      }

      case "paste": {
        const dir = cleanArgs[1] ?? ".";
        await paste(dir, runAll);
        break;
      }

      case "prompt": {
        const dir = cleanArgs[1] ?? ".";
        const userPrompt = cleanArgs.slice(2).join(" ");
        if (!userPrompt) {
          console.error("Missing user prompt");
          process.exit(1);
        }
        await prompt(dir, userPrompt);
        break;
      }

      case "sync": {
        const dir = cleanArgs[1] ?? ".";
        await sync(dir, runAll);
        break;
      }

      default:
        help();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function help() {
  console.log(`
Usage:
  johankit copy <dir> [exts]
  johankit paste <dir> [--run] [-y]
  johankit prompt <dir> "<user request>"
  johankit sync <dir> [--run] [-y]

Options:
  --run    Execute console commands during paste/sync
  -y       Auto-accept all console commands (no prompt)
`);
}

main();