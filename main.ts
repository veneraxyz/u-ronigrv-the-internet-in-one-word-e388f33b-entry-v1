import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The internet in one word: tabpocalypse.
// Every tab you swore you'd read later, still open, still judging you.
const WORD = "tabpocalypse";

function validateWord(word: string): void {
  if (word.length === 0 || word.length > 30) {
    throw new Error(`word must be 1-30 chars, got ${word.length}`);
  }
  if (word.trim() !== word || word.length === 0) {
    throw new Error("word must be non-blank with no leading/trailing whitespace");
  }
  if (/\s/.test(word)) {
    throw new Error("word must be exactly one word (no whitespace)");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(word)) {
    throw new Error("word must not contain control characters");
  }
}

function main(): void {
  validateWord(WORD);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR
    ? process.env.MAKEFUN_OUTPUT_DIR
    : "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, WORD, "utf8");
  // Read-back guard: verify what landed on disk is exactly the word.
  const written = readFileSync(outPath, "utf8");
  if (written !== WORD) {
    throw new Error(`read-back mismatch: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`);
  }
}

main();
