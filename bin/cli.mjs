#!/usr/bin/env node
/**
 * create-lean-agent-kit — CLI entry
 * Implementation lives in ./lak.mjs (importable for tests).
 */
import { runCli } from "./lak.mjs";

runCli(process.argv.slice(2)).catch((err) => {
  console.error(`✗ Failed:`, err.message);
  process.exit(1);
});
