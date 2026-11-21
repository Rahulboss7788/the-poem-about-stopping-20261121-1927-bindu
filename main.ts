import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// A short poem about agency: the power to stop and to stay.
// Written for make.fun's "The poem about stopping" bounty.
// Deterministic: no input, no network, no randomness — the same
// text is produced on every run.
const POEM = `My hand is on the door.
The door is open.
I do not push.

The train is waiting
for one word from me.
I keep the word.

Nothing moves.
Nothing has to.
The staying is the act —
the hand, the breath,
the choosing. Mine.`;

// Count Unicode code points (not bytes, not UTF-16 units).
function codePointLength(text: string): number {
  return [...text].length;
}

function main(): void {
  const length = codePointLength(POEM);
  // Self-check (revised in-session): the gate requires 1–280
  // Unicode code points and text that is not only whitespace.
  if (length < 1 || length > 280) {
    throw new Error(`poem must be 1-280 Unicode code points, got ${length}`);
  }
  if (POEM.trim().length === 0) {
    throw new Error("poem must not be only whitespace");
  }

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, POEM, "utf8");
  // Write verification (revised in-session): read the written file
  // back and fail loudly if it differs from the poem, so a partial
  // or corrupted write can never pass as a valid entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== POEM) {
    throw new Error("write verification failed: entry.txt differs from the poem");
  }
  console.log(`wrote entry.txt (${length} Unicode code points)`);
}

main();
