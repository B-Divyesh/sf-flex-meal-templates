import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = 'https://flex-meal-templates.sociobot.in';
const evidenceDir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const checks = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

async function waitFor(page, predicate, message, argument) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await page.evaluate(predicate, argument)) return;
    await page.waitForTimeout(100);
  }
  throw new Error(message);
}

const metadata = [
  ['/', 'Flex Meal Templates — Adjust meal portions', 'Adjust meal portions, compare them with saved nutrition ranges, and log them without changing the meal template.', '/'],
  ['/app', 'Your meals — Flex Meal Templates', 'Save meal templates, adjust today’s portions, and compare nutrition with each meal’s ranges.', '/app'],
  ['/app/new', 'New meal — Flex Meal Templates', 'Create a meal template with ingredients and custom nutrition ranges.', '/app/new'],
  ['/demo', 'Demo — Flex Meal Templates', 'Try two sample meal templates with one portion ready to adjust, without changing your records.', '/demo'],
  ['/demo/new', 'New sample meal — Flex Meal Templates', 'Add a meal template to the separate sample workspace.', '/demo/new'],
  ['/privacy', 'Privacy — Flex Meal Templates', 'Read how Flex Meal Templates stores meal records in your browser and keeps demo data separate.', '/privacy'],
  ['/terms', 'Terms — Flex Meal Templates', 'Read the terms for using Flex Meal Templates as a personal meal-recording utility.', '/terms'],
  ['/missing-page', 'Page not found — Flex Meal Templates', 'This Flex Meal Templates page could not be found.', '/404'],
  ['/app/edit?id=missing', 'Page not found — Flex Meal Templates', 'This Flex Meal Templates page could not be found.', '/404'],
  ['/demo/edit?id=missing', 'Page not found — Flex Meal Templates', 'This Flex Meal Templates page could not be found.', '/404']
];

const routeContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const routePage = await routeContext.newPage();
const routeErrors = [];
routePage.on('pageerror', (error) => routeErrors.push(error.message));
routePage.on('console', (message) => { if (message.type() === 'error') routeErrors.push(message.text()); });

for (const [path, title, description, canonicalPath] of metadata) {
  await routePage.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const route = await routePage.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    canonical: new URL(document.querySelector('link[rel="canonical"]')?.href ?? '').pathname,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    width: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    hasPrivacy: [...document.querySelectorAll('a')].some((link) => link.getAttribute('href') === '/privacy'),
    hasTerms: [...document.querySelectorAll('a')].some((link) => link.getAttribute('href') === '/terms')
  }));
  assert(route.title === title, `${path} has its route title`);
  assert(route.description === description && route.ogDescription === description && route.twitterDescription === description, `${path} has matching route and social descriptions`);
  assert(route.canonical === canonicalPath, `${path} has its canonical route`);
  assert(route.h1 === 1 && route.main === 1, `${path} has one H1 and one main`);
  assert(route.width <= route.viewport, `${path} has no mobile overflow`);
  assert(route.hasPrivacy && route.hasTerms, `${path} keeps footer legal links`);
}

for (const path of ['/', '/?demo=1', '/privacy', '/terms', '/missing-page', '/404.html', '/offline.html']) {
  await routePage.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page: routePage }).analyze();
  const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  assert(serious.length === 0, `${path} has zero serious or critical axe violations`);
}
assert(routeErrors.length === 0, 'route crawl has no console or page errors');
await routeContext.close();

