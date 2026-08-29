import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { access, readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

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

test('@regression:routes set unique titles, descriptions, canonicals, and social metadata', async ({ page }) => {
  const routes = [
    ['/', 'Reading Margin Recall — Save passages for review', '/'],
    ['/?demo=1', 'Demo — Reading Margin Recall', '/?demo=1'],
    ['/library', 'My notes — Reading Margin Recall', '/library'],
    ['/review', 'Review — Reading Margin Recall', '/review'],
    ['/privacy', 'Privacy — Reading Margin Recall', '/privacy'],
    ['/terms', 'Terms — Reading Margin Recall', '/terms']
  ] as const;
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{20,155}$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://reading-margin-recall.sociobot.in${canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://reading-margin-recall.sociobot.in${canonical}`);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
  }
});

test('@regression:mobile targets and readable text meet the 390px baseline on every route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/library', '/review?demo=1', '/privacy', '/terms', '/404.html']) {
    await page.goto(route);
    const audit = await page.evaluate(() => {
      const visible = (element: Element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
      };
      const targets = [...document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, [role="button"]')]
        .filter(visible)
        .map((element) => {
          const target = element.matches('input[type="file"]') ? element.closest('label') ?? element : element;
          const box = target.getBoundingClientRect();
          return {
            name: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.tagName,
            width: box.width,
            height: box.height
          };
        })
        .filter(({ width, height }) => width < 44 || height < 44);
      const text = [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((element) => visible(element) && !element.closest('.sr-only'))
        .filter((element) => [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
        .map((element) => ({
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80),
          pixels: Number.parseFloat(getComputedStyle(element).fontSize)
        }))
        .filter(({ pixels }) => pixels < 16);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        targets,
        text
      };
    });
    expect(audit.overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
    expect(audit.targets, `${route} undersized targets`).toEqual([]);
    expect(audit.text, `${route} text below 16px`).toEqual([]);
  }
});

test('@regression:demo-exit discards edited demo storage through ordinary navigation', async ({ page }) => {
  const addDemoEdit = async () => page.evaluate(() => {
    const notes = JSON.parse(localStorage.getItem('demo:rmr:notes') ?? '[]');
    notes.push({ ...notes[0], id: `edited-${notes.length}` });
    localStorage.setItem('demo:rmr:notes', JSON.stringify(notes));
    localStorage.setItem('demo:rmr:theme', 'dark');
  });

  await page.goto('/demo');
  await addDemoEdit();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('demo:rmr:notes') ?? '[]').length)).toBe(4);
  await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL('/privacy');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);

  await page.goto('/demo');
  await addDemoEdit();
  await page.getByRole('link', { name: 'Reading Margin Recall home' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('@regression:built-404 is product-owned, accessible, and same-origin', async ({ page }) => {
  const crossOrigin: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Reading Margin Recall');
  await expect(page.getByRole('heading', { level: 1, name: 'We could not find this page' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveCount(4);
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /not found/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://reading-margin-recall.sociobot.in/404.html');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(crossOrigin).toEqual([]);
  expect(errors).toEqual([]);
});

test('@regression:first-screen shows all facts and an actionable sample at required viewports', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const text of ['Stays on this device', 'Works after the first visit', 'All tools are free']) {
      const box = await page.getByText(text, { exact: true }).boundingBox();
      expect(box, `${text} is missing at ${viewport.width}px`).not.toBeNull();
      expect(box!.y + box!.height, `${text} is below the first screen at ${viewport.width}px`).toBeLessThanOrEqual(viewport.height);
    }
    await page.getByRole('link', { name: 'Try it with sample data' }).click();
    await expect(page).toHaveURL(/\?demo=1$/);
    const sample = page.locator('.sample-sheet');
    const action = page.getByRole('button', { name: 'Reveal sample answer' });
    await expect(sample).toContainText('Life is a flower whose honey is love.');
    const actionBox = await action.boundingBox();
    expect(actionBox, `sample action is missing at ${viewport.width}px`).not.toBeNull();
    expect(actionBox!.y + actionBox!.height, `sample action is below the first demo screen at ${viewport.width}px`).toBeLessThanOrEqual(viewport.height);
  }
});

test('@regression:history restores scroll, focus, and live announcements', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, 900));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(800);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'My notes' }).evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#announcer')).toHaveText('Save a passage for later recall page loaded.');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Save passages for later recall' })).toBeFocused();
  await expect(page.locator('#announcer')).toHaveText('Save passages for later recall page loaded.');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(800);
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: 'Save a passage for later recall' })).toBeFocused();
  await expect(page.locator('#announcer')).toHaveText('Save a passage for later recall page loaded.');
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
    mimeTypes: Record<string, string>;
    responseOverrides: Record<string, { rewrite: string }>;
    routes: Array<{ route: string; statusCode?: number; rewrite?: string; headers?: Record<string, string> }>;
  };
  const csp = config.globalHeaders['Content-Security-Policy'];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("connect-src 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).not.toContain('api.sociobot.in');
  expect(config.globalHeaders['X-Content-Type-Options']).toBe('nosniff');
  expect(config.globalHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  expect(config.globalHeaders['Strict-Transport-Security']).toContain('max-age=31536000');
  expect(config.globalHeaders['Cache-Control']).toBe('public, must-revalidate, max-age=30');
  expect(config.mimeTypes['.zip']).toBe('application/zip');
  expect(config.responseOverrides).toEqual({ '404': { rewrite: '/404.html' } });
  expect(config.routes).toContainEqual({ route: '/', rewrite: '/index.html' });
  expect(config.routes).toContainEqual({ route: '/404.html', headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  expect(config.routes).toContainEqual({ route: '/build-info.json', headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  await access('site/404.html');
  await access('site/public/404.css');
  await access('dist/site/404.html');
  const built404 = await readFile('dist/site/404.html', 'utf8');
  expect(built404).toContain('<h1>We could not find this page</h1>');
  const absoluteUrls = [...built404.matchAll(/https?:\/\/[^"'\s<]+/g)].map((match) => new URL(match[0]));
  expect(absoluteUrls.every((url) => url.origin === 'https://reading-margin-recall.sociobot.in')).toBe(true);
});

test('@regression:build-site creates the complete deploy root from nothing', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await rm('dist/site', { recursive: true, force: true });
  const output = execFileSync('npm', ['run', 'build:site'], { encoding: 'utf8' });
  const report = JSON.parse(output.slice(output.indexOf('{'))) as {
    siteRoot: string;
    commit: string;
    extension: { bytes: number; sha256: string; manifestVersion: number };
    receipt: { commit: string; extension: { path: string; bytes: number; sha256: string } };
  };
  const zip = await readFile('dist/site/downloads/reading-margin-recall-chrome.zip');
  expect(report.siteRoot).toBe(`${process.cwd()}/dist/site`);
  expect(report.commit).toBe(report.receipt.commit);
  expect(report.extension.manifestVersion).toBe(3);
  expect(report.receipt.extension).toEqual({
    path: '/downloads/reading-margin-recall-chrome.zip',
    bytes: zip.byteLength,
    sha256: createHash('sha256').update(zip).digest('hex')
  });
  await access('dist/site/404.html');
  await access('dist/site/404.css');
  await access('dist/site/staticwebapp.config.json');
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
    await expect(root.locator('#rmr-gloss')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(root.locator('dialog')).not.toBeVisible();
    await expect(root.locator('.capture-chip')).toBeVisible();
    await expect(root.locator('.capture-chip')).toBeFocused();
    await root.locator('.capture-chip').click();
    await root.locator('#rmr-gloss').fill('A short explanation in my words.');
    await root.locator('#rmr-deletion').selectOption({ index: 1 });
    await root.locator('#rmr-save').click();
    await expect(root.locator('.success')).toContainText('Passage saved');
    expect(await page.evaluate(() => localStorage.getItem('rmr:notes'))).toBeNull();

    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions');
    const extensionId = await extensionsPage.locator('extensions-manager').evaluate((manager) => {
      const list = manager.shadowRoot?.querySelector('extensions-item-list')?.shadowRoot;
      return list?.querySelector('extensions-item')?.getAttribute('id');
    });
    expect(extensionId).toBeTruthy();
    await extensionsPage.close();

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.getByRole('heading', { name: 'Recall the missing word' })).toBeVisible();
    const saved = await popup.evaluate(async () => {
      const extensionApi = (globalThis as typeof globalThis & {
        chrome: { storage: { local: { get(key: string): Promise<Record<string, unknown>> } } };
      }).chrome;
      return (await extensionApi.storage.local.get('rmr:notes'))['rmr:notes'] as Array<{ passage: string; gloss: string }>;
    });
    expect(saved).toHaveLength(1);
    expect(saved[0]).toEqual(expect.objectContaining({
      passage: 'For language learners who want selected sentences to become source-linked review notes.',
      gloss: 'A short explanation in my words.'
    }));
    const popupAxe = await new AxeBuilder({ page: popup as never }).analyze();
    expect(popupAxe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    await popup.keyboard.press('Space');
    await expect(popup.getByText(/Hidden word:/)).toBeVisible();
    await popup.keyboard.press('4');
    await expect(popup.getByText(/Hidden word:/)).not.toBeVisible();
    const sourcePagePromise = context.waitForEvent('page');
    await popup.getByRole('button', { name: 'Open original page' }).click();
    const sourcePage = await sourcePagePromise;
    await sourcePage.waitForLoadState('domcontentloaded');
    expect(sourcePage.url()).toBe('http://127.0.0.1:4173/');
    await sourcePage.close();
    popup.once('dialog', (dialog) => dialog.accept());
    await popup.getByRole('button', { name: 'Delete note' }).click();
    await expect(popup.getByRole('heading', { name: 'Save a passage to begin' })).toBeVisible();
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
