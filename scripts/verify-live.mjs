import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = new URL(process.env.RMR_LIVE_URL ?? 'https://reading-margin-recall.sociobot.in');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const severeAxeViolations = async (page) => {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
};

const rootResponse = await fetch(base);
check(rootResponse.status === 200, `Live root returned ${rootResponse.status}.`);
const localIndex = await readFile('dist/site/index.html');
const liveIndex = Buffer.from(await rootResponse.arrayBuffer());
check(sha256(liveIndex) === sha256(localIndex), 'Live index.html does not match the local production build.');
const localBuildInfo = JSON.parse(await readFile('dist/site/build-info.json', 'utf8'));
const buildInfoResponse = await fetch(new URL('/build-info.json', base), { cache: 'no-store' });
check(buildInfoResponse.status === 200, `Build receipt returned ${buildInfoResponse.status}.`);
const liveBuildInfo = await buildInfoResponse.json();
check(JSON.stringify(liveBuildInfo) === JSON.stringify(localBuildInfo), 'Live build receipt does not match the local production build.');
const candidate = process.env.RMR_CANDIDATE_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
check(localBuildInfo.commit === candidate, `Local build receipt identifies ${localBuildInfo.commit}, not candidate ${candidate}.`);
const remoteMain = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], { encoding: 'utf8' }).trim().split(/\s+/)[0];
check(remoteMain === candidate, `origin/main identifies ${remoteMain}, not candidate ${candidate}.`);
check(liveBuildInfo.commit === candidate, `Live build receipt identifies ${liveBuildInfo.commit}, not candidate ${candidate}.`);
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

const localWorker = await readFile('dist/site/sw.js');
const workerResponse = await fetch(new URL(`/sw.js?release-check=${Date.now()}`, base), { cache: 'no-store' });
const liveWorker = Buffer.from(await workerResponse.arrayBuffer());
check(workerResponse.status === 200, `Service worker returned ${workerResponse.status}.`);
check(sha256(liveWorker) === sha256(localWorker), 'Live service worker does not match the local production build.');

const zipPath = '/downloads/reading-margin-recall-chrome.zip';
const localZip = await readFile(`dist/site${zipPath}`);
const zipResponse = await fetch(new URL(`${zipPath}?release-check=${Date.now()}`, base), { cache: 'no-store' });
const liveZip = Buffer.from(await zipResponse.arrayBuffer());
check(zipResponse.status === 200, `Extension download returned ${zipResponse.status}.`);
check((zipResponse.headers.get('content-type') ?? '').includes('application/zip'), `Extension content type is ${zipResponse.headers.get('content-type')}.`);
check(liveZip.length > 10_000 && liveZip.subarray(0, 2).toString() === 'PK', 'Extension response is not a valid-looking ZIP.');
check(sha256(liveZip) === sha256(localZip), 'Live extension ZIP does not match the local production build.');
check(liveBuildInfo.extension.path === zipPath, 'Live build receipt names the wrong extension path.');
check(liveBuildInfo.extension.bytes === liveZip.length, 'Live build receipt has the wrong extension byte count.');
check(liveBuildInfo.extension.sha256 === sha256(liveZip), 'Live build receipt has the wrong extension SHA-256.');

