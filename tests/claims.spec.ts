import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('@claim:portion-adjust updates totals and keeps the base template', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Adjust a meal for today' })).toBeVisible();
  await page.getByLabel('Serving multiplier as a number').fill('0.75');
  await expect(page.locator('[data-nutrient="calories"] [data-total]')).toHaveText('386');
  await expect(page.locator('[data-nutrient="calories"] [data-state]')).toHaveText('below band');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  await expect(page.getByRole('status')).toContainText('Adjusted meal logged');
  await page.getByRole('link', { name: 'Edit template' }).click();
  await expect(page.locator('[name="ingredient-amount"]').first()).toHaveValue('60');
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await expect.poll(() => page.evaluate(async () => {
    const keys = await caches.keys();
    const requests = (await Promise.all(keys.map(async (key) => (await caches.open(key)).keys()))).flat();
    return requests.some((request) => /\/assets\/index-.+\.js$/.test(new URL(request.url).pathname));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('You are offline. Saved meals and logging still work.')).toBeVisible();

  await context.setOffline(false);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  await page.goto('/demo');
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
});

test('@claim:local-only sends no records away', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByLabel('Serving multiplier as a number').fill('1.1');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  expect(external).toEqual([]);
});

test('@claim:csv-json-export downloads complete usable files', async ({ page }) => {
  await page.goto('/demo');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = await (await csvDownload).createReadStream();
  const csvText = await streamText(csv);
  expect(csvText).toContain('"logged_at","template","serving_multiplier","calories_kcal"');
  expect(csvText.trim().split('\n')).toHaveLength(2);

  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const json = JSON.parse(await streamText(await (await jsonDownload).createReadStream())) as { templates: unknown[]; logs: unknown[] };
  expect(json.templates).toHaveLength(2);
  expect(json.logs).toHaveLength(1);
});

test('@claim:demo-isolation keeps demo and real databases separate', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('row')).toHaveCount(2);

  await page.getByRole('link', { name: 'Flex Meal Templates home' }).click();
  await page.getByRole('link', { name: 'Create your first template' }).click();
  await page.getByLabel('Template name').fill('Real weekday toast');
  await page.getByLabel('Meal label').fill('Breakfast');
  const ingredients = page.locator('.ingredient-editor');
  await ingredients.nth(0).getByLabel('Ingredient name').fill('Toast');
  await ingredients.nth(1).getByLabel('Ingredient name').fill('Eggs');
  await page.getByRole('button', { name: 'Save meal template' }).click();
  await expect(page.getByRole('heading', { name: 'Real weekday toast' })).toBeVisible();
  await page.goto('/demo');
  await expect(page.getByText('Real weekday toast', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
});

test('@claim:free-product exposes the full flow without payment', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'Log adjusted meal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
  await expect(page.getByRole('link', { name: /buy|pay|upgrade/i })).toHaveCount(0);
});

test('landing and demo have no serious accessibility violations', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('creates a real meal template with a substitute', async ({ page }) => {
  await page.goto('/app/new');
  await page.getByLabel('Template name').fill('Fast toast plate');
  await page.getByLabel('Meal label').fill('Breakfast');
  const ingredients = page.locator('.ingredient-editor');
  await ingredients.nth(0).getByLabel('Ingredient name').fill('Wholegrain toast');
  await ingredients.nth(0).getByText('Add one substitute').click();
  await ingredients.nth(0).getByLabel('Substitute name').fill('Rye toast');
  await ingredients.nth(1).getByLabel('Ingredient name').fill('Scrambled eggs');
  await page.getByRole('button', { name: 'Save meal template' }).click();
  await expect(page.getByRole('heading', { name: 'Fast toast plate' })).toBeVisible();
  await expect(page.getByLabel('Wholegrain toast', { exact: true })).toContainText('Use Rye toast');
});

async function streamText(stream: NodeJS.ReadableStream | null): Promise<string> {
  if (!stream) throw new Error('Download did not provide a stream.');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}
