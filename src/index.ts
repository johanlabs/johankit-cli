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
      // Adicionado 'await'
      await copy(dir, exts);
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
      // Adicionado 'await'
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
  tool copy <dir> [exts]
  tool paste <dir>
  tool prompt <dir> "<user request>"
  tool sync <dir>

Examples:
  tool prompt src "refatorar para async/await"
  # cole o JSON de patches retornado pelo LLM
  tool sync src
`);
}

main();