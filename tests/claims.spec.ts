import { expect, test, type TestInfo } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

declare const chrome: {
  storage: { local: { set(value: Record<string, unknown>): Promise<void>; get(key: string): Promise<Record<string, unknown>> } };
  downloads: { search(query: Record<string, unknown>): Promise<Array<{ filename: string; state: string; exists: boolean; bytesReceived: number; totalBytes: number; mime: string; byExtensionName?: string }>> };
};

async function openIsolatedTransferProfile(testInfo: TestInfo, label: string) {
  const profileDirectory = testInfo.outputPath(`${label}-profile`);
  const downloadDirectory = testInfo.outputPath(`${label}-downloads`);
  await mkdir(join(profileDirectory, 'Default'), { recursive: true });
  await mkdir(downloadDirectory, { recursive: true });
  await writeFile(join(profileDirectory, 'Default', 'Preferences'), JSON.stringify({
    download: {
      default_directory: resolve(downloadDirectory),
      directory_upgrade: true,
      prompt_for_download: false
    }
  }));
  const context = await chromium.launchPersistentContext(profileDirectory, {
    headless: true,
    channel: 'chromium',
    acceptDownloads: true,
    downloadsPath: downloadDirectory,
    args: [`--disable-extensions-except=${process.cwd()}/.output/chrome-mv3`, `--load-extension=${process.cwd()}/.output/chrome-mv3`]
  });
  const extensionsPage = await context.newPage();
  await extensionsPage.goto('chrome://extensions');
  const extensionId = await extensionsPage.locator('extensions-manager').evaluate((manager) => manager.shadowRoot?.querySelector('extensions-item-list')?.shadowRoot?.querySelector('extensions-item')?.getAttribute('id'));
  expect(extensionId).toBeTruthy();
  await extensionsPage.close();
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  return { context, downloadDirectory, popup };
}

async function waitForCompletedExtensionBackup(popup: Awaited<ReturnType<typeof openIsolatedTransferProfile>>['popup'], downloadDirectory: string) {
  let completed: { filename: string; state: string; exists: boolean; bytesReceived: number; totalBytes: number; mime: string; byExtensionName?: string } | undefined;
  await expect.poll(async () => {
    completed = await popup.evaluate(async () => (await chrome.downloads.search({
      state: 'complete',
      exists: true,
      orderBy: ['-startTime'],
      limit: 10
    })).find((item) => item.byExtensionName === 'Reading Margin Recall' && item.mime === 'application/json'));
    if (!completed || completed.state !== 'complete' || !completed.exists || completed.totalBytes < 1 || completed.bytesReceived !== completed.totalBytes) return false;
    try {
      const file = await stat(completed.filename);
      return file.isFile() && file.size === completed.totalBytes;
    } catch {
      return false;
    }
  }, { message: 'extension backup download should finish in the isolated download directory', timeout: 15_000 }).toBe(true);
  expect(resolve(dirname(completed!.filename))).toBe(resolve(downloadDirectory));
  return completed!.filename;
}

test('@claim:source-linked-capture saves a full recall note', async ({ page }) => {
  await page.goto('/library');
  await page.getByLabel('Selected passage *').fill('La memoria vuelve cuando leo despacio.');
  await page.getByLabel('Your gloss *').fill('Memory returns when I read slowly.');
  await page.getByLabel('Word to hide *').selectOption('memoria');
  await page.getByLabel('Source title *').fill('My Spanish reading');
  await page.getByLabel('Source URL *').fill('https://example.com/spanish-reading');
  await page.getByRole('button', { name: 'Save review note' }).click();
  await expect(page.getByText('La memoria vuelve cuando leo despacio.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open original page/ })).toHaveAttribute('href', 'https://example.com/spanish-reading');
});

test('@claim:demo-isolated keeps real notes separate', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'real-note' }])));
  await page.goto('/demo');
  await expect(page.getByText('3 saved notes')).toBeVisible();
  await expect(page.getByText('Life is a flower whose honey is love.').first()).toBeVisible();
  await expect(page.getByText('Whoever keeps striving can be redeemed.')).toBeVisible();
  await expect(page.getByText('In a place in La Mancha, whose name I do not wish to recall.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Exit demo and use my notes' }).click();
  const stored = await page.evaluate(() => ({ real: localStorage.getItem('rmr:notes'), demo: localStorage.getItem('demo:rmr:notes') }));
  expect(stored.real).toContain('real-note');
  expect(stored.demo).toBeNull();
});

