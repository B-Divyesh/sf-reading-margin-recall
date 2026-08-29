import { access, cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

await rm('dist', { recursive: true, force: true });
execFileSync('npm', ['run', 'build:extension'], { stdio: 'inherit' });
execFileSync('npm', ['run', 'build:site'], { stdio: 'inherit' });
await cp('site/404.html', 'dist/site/404.html');
await mkdir('dist/site/downloads', { recursive: true });
const zipDir = '.output';
const files = await readdir(zipDir, { recursive: true });
const zip = files.find((file) => file.endsWith('.zip'));
if (!zip) throw new Error('WXT did not produce an extension zip.');
const publicZip = 'dist/site/downloads/reading-margin-recall-chrome.zip';
await cp(path.join(zipDir, zip), publicZip);
await access('dist/site/404.html');
if ((await stat(publicZip)).size < 10_000) throw new Error('The public extension zip is unexpectedly small.');
