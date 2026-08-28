import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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

test('@claim:paid-study-edition uses the Sociobot checkout', async ({ page }) => {
  await page.goto('/');
  const buy = page.getByRole('link', { name: /Buy Study Edition/ });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/reading-margin-recall/checkout');
  await expect(page.getByText('$12')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restore a purchase' })).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem('sb_license_verdict:reading-margin-recall', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    localStorage.setItem('rmr:notes', JSON.stringify([{ id: 'paid', passage: 'Ich lese jeden Tag.', gloss: 'I read every day.', deletion: 'lese', sourceUrl: 'https://example.com', sourceTitle: 'German notes', createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 }]));
  });
  await page.goto('/review');
  await expect(page.getByLabel('Difficult notes only')).toBeVisible();
  await expect(page.getByLabel('Source')).toContainText('German notes');
});
