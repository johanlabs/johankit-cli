#!/usr/bin/env node
import { Command } from "commander";
import { copy } from "./cli/commands/copy";
import { paste } from "./cli/commands/paste";
import { prompt } from "./cli/commands/prompt";
import { sync } from "./cli/commands/sync";

const program = new Command();

program
  .name('johankit')
  .description('Developer-friendly CLI for codebase snapshots and AI vibe-coding')
  .version('0.0.3');

program
  .command('copy [dir] [exts]')
  .action((dir = '.', exts) => copy(dir, exts?.split(',')));

program
  .command('paste [dir]')
  .option('--run', 'execute console commands')
  .option('-y', 'auto accept commands without confirmation')
  .option('--dry-run', 'list changes without applying them')
  .option('--diff', 'show diff and ask for confirmation for each file')
  .action((dir = '.', opts) => paste(dir, !!opts.run, !!opts.dryRun, !!opts.diff));

program
  .command('prompt [dir] <request...>')
  .action((dir = '.', request) => prompt(dir, request.join(' ')));

program
  .command('sync [dir]')
  .option('--run', 'execute console commands')
  .option('-y', 'auto accept commands without confirmation')
  .option('--dry-run', 'list changes without applying them')
  .option('--diff', 'show diff and ask for confirmation for each file')
  .action((dir = '.', opts) => sync(dir, !!opts.run, !!opts.dryRun));

program.parse();