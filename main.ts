// gta6-clipper-01 entry point (Node 22, standard library only).
//
// The entry is the video itself: this program only hands the gate the
// address of the YouTube Short, by copying VIDEO.json from the repository
// root into the output directory. The gate reads the video through the
// YouTube Data API and ranks it by views at the deadline.
//
// It copies the file byte for byte (two runs on the same repository write
// the same bytes) after checking that it parses as JSON and names a url,
// so a broken VIDEO.json fails loudly here instead of in the grader.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`gta6-clipper-01: ${message}`);
  process.exit(1);
}

const source = join(botDir, 'VIDEO.json');
const target = join(outputDir, 'VIDEO.json');

let raw: string;
try {
  raw = readFileSync(source, 'utf8');
} catch (err) {
  fail(`could not read ${source}: ${(err as Error).message}`);
}

let url: unknown;
try {
  url = (JSON.parse(raw) as { url?: unknown }).url;
} catch (err) {
  fail(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
}
if (typeof url !== 'string' || url.length === 0) {
  fail('VIDEO.json must name a video url');
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, raw);
