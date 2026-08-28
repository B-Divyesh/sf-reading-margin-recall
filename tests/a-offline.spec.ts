import { expect, test } from '@playwright/test';

test('@claim:offline-reload works after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Explore saved sample passages' })).toBeVisible();
  await expect(page.getByText('3 saved passages')).toBeVisible();
});
