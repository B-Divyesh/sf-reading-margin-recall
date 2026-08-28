import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';

test('@claim:source-linked-capture saves a full recall note', async ({ page }) => {
  await page.goto('/library');
  await page.getByLabel('Selected passage *').fill('La memoria vuelve cuando leo despacio.');
  await page.getByLabel('Your gloss *').fill('Memory returns when I read slowly.');
  await page.getByLabel('Word to hide *').selectOption('memoria');
  await page.getByLabel('Source title *').fill('My Spanish reading');
  await page.getByLabel('Source URL *').fill('https://example.com/spanish-reading');
  await page.getByRole('button', { name: 'Save review note' }).click();
  await expect(page.getByText('La memoria vuelve cuando leo despacio.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source/ })).toHaveAttribute('href', 'https://example.com/spanish-reading');
});

test('@claim:demo-isolated keeps real notes separate', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'real-note' }])));
  await page.goto('/demo');
  await expect(page.getByText('3 saved passages')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
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
  await expect(page.getByText('1 saved passage')).toBeVisible();
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
  await expect(page.getByText('Every tool is free to use. No account or subscription is required.')).toBeVisible();
  await expect(page.getByText(/Study Edition|Buy Study Edition|Restore a purchase/)).toHaveCount(0);
  await expect(page.locator('a[href*="api.sociobot.in"]')).toHaveCount(0);
  await page.evaluate(() => {
    localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'free', passage: 'Ich lese jeden Tag.', gloss: 'I read every day.', deletion: 'lese', sourceUrl: 'https://example.com', sourceTitle: 'German notes', createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 }]));
  });
  await page.goto('/review');
  await expect(page.getByLabel('Difficult notes only')).toBeVisible();
  await expect(page.getByLabel('Source')).toContainText('German notes');
  await page.getByLabel('Difficult notes only').check();
  await expect(page).toHaveURL(/difficult=1/);
  await page.getByLabel('Source').selectOption({ label: 'German notes' });
  await expect(page).toHaveURL(/source=German\+notes/);
  await page.goto('/terms');
  await expect(page.getByText('Capture, review, filters, source links, JSON export, and JSON import are free.')).toBeVisible();
  expect(crossOrigin).toEqual([]);
  const deploymentConfig = await readFile('site/public/staticwebapp.config.json', 'utf8');
  expect(deploymentConfig).not.toContain('api.sociobot.in');
});

test('@claim:extension-download @regression:production-download serves a valid MV3 package', async ({ request }) => {
  const response = await request.get('/downloads/reading-margin-recall-chrome.zip');
  expect(response.status()).toBe(200);
  expect((await response.body()).byteLength).toBeGreaterThan(10_000);
  const zipPath = 'dist/site/downloads/reading-margin-recall-chrome.zip';
  expect((await stat(zipPath)).size).toBeGreaterThan(10_000);
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
  await expect(page.getByRole('heading', { name: 'No passages saved yet' })).toBeVisible();
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
  await expect(page.getByText('No passages saved yet')).toBeVisible();
  await page.evaluate(() => localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'old-unsafe', passage: 'A saved unsafe note.', gloss: 'Old data.', deletion: 'unsafe', sourceUrl: 'javascript:alert(1)', sourceTitle: 'Old source', createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 }])));
  await page.reload();
  await expect(page.getByText('Source link unavailable')).toBeVisible();
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
});