test('@claim:local-only keeps notes and color settings local with no third-party requests during capture, review, export, and demo actions', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url()); });
  await page.goto('/library');
  await page.getByRole('button', { name: 'Change color theme' }).click();
  expect(await page.evaluate(() => localStorage.getItem('rmr:theme'))).toBe('dark');
  expect(await page.evaluate(() => localStorage.getItem('demo:rmr:theme'))).toBeNull();
  await page.getByLabel('Selected passage *').fill('Je relis cette phrase demain.');
  await page.getByLabel('Your gloss *').fill('I reread this sentence tomorrow.');
  await page.getByLabel('Word to hide *').selectOption('demain');
  await page.getByLabel('Source title *').fill('Private article');
  await page.getByLabel('Source URL *').fill('https://example.com/private');
  await page.getByRole('button', { name: 'Save review note' }).click();
  await page.goto('/review');
  await page.keyboard.press('Space');
  await expect(page.getByText('Hidden word:')).toBeVisible();
  await page.keyboard.press('3');
  await page.goto('/library');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  expect(await download.suggestedFilename()).toMatch(/^reading-margin-recall-\d{4}-\d{2}-\d{2}\.json$/);
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Change color theme' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:rmr:theme'))).toBe('dark');
  expect(await page.evaluate(() => localStorage.getItem('rmr:theme'))).toBe('dark');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:rmr:notes'))).toContain('La vie est une fleur');
  await page.getByRole('button', { name: 'Exit demo and use my notes' }).click();
  await expect(page).toHaveURL('/library');
  const storage = await page.evaluate(() => ({
    demoNotes: localStorage.getItem('demo:rmr:notes'),
    demoTheme: localStorage.getItem('demo:rmr:theme'),
    realNotes: localStorage.getItem('rmr:notes'),
    realTheme: localStorage.getItem('rmr:theme')
  }));
  expect(storage.demoNotes).toBeNull();
  expect(storage.demoTheme).toBeNull();
  expect(storage.realNotes).toContain('Je relis cette phrase demain.');
  expect(storage.realTheme).toBe('dark');
  await page.goto('/privacy');
  await expect(page.getByText('Capture, review, JSON export, and demo Reset or Exit make no third-party requests.')).toBeVisible();
  expect(crossOrigin).toEqual([]);
});

test('@claim:no-tracking loads only the application module and sends no tracking signal', async ({ page, context }) => {
  const origin = 'http://127.0.0.1:4173';
  const requests: Array<{ url: string; type: string }> = [];
  await page.addInitScript(() => {
    const beaconCalls: string[] = [];
    Object.defineProperty(window, '__rmrBeaconCalls', { value: beaconCalls, configurable: false });
    const sendBeacon = navigator.sendBeacon.bind(navigator);
    Object.defineProperty(Navigator.prototype, 'sendBeacon', {
      configurable: true,
      value(url: string | URL, data?: BodyInit | null) {
        beaconCalls.push(String(url));
        return sendBeacon(url, data);
      }
    });
  });
  context.on('request', (request) => requests.push({ url: request.url(), type: request.resourceType() }));

  for (const route of ['/', '/demo', '/library', '/review', '/privacy', '/terms']) {
    await page.goto(route);
    const scripts = await page.locator('script[src]').evaluateAll((elements) => elements.map((element) => (element as HTMLScriptElement).src));
    expect(scripts).toEqual([expect.stringMatching(/^http:\/\/127\.0\.0\.1:4173\/assets\/index-[\w-]+\.js$/)]);
  }

  await page.goto('/?demo=1');
  await page.getByLabel('Selected passage *').fill('Je relis cette phrase demain.');
  await page.getByLabel('Your gloss *').fill('I reread this sentence tomorrow.');
  await page.getByLabel('Word to hide *').selectOption('demain');
  await page.getByLabel('Source title *').fill('Tracking claim sample');
  await page.getByLabel('Source URL *').fill('https://example.com/tracking-claim');
  await page.getByRole('button', { name: 'Save review note' }).click();
  await page.goto('/review?demo=1');
  await page.keyboard.press('Space');
  await page.keyboard.press('3');
  await page.goto('/library?demo=1');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  await download;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Exit demo and use my notes' }).click();

  await page.goto('/404.html');
  expect(await page.locator('script[src]').count()).toBe(0);
  expect(await page.evaluate(() => ({
    cookies: document.cookie,
    localKeys: Object.keys(localStorage),
    sessionKeys: Object.keys(sessionStorage),
    beaconCalls: (window as typeof window & { __rmrBeaconCalls: string[] }).__rmrBeaconCalls
  }))).toEqual({ cookies: '', localKeys: [], sessionKeys: [], beaconCalls: [] });
  expect(await context.cookies()).toEqual([]);
  expect(requests.every((request) => new URL(request.url).origin === origin)).toBe(true);
  expect(requests.filter((request) => request.type === 'ping' || /(?:analytics|collect|beacon|pixel|track|telemetry)/i.test(new URL(request.url).pathname))).toEqual([]);
  expect([...new Set(requests.filter((request) => request.type === 'script').map((request) => new URL(request.url).pathname))].sort()).toEqual([
    expect.stringMatching(/^\/assets\/index-[\w-]+\.js$/),
    '/sw.js'
  ]);
});

