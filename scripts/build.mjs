import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

await rm('dist', { recursive: true, force: true });
execFileSync('npm', ['run', 'build:extension'], { stdio: 'inherit' });
execFileSync('npm', ['run', 'build:site'], { stdio: 'inherit' });
await mkdir('dist/site/downloads', { recursive: true });
const zipDir = '.output';
const files = await readdir(zipDir, { recursive: true });
const zip = files.find((file) => file.endsWith('.zip'));
if (!zip) throw new Error('WXT did not produce an extension zip.');
await cp(path.join(zipDir, zip), 'dist/site/downloads/reading-margin-recall-chrome.zip');
