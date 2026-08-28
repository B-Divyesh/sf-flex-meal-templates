import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('390px routes fit the viewport and keep their accessible structure', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  for (const path of ['/', '/demo', '/app/new', '/privacy', '/terms', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth
    }));
    expect(sizes.content, `${path} has horizontal overflow`).toBeLessThanOrEqual(sizes.viewport);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), `${path} has serious accessibility violations`).toEqual([]);
  }

  expect(consoleErrors).toEqual([]);
});

test('keyboard users can enter the demo and adjust a portion', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

  for (let press = 0; press < 12; press += 1) {
    if (await page.getByRole('link', { name: 'Try it with sample data' }).evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);

  const multiplier = page.getByRole('slider', { name: /^Serving multiplier/ });
  for (let press = 0; press < 20; press += 1) {
    if (await multiplier.evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(multiplier).toBeFocused();
  for (let press = 0; press < 5; press += 1) await page.keyboard.press('ArrowLeft');
  await expect(page.locator('[data-nutrient="calories"] [data-total]')).toHaveText('386');
});