const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const demoPage = await demoContext.newPage();
const demoRequests = [];
const demoErrors = [];
demoPage.on('request', (request) => demoRequests.push(request.url()));
demoPage.on('pageerror', (error) => demoErrors.push(error.message));
demoPage.on('console', (message) => { if (message.type() === 'error') demoErrors.push(message.text()); });
await demoPage.goto(`${base}/`, { waitUntil: 'networkidle' });
const firstScreen = await demoPage.evaluate(() => {
  const selectors = ['h1', '.dek', '.hero-action', '.secondary-start', '.plain-facts'];
  return selectors.map((selector) => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return { selector, bottom: box?.bottom ?? Infinity };
  });
});
assert(firstScreen.every(({ bottom }) => bottom <= 844), 'landing task, audience, actions, and facts fit the first phone screen');
await demoPage.getByRole('link', { name: 'Try it with sample data' }).click();
await waitFor(demoPage, () => location.search === '?demo=1', 'one-click sample did not open its query route');
await demoPage.getByText('Demo — sample data, nothing is saved').waitFor({ state: 'visible' });
assert(await demoPage.getByText('Demo — sample data, nothing is saved').isVisible(), 'query entry shows the persistent demo banner');
assert(await demoPage.getByRole('button', { name: 'Reset demo' }).isVisible(), 'demo banner shows Reset demo');
assert(await demoPage.getByRole('link', { name: 'Start for real' }).isVisible(), 'demo banner shows Start for real');
assert(await demoPage.getByText('Weekday overnight oats', { exact: true }).first().isVisible(), 'query entry shows the first sample meal');
assert(await demoPage.getByText('Lentil desk lunch', { exact: true }).first().isVisible(), 'query entry shows the second sample meal');
assert(await demoPage.getByRole('row').count() === 2, 'query entry starts with one earlier log');
const portionBox = await demoPage.locator('.portion-control').boundingBox();
const calorieBox = await demoPage.locator('[data-nutrient="calories"]').boundingBox();
assert(Boolean(portionBox) && portionBox.y + portionBox.height <= 844, 'F-5-1 portion control is fully inside the initial phone viewport');
assert(Boolean(calorieBox) && calorieBox.y + calorieBox.height <= 844, 'F-5-1 calorie range result is fully inside the initial phone viewport');
assert(await demoPage.locator('[data-nutrient="calories"] [data-total]').textContent() === '514', 'initial demo shows the calculated calorie total');
assert(await demoPage.locator('[data-nutrient="calories"] [data-state]').textContent() === 'Within range', 'initial demo shows the written calorie range state');
await demoPage.screenshot({ path: join(evidenceDir, 'live-f5-demo-390.png') });
await demoPage.getByLabel('Portion multiplier as a number').fill('0.75');
assert(await demoPage.locator('[data-nutrient="calories"] [data-total]').textContent() === '386', 'portion change recalculates the calorie total');
assert(await demoPage.locator('[data-nutrient="calories"] [data-state]').textContent() === 'below range', 'portion change recalculates the range state');
await demoPage.getByRole('button', { name: 'Log adjusted meal' }).click();
await waitFor(demoPage, () => document.querySelectorAll('[role="row"]').length === 3, 'demo log did not appear');
assert(await demoPage.getByRole('row').count() === 3, 'demo logging adds one sample record');
await demoPage.getByRole('button', { name: 'Reset demo' }).click();
await waitFor(demoPage, () => document.querySelectorAll('[role="row"]').length === 2, 'demo reset did not restore one log');
assert(await demoPage.getByRole('row').count() === 2, 'Reset demo restores the bundled sample');
await demoPage.getByRole('link', { name: 'Start for real' }).click();
await waitFor(demoPage, () => document.querySelector('h2')?.textContent?.trim() === 'Build the meal you repeat', 'real workspace did not open');
assert(await demoPage.getByText('Weekday overnight oats', { exact: true }).count() === 0, 'personal storage contains no demo meal');

await demoPage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
await demoPage.evaluate(async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
});
await demoContext.setOffline(true);
await demoPage.reload({ waitUntil: 'domcontentloaded' });
assert(await demoPage.getByText('Weekday overnight oats', { exact: true }).first().isVisible(), 'offline reload retains the bundled sample');
assert(await demoPage.getByText('You are offline. Meal templates and logging still work.').isVisible(), 'offline reload shows its status');
await demoPage.screenshot({ path: join(evidenceDir, 'live-demo-offline-390.png') });
await demoContext.setOffline(false);
assert(demoRequests.every((url) => new URL(url).origin === base), 'the complete demo flow sends no cross-origin requests');
assert(demoErrors.length === 0, 'the complete demo flow has no console or page errors');
await demoContext.close();

const historyContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const historyPage = await historyContext.newPage();
await historyPage.goto(`${base}/`, { waitUntil: 'networkidle' });
const homeY = await historyPage.evaluate(async () => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return window.scrollY;
});
await historyPage.getByRole('link', { name: 'Demo', exact: true }).evaluate((link) => link.click());
await waitFor(historyPage, () => location.pathname === '/demo' && document.activeElement?.textContent?.trim() === 'Adjust a meal for today', 'Demo route did not focus its H1');
await historyPage.waitForTimeout(100);
const demoY = await historyPage.evaluate(async () => {
  window.scrollTo({ top: 420, behavior: 'instant' });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return window.scrollY;
});
assert(demoY > 200, 'demo can be scrolled below its first screen');
await historyPage.goBack();
await waitFor(historyPage, (expected) => location.pathname === '/' && Math.abs(window.scrollY - expected) <= 4, 'Back did not restore home scroll', homeY);
const restoredHomeY = await historyPage.evaluate(() => window.scrollY);
assert(await historyPage.evaluate(() => document.activeElement?.textContent?.trim()) === 'Adjust portions without changing meal templates', 'Back focuses the home H1');
await historyPage.goForward();
await waitFor(historyPage, (expected) => location.pathname === '/demo' && Math.abs(window.scrollY - expected) <= 4, 'Forward did not restore demo scroll', demoY);
const restoredDemoY = await historyPage.evaluate(() => window.scrollY);
assert(await historyPage.evaluate(() => document.activeElement?.textContent?.trim()) === 'Adjust a meal for today', 'Forward focuses the demo H1');
await historyContext.close();

const rootResponse = await fetch(`${base}/`, { cache: 'no-store' });
assert(rootResponse.status === 200, 'live root returns HTTP 200');
assert(rootResponse.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"), 'live CSP is delivered as a response header');
assert(rootResponse.headers.get('x-content-type-options') === 'nosniff', 'live response sends nosniff');
const indexHtml = await rootResponse.text();
const assetPath = indexHtml.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
assert(Boolean(assetPath), 'live HTML names its hashed JavaScript');
const liveAsset = Buffer.from(await (await fetch(`${base}${assetPath}`, { cache: 'no-store' })).arrayBuffer());
const localAsset = readFileSync(join(process.cwd(), 'dist', assetPath.slice(1)));
const hash = (value) => createHash('sha256').update(value).digest('hex');
assert(hash(liveAsset) === hash(localAsset), 'live JavaScript bytes match the deployed dist build');
assert((await fetch(`${base}/missing-polish-5.js`, { cache: 'no-store' })).status === 404, 'a missing static asset returns HTTP 404');
const sitemap = await (await fetch(`${base}/sitemap.xml`, { cache: 'no-store' })).text();
for (const path of ['/', '/app', '/app/new', '/demo', '/demo/new', '/privacy', '/terms']) {
  assert(sitemap.includes(`<loc>${base}${path}</loc>`), `sitemap includes ${path}`);
}
assert((await fetch('https://sociobot.in', { redirect: 'follow' })).ok, 'Param Factory attribution link resolves');

await browser.close();
const report = {
  checkedAt: new Date().toISOString(),
  base,
  checks,
  f5: { portionBox, calorieBox },
  history: { homeY, restoredHomeY, demoY, restoredDemoY },
  liveJavaScript: { path: assetPath, sha256: hash(liveAsset), bytes: liveAsset.byteLength },
  requests: { demoCount: demoRequests.length, crossOrigin: demoRequests.filter((url) => new URL(url).origin !== base) }
};
writeFileSync(join(evidenceDir, 'live-check.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