const missingPath = `/release-check-not-found-${Date.now()}`;
const missingUrl = new URL(missingPath, base).href;
const missingResponse = await fetch(missingUrl, { cache: 'no-store' });
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
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const crossOrigin = [];
  const errors = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== base.origin) crossOrigin.push(request.url());
  });
  page.on('console', (message) => {
    const isExpectedDocument404 = message.location().url === missingUrl && message.text().includes('status of 404');
    if (message.type() === 'error' && !isExpectedDocument404) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(missingUrl, { waitUntil: 'networkidle' });
  check(response?.status() === 404, `Browser unknown-route response was ${response?.status()}.`);
  check(await page.title() === 'Page not found — Reading Margin Recall', 'Browser received the wrong 404 document.');
  const severe = await severeAxeViolations(page);
  check(severe.length === 0, `The live 404 has Axe violations: ${severe.map((item) => item.id).join(', ')}.`);
  check(crossOrigin.length === 0, `The live 404 made third-party requests: ${crossOrigin.join(', ')}.`);
  check(errors.length === 0, `The live 404 logged errors: ${errors.join(', ')}.`);
  await context.close();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktop.newPage();
  const desktopCrossOrigin = [];
  const desktopErrors = [];
  desktopPage.on('request', (request) => {
    if (new URL(request.url()).origin !== base.origin) desktopCrossOrigin.push(request.url());
  });
  desktopPage.on('console', (message) => { if (message.type() === 'error') desktopErrors.push(message.text()); });
  desktopPage.on('pageerror', (error) => desktopErrors.push(error.message));
  await desktopPage.goto(base.href, { waitUntil: 'networkidle' });
  check(await desktopPage.locator('h1').textContent() === 'Save passages for later recall', 'Live landing headline is wrong.');
  check((await severeAxeViolations(desktopPage)).length === 0, 'Live desktop landing has serious or critical Axe violations.');
  await desktopPage.keyboard.press('Tab');
  check(await desktopPage.getByRole('link', { name: 'Skip to main content' }).evaluate((element) => element === document.activeElement), 'The skip link is not first in the live keyboard order.');
  await desktopPage.keyboard.press('Enter');
  check(await desktopPage.locator('main').evaluate((element) => element === document.activeElement), 'The live skip link does not focus main.');
  await desktopPage.getByRole('link', { name: 'Try it with sample data' }).click();
  check(await desktopPage.getByText('3 saved passages').isVisible(), 'The live demo did not load three sample notes.');
  check(await desktopPage.getByText(/Demo — sample data/).isVisible(), 'The live demo banner is missing.');
  await desktopPage.getByLabel('Selected passage *').fill('Je relis cette phrase demain.');
  await desktopPage.getByLabel('Your gloss *').fill('I reread this sentence tomorrow.');
  await desktopPage.getByLabel('Word to hide *').selectOption('demain');
  await desktopPage.getByLabel('Source title *').fill('Live release check');
  await desktopPage.getByLabel('Source URL *').fill('https://example.com/live-release-check');
  await desktopPage.getByRole('button', { name: 'Save review note' }).click();
  check(await desktopPage.getByText('4 saved passages').isVisible(), 'The live demo capture did not save into the demo store.');
  await desktopPage.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Review' }).click();
  await desktopPage.keyboard.press('Space');
  check(await desktopPage.getByText(/Hidden word:/).isVisible(), 'Space did not reveal the live review answer.');
  await desktopPage.keyboard.press('3');
  check(!(await desktopPage.getByText(/Hidden word:/).isVisible()), 'Key 3 did not grade the live review.');
  await desktopPage.getByRole('button', { name: 'Reset demo' }).click();
  await desktopPage.goto(new URL('/demo', base).href);
  await desktopPage.evaluate(() => navigator.serviceWorker.ready);
  await desktopPage.waitForFunction(() => navigator.serviceWorker.controller !== null);
  const worker = await desktopPage.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { active: registration.active?.scriptURL, waiting: registration.waiting?.scriptURL ?? null };
  });
  check(worker.active?.endsWith('/sw.js') && worker.waiting === null, 'The live service worker is not active and current.');
  await desktop.setOffline(true);
  await desktopPage.reload();
  check(await desktopPage.getByText('3 saved passages').isVisible(), 'The live demo did not reload offline with three notes.');
  await desktop.setOffline(false);
  await desktopPage.getByRole('link', { name: 'Reading Margin Recall home' }).click();
  const demoKeys = await desktopPage.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')));
  check(demoKeys.length === 0, 'Leaving the live demo retained demo storage.');
  check(desktopCrossOrigin.length === 0, `The live product flow made third-party requests: ${desktopCrossOrigin.join(', ')}.`);
  check(desktopErrors.length === 0, `The live product flow logged errors: ${desktopErrors.join(', ')}.`);
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mobilePage = await mobile.newPage();
  await mobilePage.emulateMedia({ reducedMotion: 'reduce' });
  await mobilePage.goto(base.href, { waitUntil: 'networkidle' });
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 1, `The 390px live landing overflows by ${overflow}px.`);
  const demoTarget = await mobilePage.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Demo' }).boundingBox();
  check((demoTarget?.width ?? 0) >= 44 && (demoTarget?.height ?? 0) >= 44, `The mobile Demo target is ${demoTarget?.width}×${demoTarget?.height}.`);
  const reducedDuration = await mobilePage.locator('.button').first().evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration) || 0);
  check(reducedDuration <= 0.001, `Reduced-motion transition duration is ${reducedDuration}s.`);
  check((await severeAxeViolations(mobilePage)).length === 0, 'Live 390px landing has serious or critical Axe violations.');
  await mobilePage.evaluate(() => document.styleSheets[0]?.insertRule(':root { font-size: 32px !important; }'));
  const zoomOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(zoomOverflow <= 1, `The live landing overflows by ${zoomOverflow}px at 200% text.`);
  await mobile.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify({
  base: base.href,
  candidate,
  buildReceipt: liveBuildInfo,
  assets: assetPaths,
  extension: { bytes: liveZip.length, sha256: sha256(liveZip), contentType: zipResponse.headers.get('content-type') },
  notFound: { status: missingResponse.status, cacheControl: notFoundCache, axeSeriousOrCritical: 0, thirdPartyRequests: 0 },
  productFlow: { desktopCaptureReview: 'passed', keyboard: 'passed', offlineReload: 'passed', serviceWorkerUpdate: 'passed', thirdPartyRequests: 0 },
  mobile: { viewport: '390x844', minimumDemoTarget: '44x44', textResize: '200%', axeSeriousOrCritical: 0 }
}, null, 2));
