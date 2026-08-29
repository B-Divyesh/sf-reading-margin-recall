import { expect, test } from '@playwright/test';

test('@claim:offline-reload works after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Review a sample passage' })).toBeVisible();
  await expect(page.getByText('3 saved notes')).toBeVisible();
});

test('@regression:service-worker-update keeps one active current worker', async ({ page }) => {
  await page.goto('/demo');
  const state = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return {
      active: registration.active?.scriptURL,
      waiting: registration.waiting?.scriptURL ?? null,
      controlled: navigator.serviceWorker.controller?.scriptURL
    };
  });
  expect(state.active).toBe('http://127.0.0.1:4173/sw.js');
  expect(state.controlled).toBe('http://127.0.0.1:4173/sw.js');
  expect(state.waiting).toBeNull();
});
