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

test('@claim:demo-sample opens the isolated sample from the one-click query path', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Adjust a meal for today' })).toBeVisible();
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Lentil desk lunch', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(2);

  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  await expect(page.getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('row')).toHaveCount(2);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
});

test('@claim:erase-confirmation asks before clearing only the active workspace', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  let prompt = '';
  page.once('dialog', async (dialog) => { prompt = dialog.message(); await dialog.dismiss(); });
  await page.getByRole('button', { name: 'Erase all records' }).click();
  expect(prompt).toContain('Erase every meal template and log in this browser?');
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();

  await page.goto('/app/new');
  await page.getByLabel('Template name').fill('Real meal survives demo erase');
  await page.getByLabel('Meal label').fill('Breakfast');
  const ingredients = page.locator('.ingredient-editor');
  await ingredients.nth(0).getByLabel('Ingredient name').fill('Toast');
  await ingredients.nth(1).getByLabel('Ingredient name').fill('Eggs');
  await page.getByRole('button', { name: 'Save meal template' }).click();
  await expect(page.getByRole('heading', { name: 'Real meal survives demo erase' })).toBeVisible();

  await page.goto('/demo');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Erase all records' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  await page.goto('/app');
  await expect(page.getByRole('heading', { name: 'Real meal survives demo erase' })).toBeVisible();
});

test('@claim:free-product exposes the full flow without payment', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'Log adjusted meal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
  await expect(page.getByRole('link', { name: /buy|pay|upgrade/i })).toHaveCount(0);
});

test('@claim:validated-json-import rejects malformed backups without changing real records', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/app/new');
  await page.getByLabel('Template name').fill('Keep this breakfast');
  await page.getByLabel('Meal label').fill('Breakfast');
  const ingredients = page.locator('.ingredient-editor');
  await ingredients.nth(0).getByLabel('Ingredient name').fill('Porridge');
  await ingredients.nth(1).getByLabel('Ingredient name').fill('Berries');
  await page.getByRole('button', { name: 'Save meal template' }).click();
  await expect(page.getByRole('heading', { name: 'Keep this breakfast' })).toBeVisible();

  const before = await readRealState(page);
  await page.locator('#import-file').setInputFiles({
    name: 'malformed.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":1,"templates":[{}],"logs":[]}')
  });

  await expect(page.getByRole('status')).toHaveText('That file is not a valid backup. Choose a JSON backup exported by this app. Your records were not changed.');
  await expect(page.getByRole('heading', { name: 'Keep this breakfast' })).toBeVisible();
  expect(await readRealState(page)).toEqual(before);

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Keep this breakfast' })).toBeVisible();
  expect(await readRealState(page)).toEqual(before);
  expect(pageErrors).toEqual([]);
});

test('landing and demo have no serious accessibility violations', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('routes update title, descriptions, and social descriptions', async ({ page }) => {
  const expected = [
    ['/app', 'Your meals — Flex Meal Templates', 'Save meal templates, adjust today’s portions, and compare nutrition with each meal’s bands.'],
    ['/app/new', 'New meal — Flex Meal Templates', 'Create a reusable meal template with ingredients and nutrition bands.'],
    ['/demo', 'Demo — Flex Meal Templates', 'Try two sample meals and one saved log without changing your personal records.'],
    ['/privacy', 'Privacy — Flex Meal Templates', 'Read how Flex Meal Templates stores meal records in your browser and keeps demo data separate.'],
    ['/terms', 'Terms — Flex Meal Templates', 'Read the terms for using Flex Meal Templates as a personal meal-recording utility.'],
    ['/missing-page', 'Page not found — Flex Meal Templates', 'This Flex Meal Templates page could not be found.']
  ] as const;
  for (const [path, title, description] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
  }
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Flex Meal Templates');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://flex-meal-templates.sociobot.in/demo');
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

async function readRealState(page: import('@playwright/test').Page): Promise<unknown> {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('flex-meals-real', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const request = open.result.transaction('app').objectStore('app').get('state');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as unknown);
    };
  }));
}
