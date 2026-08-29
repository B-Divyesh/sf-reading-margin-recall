import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = new URL(process.env.RMR_LIVE_URL ?? 'https://reading-margin-recall.sociobot.in');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const rootResponse = await fetch(base);
check(rootResponse.status === 200, `Live root returned ${rootResponse.status}.`);
const localIndex = await readFile('dist/site/index.html');
const localHtml = localIndex.toString('utf8');
const assetPaths = [...localHtml.matchAll(/(?:src|href)="(\/assets\/[^"?]+\.(?:js|css))"/g)].map((match) => match[1]);
check(assetPaths.length === 2, `Expected one built script and stylesheet, found ${assetPaths.length}.`);

for (const assetPath of assetPaths) {
  const local = await readFile(`dist/site${assetPath}`);
  const response = await fetch(new URL(assetPath, base));
  const live = Buffer.from(await response.arrayBuffer());
  check(response.status === 200, `${assetPath} returned ${response.status}.`);
  check(sha256(live) === sha256(local), `${assetPath} does not match the local production build.`);
}

const zipPath = '/downloads/reading-margin-recall-chrome.zip';
const localZip = await readFile(`dist/site${zipPath}`);
const zipResponse = await fetch(new URL(`${zipPath}?release-check=${Date.now()}`, base), { cache: 'no-store' });
const liveZip = Buffer.from(await zipResponse.arrayBuffer());
check(zipResponse.status === 200, `Extension download returned ${zipResponse.status}.`);
check((zipResponse.headers.get('content-type') ?? '').includes('application/zip'), `Extension content type is ${zipResponse.headers.get('content-type')}.`);
check(liveZip.length > 10_000 && liveZip.subarray(0, 2).toString() === 'PK', 'Extension response is not a valid-looking ZIP.');
check(sha256(liveZip) === sha256(localZip), 'Live extension ZIP does not match the local production build.');

const missingPath = `/release-check-not-found-${Date.now()}`;
const missingResponse = await fetch(new URL(missingPath, base), { cache: 'no-store' });
const missingHtml = await missingResponse.text();
check(missingResponse.status === 404, `Unknown route returned ${missingResponse.status}, not 404.`);
check(missingHtml.includes('<title>Page not found — Reading Margin Recall</title>'), 'Unknown route did not return the product 404 title.');
check(missingHtml.includes('<h1>We could not find this page</h1>'), 'Unknown route did not return the product 404 heading.');
check(!/https?:\/\//.test(missingHtml), 'The product 404 contains a third-party URL.');
check((missingResponse.headers.get('content-security-policy') ?? '').includes("default-src 'self'"), 'The 404 response is missing the product CSP.');
check(missingResponse.headers.get('x-content-type-options') === 'nosniff', 'The 404 response is missing nosniff.');
check(missingResponse.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'The 404 response is missing the referrer policy.');
check((missingResponse.headers.get('strict-transport-security') ?? '').includes('max-age='), 'The 404 response is missing HSTS.');
const notFoundCache = missingResponse.headers.get('cache-control') ?? '';
const notFoundMaxAge = Number(notFoundCache.match(/max-age=(\d+)/)?.[1] ?? Number.POSITIVE_INFINITY);
check(notFoundCache.includes('no-store') || (notFoundCache.includes('must-revalidate') && notFoundMaxAge <= 30), `The 404 response has an unsafe cache policy: ${notFoundCache}.`);

const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const crossOrigin = [];
  const errors = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== base.origin) crossOrigin.push(request.url());
  });
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(new URL(missingPath, base).href, { waitUntil: 'networkidle' });
  check(response?.status() === 404, `Browser unknown-route response was ${response?.status()}.`);
  check(await page.title() === 'Page not found — Reading Margin Recall', 'Browser received the wrong 404 document.');
  const results = await new AxeBuilder({ page }).analyze();
  const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  check(severe.length === 0, `The live 404 has Axe violations: ${severe.map((item) => item.id).join(', ')}.`);
  check(crossOrigin.length === 0, `The live 404 made third-party requests: ${crossOrigin.join(', ')}.`);
  check(errors.length === 0, `The live 404 logged errors: ${errors.join(', ')}.`);
} finally {
  await browser.close();
}

console.log(JSON.stringify({
  base: base.href,
  assets: assetPaths,
  extension: { bytes: liveZip.length, sha256: sha256(liveZip), contentType: zipResponse.headers.get('content-type') },
  notFound: { status: missingResponse.status, cacheControl: notFoundCache, axeSeriousOrCritical: 0, thirdPartyRequests: 0 }
}, null, 2));
