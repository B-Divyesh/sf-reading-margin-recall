import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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
const extensionBytes = await stat(publicZip);
if (extensionBytes.size < 10_000) throw new Error('The public extension zip is unexpectedly small.');

// The deployed site exposes this small, same-origin receipt. It lets the post-deploy
// gate prove that the public installer and the commit handed to QA are one release.
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const archive = await readFile(publicZip);
await writeFile('dist/site/build-info.json', `${JSON.stringify({
  commit,
  extension: {
    path: '/downloads/reading-margin-recall-chrome.zip',
    bytes: extensionBytes.size,
    sha256: createHash('sha256').update(archive).digest('hex')
  }
}, null, 2)}\n`);

// Deployment must receive this directory itself, rather than its parent. Keep
// the installer, release receipt, and product 404 together at that exact root.
execFileSync('node', ['scripts/verify-deployment-tree.mjs'], { stdio: 'inherit' });
