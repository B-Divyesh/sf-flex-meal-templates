import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('@claim:portion-adjust updates totals and keeps the base template', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Adjust a meal for today' })).toBeVisible();
  await page.getByLabel('Portion multiplier as a number').fill('0.75');
  await expect(page.locator('[data-nutrient="calories"] [data-total]')).toHaveText('386');
  await expect(page.locator('[data-nutrient="calories"] [data-state]')).toHaveText('below range');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  await expect(page.getByRole('status')).toContainText('Adjusted meal logged');
  await page.getByRole('link', { name: 'Edit meal template' }).click();
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
  await expect(page.getByText('You are offline. Meal templates and logging still work.')).toBeVisible();

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
  await page.getByLabel('Portion multiplier as a number').fill('1.1');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();
  expect(external).toEqual([]);
});

test('@claim:csv-json-export downloads complete usable files', async ({ page }) => {
  await page.goto('/demo');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = await (await csvDownload).createReadStream();
  const csvText = await streamText(csv);
  expect(csvText).toContain('"logged_at","template","portion_multiplier","calories_kcal"');
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
  await page.getByRole('link', { name: 'Create your first meal template' }).click();
  await page.getByLabel('Meal template name').fill('Real weekday toast');
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Adjust a meal for today' })).toBeVisible();
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Lentil desk lunch', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(2);
  await expect(page.locator('.portion-control')).toBeInViewport();
  await expect(page.locator('[data-nutrient="calories"]')).toBeInViewport();

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
  await page.getByLabel('Meal template name').fill('Real meal survives demo erase');
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
  await page.getByLabel('Meal template name').fill('Keep this breakfast');
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

test('@claim:template-authoring saves custom nutrition ranges and uses them in a log', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByRole('link', { name: 'Create your first meal template' }).click();

  await page.getByLabel('Meal template name').fill('Custom range breakfast');
  await page.getByLabel('Meal label').fill('Breakfast');
  const ingredients = page.locator('.ingredient-editor');
  await ingredients.nth(0).getByLabel('Ingredient name').fill('Oats');
  await ingredients.nth(0).getByLabel('Base amount').fill('50');
  await ingredients.nth(0).locator('[name="ingredient-calories"]').fill('180');
  await ingredients.nth(0).locator('[name="ingredient-protein"]').fill('6');
  await ingredients.nth(0).locator('[name="ingredient-carbs"]').fill('30');
  await ingredients.nth(0).locator('[name="ingredient-fat"]').fill('3');
  await ingredients.nth(1).getByLabel('Ingredient name').fill('Yogurt');
  await ingredients.nth(1).getByLabel('Base amount').fill('100');
  await ingredients.nth(1).locator('[name="ingredient-calories"]').fill('80');
  await ingredients.nth(1).locator('[name="ingredient-protein"]').fill('10');
  await ingredients.nth(1).locator('[name="ingredient-carbs"]').fill('8');
  await ingredients.nth(1).locator('[name="ingredient-fat"]').fill('1');

  const ranges = {
    calories: ['250', '270'],
    protein: ['15', '17'],
    carbs: ['35', '40'],
    fat: ['3', '5']
  } as const;
  for (const [nutrient, [minimum, maximum]] of Object.entries(ranges)) {
    await page.locator(`[name="${nutrient}-min"]`).fill(minimum);
    await page.locator(`[name="${nutrient}-max"]`).fill(maximum);
  }
  await page.getByRole('button', { name: 'Save meal template' }).click();

  await expect(page.getByRole('heading', { name: 'Custom range breakfast' })).toBeVisible();
  await expect(page.locator('[data-nutrient="calories"]')).toContainText('250–270 kcal');
  await expect(page.locator('[data-nutrient="protein"]')).toContainText('15–17 g');
  await expect(page.locator('.band-state')).toHaveText(['Within range', 'Within range', 'Within range', 'Within range']);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Custom range breakfast' })).toBeVisible();
  await expect(page.locator('[data-nutrient="carbs"]')).toContainText('35–40 g');
  await expect(page.locator('[data-nutrient="fat"]')).toContainText('3–5 g');
  await page.getByRole('button', { name: 'Log adjusted meal' }).click();

  const state = await readDatabaseState(page, 'flex-meals-real') as {
    templates: Array<{ name: string; bands: typeof ranges }>;
    logs: Array<{ templateName: string; totals: { calories: number; protein: number; carbs: number; fat: number } }>;
  };
  expect(state.templates[0].name).toBe('Custom range breakfast');
  expect(state.templates[0].bands).toEqual({
    calories: { min: 250, max: 270 }, protein: { min: 15, max: 17 }, carbs: { min: 35, max: 40 }, fat: { min: 3, max: 5 }
  });
  expect(state.logs[0]).toMatchObject({ templateName: 'Custom range breakfast', totals: { calories: 260, protein: 16, carbs: 38, fat: 4 } });
});

test('@claim:json-roundtrip restores every exported meal template and log', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const exportedText = await streamText(await (await downloadEvent).createReadStream());
  const exported = JSON.parse(exportedText) as unknown;

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Erase all records' }).click();
  await expect(page.getByRole('heading', { name: 'Build the meal you repeat' })).toBeVisible();
  await page.locator('#import-file').setInputFiles({
    name: 'flex-meal-templates-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportedText)
  });

  await expect(page.getByRole('status')).toHaveText('Backup imported.');
  expect(await readDatabaseState(page, 'flex-meals-demo')).toEqual(exported);
  await expect(page.getByText('Weekday overnight oats', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Lentil desk lunch', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(2);
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
    ['/app', 'Your meals — Flex Meal Templates', 'Save meal templates, adjust today’s portions, and compare nutrition with each meal’s ranges.'],
    ['/app/new', 'New meal — Flex Meal Templates', 'Create a meal template with ingredients and custom nutrition ranges.'],
    ['/demo', 'Demo — Flex Meal Templates', 'Try two sample meal templates with one portion ready to adjust, without changing your records.'],
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

test('invalid real and demo edit IDs use missing-page metadata', async ({ page }) => {
  for (const path of ['/app/edit?id=missing', '/demo/edit?id=missing']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page).toHaveTitle('Page not found — Flex Meal Templates');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'This Flex Meal Templates page could not be found.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://flex-meal-templates.sociobot.in/404');
  }
});

test('creates a real meal template with a substitute', async ({ page }) => {
  await page.goto('/app/new');
  await page.getByLabel('Meal template name').fill('Fast toast plate');
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
  return readDatabaseState(page, 'flex-meals-real');
}

async function readDatabaseState(page: import('@playwright/test').Page, databaseName: string): Promise<unknown> {
  return page.evaluate((name) => new Promise((resolve, reject) => {
    const open = indexedDB.open(name, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const request = open.result.transaction('app').objectStore('app').get('state');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as unknown);
    };
  }), databaseName);
}
