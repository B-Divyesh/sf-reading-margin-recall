import { access, readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';

const siteRoot = path.resolve(process.argv[2] ?? 'dist/site');
const requiredFiles = [
  'index.html',
  '404.html',
  '404.css',
  'staticwebapp.config.json',
  'build-info.json',
  'downloads/reading-margin-recall-chrome.zip'
];
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const atSiteRoot = (...parts) => path.join(siteRoot, ...parts);

for (const file of requiredFiles) await access(atSiteRoot(file));

const zipPath = atSiteRoot('downloads/reading-margin-recall-chrome.zip');
const archive = await readFile(zipPath);
const archiveStats = await stat(zipPath);
check(archiveStats.size > 10_000, `Deployment installer is unexpectedly small (${archiveStats.size} bytes).`);
check(archive.subarray(0, 2).toString() === 'PK', 'Deployment installer is not a ZIP file.');
execFileSync('unzip', ['-t', zipPath], { stdio: 'pipe' });
const manifest = JSON.parse(execFileSync('unzip', ['-p', zipPath, 'manifest.json'], { encoding: 'utf8' }));
check(manifest.manifest_version === 3, 'Deployment installer is not a Manifest V3 extension.');

const receipt = JSON.parse(await readFile(atSiteRoot('build-info.json'), 'utf8'));
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
check(receipt.commit === commit, `Deployment receipt identifies ${receipt.commit}, not checked-out commit ${commit}.`);
check(receipt.extension?.path === '/downloads/reading-margin-recall-chrome.zip', 'Deployment receipt names the wrong installer path.');
check(receipt.extension?.bytes === archiveStats.size, 'Deployment receipt has the wrong installer byte count.');
check(receipt.extension?.sha256 === sha256(archive), 'Deployment receipt has the wrong installer SHA-256.');

const config = JSON.parse(await readFile(atSiteRoot('staticwebapp.config.json'), 'utf8'));
check(config.responseOverrides?.['404']?.rewrite === '/404.html', 'Deployment config does not route unknown URLs to the product 404.');
check(config.mimeTypes?.['.zip'] === 'application/zip', 'Deployment config does not declare application/zip.');
check(config.globalHeaders?.['Content-Security-Policy']?.includes("default-src 'self'"), 'Deployment config is missing the product CSP.');
check(config.globalHeaders?.['X-Content-Type-Options'] === 'nosniff', 'Deployment config is missing nosniff.');
check(config.globalHeaders?.['Referrer-Policy'] === 'strict-origin-when-cross-origin', 'Deployment config is missing the referrer policy.');
check(config.globalHeaders?.['Strict-Transport-Security']?.includes('max-age='), 'Deployment config is missing HSTS.');

const notFound = await readFile(atSiteRoot('404.html'), 'utf8');
check(notFound.includes('<title>Page not found — Reading Margin Recall</title>'), 'Deployment 404 has the wrong title.');
check(notFound.includes('<h1>We could not find this page</h1>'), 'Deployment 404 has the wrong heading.');
const notFoundUrls = [...notFound.matchAll(/https?:\/\/[^"'\s<]+/g)].map((match) => new URL(match[0]));
check(notFoundUrls.every((url) => url.origin === 'https://reading-margin-recall.sociobot.in'), 'Deployment 404 includes a third-party URL.');
check(notFound.includes('aria-label="Main navigation"'), 'Deployment 404 is missing the main navigation.');
check(notFound.includes('aria-label="Footer navigation"'), 'Deployment 404 is missing the footer navigation.');
check(notFound.includes('<meta name="description"'), 'Deployment 404 is missing its description.');
check(notFound.includes('rel="apple-touch-icon"'), 'Deployment 404 is missing its apple-touch icon.');

console.log(JSON.stringify({
  siteRoot,
  commit,
  extension: { bytes: archiveStats.size, sha256: sha256(archive), manifestVersion: manifest.manifest_version },
  receipt,
  notFound: 'product-owned 404 configured'
}, null, 2));