test('@claim:pwa-installable provides a standalone My notes app controlled by its service worker', async ({ page }) => {
  await page.goto('/library');
  const details = await page.evaluate(async () => {
    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const manifestUrl = manifestLink?.href;
    const manifest = manifestUrl ? await (await fetch(manifestUrl)).json() as {
      start_url?: string; display?: string; icons?: Array<{ src?: string; sizes?: string; type?: string }>;
    } : null;
    const iconResponses = await Promise.all((manifest?.icons ?? []).map(async (icon) => ({
      src: icon.src,
      status: icon.src ? (await fetch(icon.src)).status : 0
    })));
    const registration = await navigator.serviceWorker.ready;
    return { manifestUrl, manifest, iconResponses, activeWorker: registration.active?.scriptURL };
  });
  expect(details.manifestUrl).toBe('http://127.0.0.1:4173/manifest.webmanifest');
  expect(details.manifest).toMatchObject({ start_url: '/library', display: 'standalone' });
  expect(details.manifest?.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }),
    expect.objectContaining({ src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' })
  ]));
  expect(details.iconResponses).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/assets/icon-192.png', status: 200 }),
    expect.objectContaining({ src: '/assets/icon-512.png', status: 200 })
  ]));
  expect(details.activeWorker).toBe('http://127.0.0.1:4173/sw.js');
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toBe('http://127.0.0.1:4173/sw.js');
  await expect(page.getByRole('heading', { level: 1, name: 'Save a passage for later recall' })).toBeVisible();
});

test('@claim:json-backup exports every demo note', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const parsed = JSON.parse(await readFile(path!, 'utf8')) as { notes: unknown[] };
  expect(parsed.notes).toHaveLength(3);
  await page.getByLabel('Import JSON').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ version: 1, notes: [parsed.notes[0]] })) });
  await expect(page.getByText('1 saved note')).toBeVisible();
});

test('@claim:keyboard-review reveals and grades with keys', async ({ page }) => {
  await page.goto('/review?demo=1');
  await page.keyboard.press('Space');
  await expect(page.getByText(/Hidden word:/)).toBeVisible();
  await page.keyboard.press('3');
  await expect(page.getByText('Hidden word:', { exact: false })).not.toBeVisible();
});

test('@claim:free-tools @regression:no-dead-billing gives every tool without a license gate', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url()); });
  await page.goto('/');
  await expect(page.getByText('All tools are free to use. No account or subscription is required.')).toBeVisible();
  await expect(page.getByText(/Study Edition|Buy Study Edition|Restore a purchase/)).toHaveCount(0);
  await expect(page.locator('a[href*="api.sociobot.in"]')).toHaveCount(0);
  await page.goto('/terms');
  await expect(page.getByText('Capture, review, filters, source links, JSON export, and JSON import are free.')).toBeVisible();
  expect(crossOrigin).toEqual([]);
  const deploymentConfig = await readFile('site/public/staticwebapp.config.json', 'utf8');
  expect(deploymentConfig).not.toContain('api.sociobot.in');
});

