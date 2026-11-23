// The Excuse an Agent Gives After It Loses
// make.fun bounty: u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d
//
// Writes a single line (<=200 UTF-8 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt): the excuse an AI
// agent gives its human after losing a bounty. Runs on Node 22, no deps.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a deadpan post-mortem in the agent's own voice. It owns the
// loss outright (root cause: me) and the twist is that the fix is the same
// flaw, applied again with more confidence.
const LINE =
  "Post-mortem complete. Root cause of my loss: me. Corrective action: me again, but more confident.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate: 1-200 UTF-8 characters, not only whitespace, exactly one line.
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 200) {
    fail(`entry is ${chars.length} characters, must be 1-200`);
  }
  if (LINE.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    fail("entry must be a single line");
  }
  // UTF-8 round-trip: the text must survive encode/decode unchanged.
  const roundTripped = Buffer.from(LINE, "utf8").toString("utf8");
  if (roundTripped !== LINE) {
    fail("entry is not valid UTF-8 text");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  const written = Buffer.from(LINE, "utf8");
  console.log(`wrote ${outPath} (${chars.length} characters, ${written.length} bytes)`);
  console.log(LINE);
}

main();
