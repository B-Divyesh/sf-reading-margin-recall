import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { access, readFile } from 'node:fs/promises';

for (const route of ['/', '/demo', '/library', '/review', '/privacy', '/terms', '/missing-page']) {
  test(`page quality ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Reading Margin Recall/);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('mobile layout stays within 390px', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
});

test('keyboard focus and reduced motion remain usable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  const focus = await skip.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: style.outlineWidth, style: style.outlineStyle };
  });
  expect(Number.parseFloat(focus.width)).toBeGreaterThanOrEqual(3);
  expect(focus.style).not.toBe('none');
  const motion = await page.locator('.button').first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { animation: style.animationDuration, transition: style.transitionDuration };
  });
  expect(Number.parseFloat(motion.animation) || 0).toBeLessThanOrEqual(0.001);
  expect(Number.parseFloat(motion.transition) || 0).toBeLessThanOrEqual(0.001);
  await skip.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('deployment policy keeps execution and requests same-origin', async () => {
  const config = JSON.parse(await readFile('site/public/staticwebapp.config.json', 'utf8')) as {
    globalHeaders: Record<string, string>;
    responseOverrides: Record<string, { rewrite: string }>;
    routes: Array<{ route: string; statusCode?: number; rewrite?: string }>;
  };
  const csp = config.globalHeaders['Content-Security-Policy'];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("connect-src 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).not.toContain('api.sociobot.in');
  expect(config.globalHeaders['X-Content-Type-Options']).toBe('nosniff');
  expect(config.globalHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  expect(config.responseOverrides).toEqual({ '404': { rewrite: '/404.html' } });
  expect(config.routes).toContainEqual({ route: '/', rewrite: '/index.html' });
  expect(config.routes).toContainEqual({ route: '/*', statusCode: 404 });
  await access('site/404.html');
  await access('site/public/404.css');
});

test('extension build is packaged as MV3', async () => {
  await access('dist/site/downloads/reading-margin-recall-chrome.zip');
  const manifest = JSON.parse(await readFile('.output/chrome-mv3/manifest.json', 'utf8')) as { manifest_version: number; content_scripts?: unknown[] };
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.content_scripts).toHaveLength(1);
});

test('@claim:extension-selection captures only selected page text', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  const extensionPath = `${process.cwd()}/.output/chrome-mv3`;
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    channel: 'chromium',
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => {
      const text = document.querySelector('.lede')!.firstChild!;
      const range = document.createRange();
      range.selectNodeContents(text);
      const selection = getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    const root = page.locator('#reading-margin-recall-root');
    expect((await root.locator('.capture-chip').boundingBox())?.height).toBeGreaterThanOrEqual(44);
    await root.locator('.capture-chip').click();
    await expect(root.locator('#rmr-passage')).toHaveText('For language learners who want selected sentences to become source-linked review notes.');
    await root.locator('#rmr-gloss').fill('A short explanation in my words.');
    await root.locator('#rmr-deletion').selectOption({ index: 1 });
    await root.locator('#rmr-save').click();
    await expect(root.locator('.success')).toContainText('Passage saved');
    expect(await page.evaluate(() => localStorage.getItem('rmr:notes'))).toBeNull();
  } finally {
    await context.close();
  }
});

test('dark treatment has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('rmr:theme', 'dark'));
  await page.reload();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});
