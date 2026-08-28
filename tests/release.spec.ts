import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

test('every declared claim has exactly one tagged browser test', () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  const browserTests = readFileSync('tests/claims.spec.ts', 'utf8');
  const taggedTests = [...browserTests.matchAll(/test\(['"]@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
  const declared = claims.map((claim) => claim.id);

  expect(new Set(declared).size).toBe(declared.length);
  expect(new Set(taggedTests).size).toBe(taggedTests.length);
  expect(taggedTests.sort()).toEqual(declared.sort());
  for (const claim of claims) expect(claim.test).toContain(`@claim:${claim.id}`);
});

test('390px routes fit the viewport and keep their accessible structure', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  for (const path of ['/', '/demo', '/app/new', '/privacy', '/terms', '/missing-page', '/404.html', '/offline.html']) {
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
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();

  const multiplier = page.getByRole('slider', { name: /^Portion multiplier/ });
  for (let press = 0; press < 20; press += 1) {
    if (await multiplier.evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(multiplier).toBeFocused();
  for (let press = 0; press < 5; press += 1) await page.keyboard.press('ArrowLeft');
  await expect(page.locator('[data-nutrient="calories"] [data-total]')).toHaveText('386');
});

test('static fallback pages use the complete site skeleton and route metadata', async ({ page }) => {
  const expected = [
    ['/404.html', 'Page not found — Flex Meal Templates', 'This Flex Meal Templates page could not be found.'],
    ['/offline.html', 'Offline — Flex Meal Templates', 'Reconnect or open a cached Flex Meal Templates page.']
  ] as const;
  for (const [path, title, description] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Flex Meal Templates home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy', exact: true })).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Built by Param Factory/ })).toBeVisible();
    await expect(page.getByText('Version 1.0.3')).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('a workspace corrupted by the previous release opens recovery controls', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/app');
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('flex-meals-real', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const transaction = open.result.transaction('app', 'readwrite');
      transaction.objectStore('app').put({ version: 1, templates: [{}], logs: [] }, 'state');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  }));

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Saved records need attention' })).toBeVisible();
  await expect(page.getByText('The records have not been changed.')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Erase damaged records' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});