test('@claim:review-filters shows difficult notes and one selected source', async ({ page }) => {
  await page.goto('/review');
  await page.evaluate(() => {
    const now = new Date().toISOString();
    localStorage.setItem('rmr:notes', JSON.stringify([
      { id: 'easy', passage: 'Ich lese jeden Tag.', gloss: 'I read every day.', deletion: 'lese', sourceUrl: 'https://example.com/easy', sourceTitle: 'Easy German', createdAt: now, dueAt: now, intervalDays: 4, reviews: 2, lastGrade: 4 },
      { id: 'hard', passage: 'La mémoire demande du travail.', gloss: 'Memory takes work.', deletion: 'travail', sourceUrl: 'https://example.com/hard', sourceTitle: 'Hard French', createdAt: now, dueAt: now, intervalDays: 1, reviews: 2, lastGrade: 2 }
    ]));
  });
  await page.reload();
  await page.getByLabel('Difficult notes only').check();
  await expect(page.locator('.specimen-tab')).toHaveText('Hard French');
  await page.getByLabel('Difficult notes only').uncheck();
  await page.getByLabel('Source').selectOption({ label: 'Easy German' });
  await expect(page.locator('.specimen-tab')).toHaveText('Easy German');
});

test('@claim:json-transfer moves backups between the extension and web app both ways', async ({}, testInfo) => {
  test.setTimeout(60_000);
  test.skip(testInfo.project.name !== 'chromium');
  const extensionToWeb = await openIsolatedTransferProfile(testInfo, 'extension-to-web');
  try {
    const { context, downloadDirectory, popup } = extensionToWeb;
    expect(await popup.evaluate(async () => (await chrome.storage.local.get('rmr:notes'))['rmr:notes'])).toBeUndefined();
    const web = await context.newPage();
    await web.goto('http://127.0.0.1:4173/library');
    expect(await web.evaluate(() => localStorage.getItem('rmr:notes'))).toBeNull();

    await popup.evaluate(async () => {
      const now = new Date().toISOString();
      await chrome.storage.local.set({ 'rmr:notes': [{ id: 'from-extension', passage: 'Die Erinnerung wächst beim Wiederholen.', gloss: 'Memory grows through review.', deletion: 'Erinnerung', sourceUrl: 'https://example.com/extension-note', sourceTitle: 'Extension source', createdAt: now, dueAt: now, intervalDays: 0, reviews: 0 }] });
    });
    await popup.reload();
    expect((await popup.getByLabel('Import notes from JSON').evaluate((input) => input.closest('label')!.getBoundingClientRect().height))).toBeGreaterThanOrEqual(44);
    await popup.getByRole('button', { name: 'Export notes as JSON' }).click();
    await expect(popup.locator('#live')).toHaveText('1 note exported for the web app.');
    const extensionDownloadPath = await waitForCompletedExtensionBackup(popup, downloadDirectory);
    const extensionBackup = JSON.parse(await readFile(extensionDownloadPath, 'utf8')) as { version: number; notes: Array<{ id: string; passage: string }> };
    expect(extensionBackup).toMatchObject({ version: 1, notes: [{ id: 'from-extension', passage: 'Die Erinnerung wächst beim Wiederholen.' }] });
    await web.getByLabel('Import JSON').setInputFiles(extensionDownloadPath);
    await expect(web.getByText('Die Erinnerung wächst beim Wiederholen.')).toBeVisible();
    expect(JSON.parse((await web.evaluate(() => localStorage.getItem('rmr:notes')))!) as Array<{ id: string }>).toEqual([expect.objectContaining({ id: 'from-extension' })]);
  } finally {
    await extensionToWeb.context.close();
  }

  const webToExtension = await openIsolatedTransferProfile(testInfo, 'web-to-extension');
  try {
    const { context, downloadDirectory, popup } = webToExtension;
    expect(await popup.evaluate(async () => (await chrome.storage.local.get('rmr:notes'))['rmr:notes'])).toBeUndefined();
    const web = await context.newPage();
    await web.goto('http://127.0.0.1:4173/library');
    expect(await web.evaluate(() => localStorage.getItem('rmr:notes'))).toBeNull();
    await web.evaluate(() => {
      const now = new Date().toISOString();
      localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'from-web', passage: 'La pratique rend les mots familiers.', gloss: 'Practice makes words familiar.', deletion: 'pratique', sourceUrl: 'https://example.com/web-note', sourceTitle: 'Web source', createdAt: now, dueAt: now, intervalDays: 0, reviews: 0 }]));
    });
    await web.reload();
    const webDownloadEvent = web.waitForEvent('download');
    await web.getByRole('button', { name: 'Export JSON' }).click();
    const webDownload = await webDownloadEvent;
    const webBackupPath = join(downloadDirectory, 'web-to-extension.json');
    await webDownload.saveAs(webBackupPath);
    const webBackup = JSON.parse(await readFile(webBackupPath, 'utf8')) as { version: number; notes: Array<{ id: string; passage: string }> };
    expect(webBackup).toMatchObject({ version: 1, notes: [{ id: 'from-web', passage: 'La pratique rend les mots familiers.' }] });
    await popup.getByLabel('Import notes from JSON').setInputFiles(webBackupPath);
    await expect(popup.getByText('Web source')).toBeVisible();
    expect(await popup.evaluate(async () => ((await chrome.storage.local.get('rmr:notes'))['rmr:notes'] as Array<{ id: string }>)[0]?.id)).toBe('from-web');
  } finally {
    await webToExtension.context.close();
  }
});

