#!/usr/bin/env node

import { copy } from "./cli/commands/copy";
import { paste } from "./cli/commands/paste";
import { prompt } from "./cli/commands/prompt";
import { sync } from "./cli/commands/sync";

const [, , command, ...args] = process.argv;

async function main() {
  switch (command) {
    case "copy": {
      const dir = args[0] ?? ".";
      const exts = args[1]?.split(",");
      await copy(dir);
      break;
    }

    case "paste": {
      const dir = args[0] ?? ".";
      await paste(dir);
      break;
    }

    case "prompt": {
      const dir = args[0] ?? ".";
      const userPrompt = args.slice(1).join(" ");
      if (!userPrompt) {
        console.error("Missing user prompt");
        process.exit(1);
      }
      await prompt(dir, userPrompt);
      break;
    }

    case "sync": {
      const dir = args[0] ?? ".";
      await sync(dir);
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