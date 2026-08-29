import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';

declare const chrome: {
  storage: { local: { set(value: Record<string, unknown>): Promise<void>; get(key: string): Promise<Record<string, unknown>> } };
  downloads: { search(query: Record<string, unknown>): Promise<Array<{ filename: string }>> };
};

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

test('@claim:local-only sends no reading data off origin', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url()); });
  await page.goto('/demo');
  await page.getByLabel('Selected passage *').fill('Je relis cette phrase demain.');
  await page.getByLabel('Your gloss *').fill('I reread this sentence tomorrow.');
  await page.getByLabel('Word to hide *').selectOption('demain');
  await page.getByLabel('Source title *').fill('Private article');
  await page.getByLabel('Source URL *').fill('https://example.com/private');
  await page.getByRole('button', { name: 'Save review note' }).click();
  expect(crossOrigin).toEqual([]);
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
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    channel: 'chromium',
    acceptDownloads: true,
    args: [`--disable-extensions-except=${process.cwd()}/.output/chrome-mv3`, `--load-extension=${process.cwd()}/.output/chrome-mv3`]
  });
  try {
    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions');
    const extensionId = await extensionsPage.locator('extensions-manager').evaluate((manager) => manager.shadowRoot?.querySelector('extensions-item-list')?.shadowRoot?.querySelector('extensions-item')?.getAttribute('id'));
    expect(extensionId).toBeTruthy();
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.evaluate(async () => {
      const now = new Date().toISOString();
      await chrome.storage.local.set({ 'rmr:notes': [{ id: 'from-extension', passage: 'Die Erinnerung wächst beim Wiederholen.', gloss: 'Memory grows through review.', deletion: 'Erinnerung', sourceUrl: 'https://example.com/extension-note', sourceTitle: 'Extension source', createdAt: now, dueAt: now, intervalDays: 0, reviews: 0 }] });
    });
    await popup.reload();
    await popup.getByRole('button', { name: 'Export notes as JSON' }).click();
    await expect(popup.locator('#live')).toHaveText('1 notes exported for the web app.');
    const extensionDownloadPath = await popup.evaluate(async () => (await chrome.downloads.search({ orderBy: ['-startTime'], limit: 1 }))[0]?.filename);
    expect(extensionDownloadPath).toBeTruthy();
    const extensionBackup = await readFile(extensionDownloadPath!);

    const web = await context.newPage();
    await web.goto('http://127.0.0.1:4173/library');
    await web.evaluate((contents) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([contents], 'extension-backup.json', { type: 'application/json' }));
      const input = document.querySelector<HTMLInputElement>('#import-file')!;
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, extensionBackup.toString('utf8'));
    await expect(web.getByText('Die Erinnerung wächst beim Wiederholen.')).toBeVisible();

    await web.evaluate(() => {
      const now = new Date().toISOString();
      localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'from-web', passage: 'La pratique rend les mots familiers.', gloss: 'Practice makes words familiar.', deletion: 'pratique', sourceUrl: 'https://example.com/web-note', sourceTitle: 'Web source', createdAt: now, dueAt: now, intervalDays: 0, reviews: 0 }]));
    });
    await web.reload();
    const webDownloadEvent = web.waitForEvent('download');
    await web.getByRole('button', { name: 'Export JSON' }).click();
    const webBackup = await readFile((await (await webDownloadEvent).path())!);
    await popup.evaluate((contents) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([contents], 'web-backup.json', { type: 'application/json' }));
      const input = document.querySelector<HTMLInputElement>('#import-notes')!;
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, webBackup.toString('utf8'));
    await expect(popup.getByText('Web source')).toBeVisible();
    expect(await popup.evaluate(async () => ((await chrome.storage.local.get('rmr:notes'))['rmr:notes'] as Array<{ id: string }>)[0]?.id)).toBe('from-web');
  } finally {
    await context.close();
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