test('@claim:extension-download @regression:production-download serves the exact built MV3 package', async ({ request }) => {
  const response = await request.get('/downloads/reading-margin-recall-chrome.zip');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/zip');
  const servedArchive = await response.body();
  expect(servedArchive.byteLength).toBeGreaterThan(10_000);
  const zipPath = 'dist/site/downloads/reading-margin-recall-chrome.zip';
  expect((await stat(zipPath)).size).toBeGreaterThan(10_000);
  const builtArchive = await readFile(zipPath);
  expect(createHash('sha256').update(servedArchive).digest('hex')).toBe(createHash('sha256').update(builtArchive).digest('hex'));
  const buildReceipt = JSON.parse(await readFile('dist/site/build-info.json', 'utf8')) as { commit?: string; extension?: { bytes?: number; path?: string; sha256?: string } };
  expect(buildReceipt.commit).toMatch(/^[0-9a-f]{40}$/);
  expect(buildReceipt.extension).toEqual({
    path: '/downloads/reading-margin-recall-chrome.zip',
    bytes: servedArchive.byteLength,
    sha256: createHash('sha256').update(servedArchive).digest('hex')
  });
  expect(() => execFileSync('unzip', ['-t', zipPath], { stdio: 'pipe' })).not.toThrow();
  const manifest = JSON.parse(await readFile('.output/chrome-mv3/manifest.json', 'utf8')) as { manifest_version?: number };
  expect(manifest.manifest_version).toBe(3);
});

test('@claim:delete-notes removes a saved note from this device', async ({ page }) => {
  await page.goto('/library');
  await page.evaluate(() => localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'delete-me', passage: 'La lune éclaire le chemin.', gloss: 'The moon lights the path.', deletion: 'lune', sourceUrl: 'https://example.com/moon', sourceTitle: 'French note', createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 }])));
  await page.reload();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No notes saved yet' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('rmr:notes'))).not.toContain('delete-me');
});

test('@claim:site-data-boundary clears web-app data without touching extension notes', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  const profile = await openIsolatedTransferProfile(testInfo, 'site-data-boundary');
  try {
    const { context, popup } = profile;
    const web = await context.newPage();
    await web.goto('http://127.0.0.1:4173/privacy');
    await expect(web.getByText('Clear this site’s data to remove web-app notes and color settings.')).toBeVisible();
    await expect(web.getByText('Delete extension notes from the extension separately.')).toBeVisible();
    await web.evaluate(() => {
      localStorage.setItem('rmr:notes', '[{"id":"web-note"}]');
      localStorage.setItem('rmr:theme', 'dark');
      localStorage.setItem('demo:rmr:notes', '[{"id":"demo-note"}]');
      localStorage.setItem('demo:rmr:theme', 'light');
    });
    await popup.evaluate(async () => {
      await chrome.storage.local.set({ 'rmr:notes': [{ id: 'extension-note', passage: 'Extension notes stay separate.' }] });
    });
    expect(await web.evaluate(() => Object.keys(localStorage).sort())).toEqual(['demo:rmr:notes', 'demo:rmr:theme', 'rmr:notes', 'rmr:theme']);

    const session = await context.newCDPSession(web);
    await session.send('Storage.clearDataForOrigin', { origin: 'http://127.0.0.1:4173', storageTypes: 'local_storage' });
    await session.detach();

    expect(await web.evaluate(() => Object.keys(localStorage))).toEqual([]);
    await web.goto('http://127.0.0.1:4173/library');
    await expect(web.getByRole('heading', { name: 'No notes saved yet' })).toBeVisible();
    expect(await popup.evaluate(async () => (await chrome.storage.local.get('rmr:notes'))['rmr:notes'])).toEqual([
      expect.objectContaining({ id: 'extension-note', passage: 'Extension notes stay separate.' })
    ]);
  } finally {
    await profile.context.close();
  }
});

test('@claim:http-source-links @regression:source-url-scheme rejects non-web URLs and never renders them as links', async ({ page }) => {
  await page.goto('/library');
  await page.getByLabel('Selected passage *').fill('Je garde cette phrase pour demain.');
  await page.getByLabel('Your gloss *').fill('I keep this sentence for tomorrow.');
  await page.getByLabel('Word to hide *').selectOption('demain');
  await page.getByLabel('Source title *').fill('Unsafe source test');
  await page.getByLabel('Source URL *').fill("javascript:document.body.setAttribute('data-rmr-qa','executed')");
  await page.getByRole('button', { name: 'Save review note' }).click();
  await expect(page.getByRole('alert')).toHaveText('The source link must start with http:// or https://. Paste the full web address.');
  await expect(page.getByText('No notes saved yet')).toBeVisible();
  await page.evaluate(() => localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'old-unsafe', passage: 'A saved unsafe note.', gloss: 'Old data.', deletion: 'unsafe', sourceUrl: 'javascript:alert(1)', sourceTitle: 'Old source', createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 }])));
  await page.reload();
  await expect(page.getByText('Source link unavailable')).toBeVisible();
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
});

test('@regression:incomplete-import-is-atomic rejects a structurally incomplete backup without poisoning saved notes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo');
  const before = await page.evaluate(() => localStorage.getItem('demo:rmr:notes'));
  await page.getByLabel('Import JSON').setInputFiles({
    name: 'incomplete-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ version: 1, notes: [{ sourceUrl: 'https://example.com' }] }))
  });
  await expect(page.locator('#announcer')).toHaveText('That file could not be imported. No notes were changed. Choose a complete Reading Margin Recall JSON backup.');
  expect(await page.evaluate(() => localStorage.getItem('demo:rmr:notes'))).toBe(before);
  await page.reload();
  await expect(page.getByText('3 saved notes')).toBeVisible();
  expect(errors).toEqual([]);
});

test('@regression:storage-write-failure-keeps-capture-form-and-never-announces-success', async ({ page }) => {
  await page.goto('/library');
  await page.getByLabel('Selected passage *').fill('La memoria vuelve cuando leo despacio.');
  await page.getByLabel('Your gloss *').fill('Memory returns when I read slowly.');
  await page.getByLabel('Word to hide *').selectOption('memoria');
  await page.getByLabel('Source title *').fill('Storage boundary');
  await page.getByLabel('Source URL *').fill('https://example.com/storage-boundary');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key: string, value: string) {
      if (key === 'rmr:notes') throw new DOMException('Storage full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Save review note' }).click();
  await expect(page.getByRole('alert')).toHaveText('The note was not saved because browser storage is unavailable. Your text is still here; free space, then save again.');
  await expect(page.getByLabel('Selected passage *')).toHaveValue('La memoria vuelve cuando leo despacio.');
  await expect(page.locator('#announcer')).toHaveText('The note was not saved because browser storage is unavailable.');
  expect(await page.evaluate(() => localStorage.getItem('rmr:notes'))).toBeNull();
});

test('@regression:demo-source-return-link-is-live', async ({ page, request }) => {
  await page.goto('/demo');
  const href = await page.getByRole('link', { name: /Open original page Don Quijote de la Mancha, capítulo I/ }).getAttribute('href');
  expect(href).toBe('https://es.wikisource.org/wiki/Don_Quijote_de_la_Mancha');
  const source = await request.get(href!);
  expect(source.status()).toBe(200);
});
