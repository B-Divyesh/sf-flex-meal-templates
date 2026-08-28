import './styles.css';
import { addNutrients, bandState, defaultBands, ingredientForLog, nutrientKeys, round, scaleNutrients } from './math';
import { routeMeta } from './routes';
import { deleteDemoDatabase, MealStore } from './store';
import type { Ingredient, MealLog, MealTemplate, Nutrients, Substitution } from './types';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('The app could not start. Reload this page.');
const app: HTMLDivElement = root;

let store: MealStore | undefined;
let editorIngredientCount = 0;
const invalidBackupMessage = 'That file is not a valid backup. Choose a JSON backup exported by this app. Your records were not changed.';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character] ?? character);
}

function pathBase(): '/app' | '/demo' {
  return isDemo() ? '/demo' : '/app';
}

function isDemo(): boolean {
  return location.pathname.startsWith('/demo') || new URLSearchParams(location.search).get('demo') === '1';
}

function link(path: string, label: string, className = ''): string {
  return `<a href="${path}" data-route class="${className}">${label}</a>`;
}

function shell(content: string, options: { demo?: boolean; page?: string } = {}): string {
  const demoBanner = options.demo ? `
    <aside class="demo-banner" aria-label="Demo status">
      <strong>Demo — sample data, nothing is saved</strong>
      <span class="demo-actions"><button class="text-button" type="button" data-action="reset-demo">Reset demo</button>${link('/app', 'Start for real')}</span>
    </aside>` : '';
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demoBanner}
    <header class="site-header">
      <div class="header-inner">
        <a href="/" data-route class="wordmark" aria-label="Flex Meal Templates home"><span class="wordmark-short" aria-hidden="true">Flex Meals</span><span class="wordmark-long" aria-hidden="true">Flex Meal Templates</span></a>
        <nav aria-label="Main navigation">
          ${link('/app', 'My meals')}
          ${link('/demo', 'Demo')}
          ${link('/privacy', 'Privacy')}
        </nav>
      </div>
    </header>
    <div class="route-announcer" aria-live="polite" aria-atomic="true"></div>
    ${content}
    <footer class="site-footer">
      <p>Adjust portions without copying meal templates.</p>
      <nav aria-label="Footer navigation">${link('/privacy', 'Privacy')} ${link('/terms', 'Terms')} <a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p>Version 1.0.3</p>
    </footer>
    <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>`;
}

function landingPage(): string {
  return shell(`
    <main id="main">
      <section class="hero broadsheet-grid" aria-labelledby="page-title">
        <div class="hero-copy">
          <h1 id="page-title" tabindex="-1">Adjust portions without changing meal templates</h1>
          <p class="dek">For people who repeat meals and want each portion checked against their nutrition ranges.</p>
          <div class="hero-action">
            ${link('/?demo=1', 'Try it with sample data', 'button primary')}
            <span>Open two sample meal templates. Nothing enters your records.</span>
          </div>
          <div class="secondary-start">
            ${link('/app/new', 'Create your first meal template', 'button secondary')}
          </div>
          <ul class="plain-facts" aria-label="Product facts">
            <li>Works offline after the first visit.</li>
            <li>Your records stay in this browser.</li>
            <li>Free. Export CSV or JSON.</li>
          </ul>
        </div>
        <figure class="hero-art">
          <picture>
            <source type="image/webp" srcset="/assets/meal-edition-768.webp 768w, /assets/meal-edition.webp 1200w" sizes="(max-width: 760px) 100vw, 48vw" />
            <img src="/assets/meal-edition.webp" width="1200" height="800" alt="A kitchen scale and ingredient slips arranged like a newspaper layout." decoding="async" fetchpriority="high" />
          </picture>
          <figcaption>One meal template. Today’s portion stays editable.</figcaption>
        </figure>
      </section>

      <section class="preview-section" aria-labelledby="preview-title">
        <h2 id="preview-title">Meal preview</h2>
        <div class="preview-sheet">
          <div><p class="label">Meal template</p><h3>Weekday overnight oats</h3><p>60 g oats · 170 g yogurt · 100 g banana</p></div>
          <div class="preview-arrow" aria-hidden="true">→</div>
          <div><p class="label">Today · 0.75×</p><h3>Smaller early breakfast</h3><p><del>60 g</del> <ins>45 g oats</ins> · totals update before saving</p></div>
        </div>
      </section>

      <section class="how-section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol class="steps">
          <li><span>01</span><h3>Save the meal template</h3><p>Enter each ingredient and its estimated nutrition.</p></li>
          <li><span>02</span><h3>Set the nutrition ranges</h3><p>Choose calorie and macro minimums and maximums for this meal.</p></li>
          <li><span>03</span><h3>Adjust and log</h3><p>Change the portion or a single ingredient. Then export the record.</p></li>
        </ol>
      </section>

      <section class="limits-section" aria-labelledby="limits-title">
        <h2 id="limits-title">Limits and privacy</h2>
        <div class="columns">
          <p>You enter the nutrition estimates for each ingredient.</p>
          <p>Your meal templates and logs stay in this browser. Export JSON backups or erase this browser’s records.</p>
        </div>
      </section>
    </main>`);
}

function nutrientLabel(key: keyof Nutrients): string {
  return key === 'calories' ? 'Calories' : key[0].toUpperCase() + key.slice(1);
}

function nutrientUnit(key: keyof Nutrients): string {
  return key === 'calories' ? 'kcal' : 'g';
}

function templateTotals(template: MealTemplate): Nutrients {
  return addNutrients(template.ingredients.map((item) => item.nutrients));
}

function libraryMarkup(activeId?: string): string {
  if (!store) return '';
  if (store.data.templates.length === 0) return `
    <section class="empty-state" aria-labelledby="empty-title">
      <p class="kicker">No meal templates</p>
      <h2 id="empty-title">Build the meal you repeat</h2>
      <p>Meal templates appear here after you save one.</p>
      ${link('/app/new', 'Create your first meal template', 'button primary')}
    </section>`;
  return `<section class="meal-library" aria-labelledby="library-title">
    <div class="library-heading"><h2 id="library-title">Meal templates</h2>${link(`${pathBase()}/new`, 'New meal template', 'button compact')}</div>
    <ul>${store.data.templates.map((template) => {
      const totals = templateTotals(template);
      return `<li>${link(`${pathBase()}?meal=${encodeURIComponent(template.id)}`, `<span><strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.meal)} · ${Math.round(totals.calories)} kcal base</small></span><span aria-hidden="true">→</span>`, template.id === activeId ? 'active' : '')}</li>`;
    }).join('')}</ul>
  </section>`;
}

function bandTable(template: MealTemplate, totals: Nutrients): string {
  return `<div class="nutrition-table" aria-live="polite" aria-label="Nutrition compared with meal ranges">
    ${nutrientKeys.map((key) => {
      const state = bandState(totals[key], template.bands[key]);
      return `<div class="nutrition-row" data-nutrient="${key}">
        <span class="label">${nutrientLabel(key)}</span>
        <strong><span data-total>${Math.round(totals[key])}</span> <small>${nutrientUnit(key)}</small></strong>
        <span>${template.bands[key].min}–${template.bands[key].max} ${nutrientUnit(key)}</span>
        <span class="band-state ${state}" data-state>${state === 'within' ? 'Within range' : `${state} range`}</span>
      </div>`;
    }).join('')}
  </div>`;
}

function logWorkspace(template: MealTemplate): string {
  const totals = templateTotals(template);
  return `<section class="log-workspace edition-enter" aria-labelledby="meal-title">
    <div class="meal-heading">
      <div><p class="kicker">${escapeHtml(template.meal)} template</p><h2 id="meal-title">${escapeHtml(template.name)}</h2><p>${escapeHtml(template.note)}</p></div>
      <div class="heading-actions">${link(`${pathBase()}/edit?id=${encodeURIComponent(template.id)}`, 'Edit meal template', 'button secondary compact')}<button type="button" class="button danger compact" data-action="delete-template" data-id="${escapeHtml(template.id)}">Delete</button></div>
    </div>
    <form id="log-form" data-template-id="${escapeHtml(template.id)}">
      <div class="portion-control">
        <label for="multiplier"><span>Portion multiplier</span><strong data-multiplier-label>1.00×</strong></label>
        <input id="multiplier" name="multiplier" type="range" min="0.25" max="3" step="0.05" value="1" />
        <input class="number-input" id="multiplier-number" aria-label="Portion multiplier as a number" type="number" min="0.25" max="3" step="0.05" value="1" />
      </div>
      <fieldset class="log-ingredients"><legend>Today’s ingredients</legend>
        ${template.ingredients.map((ingredient) => `<div class="log-ingredient" data-ingredient-id="${escapeHtml(ingredient.id)}">
          <div><label for="choice-${ingredient.id}">${escapeHtml(ingredient.name)}</label>${ingredient.substitutions.length ? `<select id="choice-${ingredient.id}" data-role="choice"><option value="">Use base ingredient</option>${ingredient.substitutions.map((sub) => `<option value="${escapeHtml(sub.id)}">Use ${escapeHtml(sub.name)}</option>`).join('')}</select>` : '<small>No saved substitutes</small>'}</div>
          <label class="amount-label"><span>Amount</span><span><input data-role="amount" type="number" min="0" step="0.1" value="${ingredient.amount}" aria-label="Amount for ${escapeHtml(ingredient.name)}" /> <span data-role="unit">${escapeHtml(ingredient.unit)}</span></span></label>
          <p class="delta" data-role="delta">Base amount</p>
        </div>`).join('')}
      </fieldset>
      <section class="range-section" aria-labelledby="range-title"><h3 id="range-title">Today’s nutrition against this meal’s ranges</h3>${bandTable(template, totals)}</section>
      <div class="form-actions"><button class="button primary" type="submit">Log adjusted meal</button><span>Saving creates a dated record. The meal template stays unchanged.</span></div>
    </form>
  </section>`;
}

function recentLogsMarkup(): string {
  if (!store || store.data.logs.length === 0) return `<section class="recent-logs" aria-labelledby="logs-title"><h2 id="logs-title">Recent logs</h2><p>No meals logged yet. Adjust a meal template’s portion to make the first record.</p></section>`;
  return `<section class="recent-logs" aria-labelledby="logs-title"><div class="library-heading"><h2 id="logs-title">Recent logs</h2><button class="button compact" data-action="export-csv" type="button">Export CSV</button></div><div class="log-table" role="table" aria-label="Recent meal logs">
    <div role="row" class="log-row log-header"><span role="columnheader">When</span><span role="columnheader">Meal</span><span role="columnheader">Portion</span><span role="columnheader">Calories</span></div>
    ${[...store.data.logs].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)).slice(0, 10).map((log) => `<div role="row" class="log-row"><span role="cell">${new Date(log.loggedAt).toLocaleDateString()}</span><span role="cell">${escapeHtml(log.templateName)}</span><span role="cell">${round(log.multiplier, 2)}×</span><span role="cell">${Math.round(log.totals.calories)} kcal</span></div>`).join('')}
  </div></section>`;
}

function dataControlsMarkup(): string {
  return `<section class="data-controls" aria-labelledby="data-title"><h2 id="data-title">Own your records</h2><p>Download a complete backup, restore one, or erase this browser’s records. Imports are checked before they replace your records.</p><div class="control-row">
    <button class="button secondary" type="button" data-action="export-json">Export JSON backup</button>
    <label class="button secondary file-button">Import JSON backup<input id="import-file" type="file" accept="application/json,.json" /></label>
    <button class="button danger" type="button" data-action="delete-all">Erase all records</button>
  </div></section>`;
}

function recoveryPage(demo: boolean): string {
  return shell(`<main id="main" class="page recovery-page">
    <p class="kicker">Recovery</p>
    <h1 tabindex="-1">Saved records need attention</h1>
    <p>This browser contains meal records the app cannot read. The records have not been changed.</p>
    <h2>Choose how to recover</h2>
    <p>${demo ? 'Reset the sample to restore a clean demo.' : 'Import a valid JSON backup, or erase the damaged records to start over.'}</p>
    <div class="control-row">
      ${demo ? '' : '<label class="button secondary file-button">Import JSON backup<input id="import-file" type="file" accept="application/json,.json" /></label>'}
      <button class="button danger" type="button" data-action="recover-records">${demo ? 'Reset demo' : 'Erase damaged records'}</button>
    </div>
  </main>`, { demo });
}

async function appPage(): Promise<string> {
  const demo = isDemo();
  if (!store || store.demo !== demo) store = new MealStore(demo);
  try {
    await store.load();
  } catch {
    return shell(`<main id="main" class="page"><h1 tabindex="-1">Your meals could not open</h1><p>Browser storage is unavailable. Allow site storage, then reload this page.</p><button class="button primary" type="button" data-action="reload-page">Reload the page</button></main>`, { demo });
  }
  if (store.needsRecovery) return recoveryPage(demo);
  const params = new URLSearchParams(location.search);
  const active = store.data.templates.find((item) => item.id === params.get('meal')) ?? store.data.templates[0];
  return shell(`<main id="main" class="app-page">
    <header class="app-intro"><p class="kicker">${demo ? 'Sample meal templates' : 'Your meal templates'}</p><h1 tabindex="-1">Adjust a meal for today</h1><p>Pick a meal template, change its portion, and compare it with the nutrition ranges.</p><p id="offline-note" class="offline-note" hidden>You are offline. Meal templates and logging still work.</p></header>
    <div class="app-grid">${libraryMarkup(active?.id)}${active ? logWorkspace(active) : ''}</div>
    ${recentLogsMarkup()}
    ${dataControlsMarkup()}
  </main>`, { demo });
}

function input(name: string, labelText: string, value: string | number, options = ''): string {
  return `<label><span>${labelText}</span><input name="${name}" value="${escapeHtml(value)}" ${options} /></label>`;
}

function ingredientEditor(ingredient?: Ingredient, index = editorIngredientCount++): string {
  const alt = ingredient?.substitutions[0];
  return `<fieldset class="ingredient-editor" data-index="${index}"><legend>Ingredient ${index + 1}</legend><button type="button" class="remove-row" data-action="remove-ingredient" aria-label="Remove ingredient ${index + 1}">Remove</button>
    <div class="field-grid three">${input('ingredient-name', 'Ingredient name', ingredient?.name ?? '', 'required')}${input('ingredient-amount', 'Base amount', ingredient?.amount ?? 100, 'type="number" min="0.1" step="0.1" required')}${input('ingredient-unit', 'Unit', ingredient?.unit ?? 'g', 'required')}</div>
    <div class="field-grid four nutrient-fields">${input('ingredient-calories', 'Calories', ingredient?.nutrients.calories ?? 0, 'type="number" min="0" step="0.1" required')}${input('ingredient-protein', 'Protein (g)', ingredient?.nutrients.protein ?? 0, 'type="number" min="0" step="0.1" required')}${input('ingredient-carbs', 'Carbs (g)', ingredient?.nutrients.carbs ?? 0, 'type="number" min="0" step="0.1" required')}${input('ingredient-fat', 'Fat (g)', ingredient?.nutrients.fat ?? 0, 'type="number" min="0" step="0.1" required')}</div>
    <details ${alt ? 'open' : ''}><summary>Add one substitute</summary><div class="substitute-fields"><p>Leave the name blank if this ingredient has no substitute.</p><div class="field-grid three">${input('sub-name', 'Substitute name', alt?.name ?? '')}${input('sub-amount', 'Amount', alt?.amount ?? ingredient?.amount ?? 100, 'type="number" min="0.1" step="0.1"')}${input('sub-unit', 'Unit', alt?.unit ?? ingredient?.unit ?? 'g')}</div><div class="field-grid four nutrient-fields">${input('sub-calories', 'Calories', alt?.nutrients.calories ?? 0, 'type="number" min="0" step="0.1"')}${input('sub-protein', 'Protein (g)', alt?.nutrients.protein ?? 0, 'type="number" min="0" step="0.1"')}${input('sub-carbs', 'Carbs (g)', alt?.nutrients.carbs ?? 0, 'type="number" min="0" step="0.1"')}${input('sub-fat', 'Fat (g)', alt?.nutrients.fat ?? 0, 'type="number" min="0" step="0.1"')}</div></div></details>
  </fieldset>`;
}

function templateForm(template?: MealTemplate): string {
  const bands = template?.bands ?? defaultBands();
  editorIngredientCount = template?.ingredients.length ?? 2;
  const ingredients = template?.ingredients.length ? template.ingredients.map((item, index) => ingredientEditor(item, index)).join('') : ingredientEditor(undefined, 0) + ingredientEditor(undefined, 1);
  return shell(`<main id="main" class="form-page"><header><p class="kicker">${template ? 'Meal template' : 'New meal template'}</p><h1 tabindex="-1">${template ? 'Edit this meal template' : 'Create a meal template'}</h1><p>Enter nutrition for each base amount. You can change portions when you log.</p></header>
    <form id="template-form" data-template-id="${escapeHtml(template?.id ?? '')}">
      <section aria-labelledby="meal-details"><h2 id="meal-details">Meal details</h2><div class="field-grid two">${input('name', 'Meal template name', template?.name ?? '', 'required maxlength="70"')}${input('meal', 'Meal label', template?.meal ?? '', 'required maxlength="30"')}</div><label><span>Short note</span><textarea name="note" maxlength="160">${escapeHtml(template?.note ?? '')}</textarea></label></section>
      <section aria-labelledby="ingredients-title"><div class="library-heading"><h2 id="ingredients-title">Base ingredients</h2><button type="button" class="button compact" data-action="add-ingredient">Add ingredient</button></div><p>Nutrition values apply to the base amount shown.</p><div id="ingredient-editors">${ingredients}</div></section>
      <section aria-labelledby="ranges-title"><h2 id="ranges-title">Nutrition ranges for this meal</h2><p>Enter the lowest and highest value you want to see.</p><div class="band-fields">${nutrientKeys.map((key) => `<fieldset><legend>${nutrientLabel(key)} (${nutrientUnit(key)})</legend>${input(`${key}-min`, 'Minimum', bands[key].min, 'type="number" min="0" step="0.1" required')}${input(`${key}-max`, 'Maximum', bands[key].max, 'type="number" min="0" step="0.1" required')}</fieldset>`).join('')}</div></section>
      <div id="form-error" class="form-error" role="alert"></div><div class="form-actions"><button class="button primary" type="submit">Save meal template</button>${link(pathBase(), 'Cancel', 'button secondary')}</div>
    </form>
  </main>`, { demo: isDemo() });
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return shell(`<main id="main" class="legal-page"><p class="kicker">Effective 28 August 2026</p><h1 tabindex="-1">${privacy ? 'Privacy' : 'Terms'}</h1>
    ${privacy ? `<h2>Your records stay local</h2><p>Meal templates, logs, and settings are stored in this browser with IndexedDB. The app has no account and sends no nutrition records to us.</p><h2>Demo records stay separate</h2><p>The demo uses a separate browser database. Resetting or leaving the demo does not change your real records.</p><h2>Network requests</h2><p>The installed app requests its own files and service worker. It loads no third-party scripts, fonts, or trackers.</p><h2>Your controls</h2><p>Export JSON for a full backup. Export CSV for meal logs. “Erase all records” permanently removes this browser’s meal templates and logs.</p>` : `<h2>Use as a personal utility</h2><p>Flex Meal Templates is free software for recording user-entered meal estimates. It is not medical or dietary advice.</p><h2>Check your estimates</h2><p>You are responsible for the ingredient and nutrition values you enter. Values may differ from labels or actual portions.</p><h2>No warranty</h2><p>The software is provided under the MIT License without warranty. Keep a JSON backup if the records matter to you.</p><h2>Acceptable use</h2><p>Do not use the site to break laws, harm others, or interfere with its operation.</p>`}
    <p>${link('/', 'Return home')}</p></main>`);
}

function notFoundPage(): string {
  return shell(`<main id="main" class="not-found"><p class="error-code">404</p><h1 tabindex="-1">Page not found</h1><p>Check the address or return to your meal templates.</p>${link('/', 'Return home', 'button primary')}</main>`);
}

async function render(push = false): Promise<void> {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const demoEntry = path === '/' && new URLSearchParams(location.search).get('demo') === '1';
  if (push) scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  let renderedNotFound = false;
  if (demoEntry) app.innerHTML = await appPage();
  else if (path === '/') app.innerHTML = landingPage();
  else if (path === '/privacy') app.innerHTML = legalPage('privacy');
  else if (path === '/terms') app.innerHTML = legalPage('terms');
  else if (path === '/app' || path === '/demo') app.innerHTML = await appPage();
  else if (path === '/app/new' || path === '/demo/new') app.innerHTML = templateForm();
  else if (path === '/app/edit' || path === '/demo/edit') {
    const demo = isDemo();
    if (!store || store.demo !== demo) { store = new MealStore(demo); await store.load(); }
    if (store.needsRecovery) app.innerHTML = recoveryPage(demo);
    else {
      const template = store.data.templates.find((item) => item.id === new URLSearchParams(location.search).get('id'));
      if (template) app.innerHTML = templateForm(template);
      else { renderedNotFound = true; app.innerHTML = notFoundPage(); }
    }
  } else { renderedNotFound = true; app.innerHTML = notFoundPage(); }
  const metaKey = renderedNotFound ? '/404' : demoEntry ? '/demo' : (routeMeta[path] ? path : '/404');
  const meta = routeMeta[metaKey];
  document.title = meta.title;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://flex-meal-templates.sociobot.in${renderedNotFound ? '/404' : demoEntry ? '/demo' : path}`;
  document.querySelectorAll<HTMLMetaElement>('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((element) => { element.content = meta.description; });
  document.querySelectorAll<HTMLMetaElement>('meta[property="og:title"], meta[name="twitter:title"]').forEach((element) => { element.content = meta.title; });
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (robots) robots.content = meta.robots ?? 'index,follow';
  updateOfflineNote();
  const heading = app.querySelector<HTMLElement>('h1');
  const announcer = app.querySelector<HTMLElement>('.route-announcer');
  if (push && heading) {
    heading.focus();
    if (announcer) announcer.textContent = heading.textContent;
  }
}

function navigate(url: string): void {
  history.pushState({}, '', url);
  void render(true);
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function updateOfflineNote(): void {
  const note = document.querySelector<HTMLElement>('#offline-note');
  if (note) note.hidden = navigator.onLine;
}

function selectedSource(row: HTMLElement, ingredient: Ingredient): Ingredient | Substitution {
  const choice = row.querySelector<HTMLSelectElement>('[data-role="choice"]')?.value;
  return ingredient.substitutions.find((item) => item.id === choice) ?? ingredient;
}

function calculateLogForm(template: MealTemplate): { multiplier: number; ingredients: MealLog['ingredients']; totals: Nutrients } {
  const multiplier = Number(document.querySelector<HTMLInputElement>('#multiplier-number')?.value ?? 1);
  const ingredients = template.ingredients.map((ingredient) => {
    const row = document.querySelector<HTMLElement>(`.log-ingredient[data-ingredient-id="${CSS.escape(ingredient.id)}"]`);
    if (!row) return ingredientForLog(ingredient, multiplier);
    const source = selectedSource(row, ingredient);
    const amount = Number(row.querySelector<HTMLInputElement>('[data-role="amount"]')?.value ?? source.amount * multiplier);
    const factor = source.amount > 0 ? amount / source.amount : 0;
    return {
      ingredientId: ingredient.id,
      substitutionId: source.id !== ingredient.id ? source.id : undefined,
      name: source.name,
      amount,
      unit: source.unit,
      nutrients: scaleNutrients(source.nutrients, factor)
    };
  });
  return { multiplier, ingredients, totals: addNutrients(ingredients.map((item) => item.nutrients)) };
}

function updateLogCalculation(template: MealTemplate, resetAmounts: boolean): void {
  const number = document.querySelector<HTMLInputElement>('#multiplier-number');
  const range = document.querySelector<HTMLInputElement>('#multiplier');
  if (!number || !range) return;
  const multiplier = Math.min(3, Math.max(0.25, Number(number.value) || 1));
  number.value = String(multiplier);
  range.value = String(multiplier);
  const label = document.querySelector<HTMLElement>('[data-multiplier-label]');
  if (label) label.textContent = `${multiplier.toFixed(2)}×`;
  template.ingredients.forEach((ingredient) => {
    const row = document.querySelector<HTMLElement>(`.log-ingredient[data-ingredient-id="${CSS.escape(ingredient.id)}"]`);
    if (!row) return;
    const source = selectedSource(row, ingredient);
    const amount = row.querySelector<HTMLInputElement>('[data-role="amount"]');
    const unit = row.querySelector<HTMLElement>('[data-role="unit"]');
    if (amount && resetAmounts) amount.value = String(round(source.amount * multiplier));
    if (unit) unit.textContent = source.unit;
    const delta = row.querySelector<HTMLElement>('[data-role="delta"]');
    if (delta && amount) {
      const difference = Number(amount.value) - source.amount;
      delta.textContent = Math.abs(difference) < 0.05 ? 'Base amount' : `${difference > 0 ? '+' : ''}${round(difference)} ${source.unit} from base`;
    }
  });
  const result = calculateLogForm(template);
  for (const key of nutrientKeys) {
    const row = document.querySelector<HTMLElement>(`.nutrition-row[data-nutrient="${key}"]`);
    const state = bandState(result.totals[key], template.bands[key]);
    const total = row?.querySelector<HTMLElement>('[data-total]');
    const stateLabel = row?.querySelector<HTMLElement>('[data-state]');
    if (total) total.textContent = String(Math.round(result.totals[key]));
    if (stateLabel) { stateLabel.className = `band-state ${state}`; stateLabel.textContent = state === 'within' ? 'Within range' : `${state} range`; }
  }
}

function numberFrom(form: HTMLFormElement, name: string): number {
  return Number(new FormData(form).get(name));
}

function valueFrom(form: HTMLFormElement, name: string): string {
  return String(new FormData(form).get(name) ?? '').trim();
}

function controlValue(row: Element, name: string): string {
  return (row.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? '').trim();
}

function controlNumber(row: Element, name: string): number {
  return Number(controlValue(row, name));
}

async function saveTemplate(form: HTMLFormElement): Promise<void> {
  const demo = isDemo();
  if (!store || store.demo !== demo) { store = new MealStore(demo); await store.load(); }
  if (store.needsRecovery) { navigate(pathBase()); return; }
  const error = document.querySelector<HTMLElement>('#form-error');
  const rows = [...form.querySelectorAll<HTMLElement>('.ingredient-editor')];
  if (rows.length === 0) { if (error) error.textContent = 'Add at least one ingredient before saving.'; return; }
  const ingredients: Ingredient[] = rows.map((row) => {
    const substitutionName = controlValue(row, 'sub-name');
    const substitutions: Substitution[] = substitutionName ? [{
      id: crypto.randomUUID(), name: substitutionName, amount: controlNumber(row, 'sub-amount'), unit: controlValue(row, 'sub-unit'),
      nutrients: { calories: controlNumber(row, 'sub-calories'), protein: controlNumber(row, 'sub-protein'), carbs: controlNumber(row, 'sub-carbs'), fat: controlNumber(row, 'sub-fat') }
    }] : [];
    return {
      id: crypto.randomUUID(), name: controlValue(row, 'ingredient-name'), amount: controlNumber(row, 'ingredient-amount'), unit: controlValue(row, 'ingredient-unit'),
      nutrients: { calories: controlNumber(row, 'ingredient-calories'), protein: controlNumber(row, 'ingredient-protein'), carbs: controlNumber(row, 'ingredient-carbs'), fat: controlNumber(row, 'ingredient-fat') }, substitutions
    };
  });
  const invalidBand = nutrientKeys.find((key) => numberFrom(form, `${key}-min`) > numberFrom(form, `${key}-max`));
  if (invalidBand) { if (error) error.textContent = `${nutrientLabel(invalidBand)} minimum must be lower than its maximum.`; return; }
  const existingId = form.dataset.templateId;
  const existing = store.data.templates.find((item) => item.id === existingId);
  const now = new Date().toISOString();
  const template: MealTemplate = {
    id: existing?.id ?? crypto.randomUUID(), name: valueFrom(form, 'name'), meal: valueFrom(form, 'meal'), note: valueFrom(form, 'note'), ingredients,
    bands: Object.fromEntries(nutrientKeys.map((key) => [key, { min: numberFrom(form, `${key}-min`), max: numberFrom(form, `${key}-max`) }])) as MealTemplate['bands'],
    createdAt: existing?.createdAt ?? now, updatedAt: now
  };
  if (existing) store.data.templates.splice(store.data.templates.indexOf(existing), 1, template); else store.data.templates.unshift(template);
  await store.save();
  navigate(`${pathBase()}?meal=${encodeURIComponent(template.id)}`);
  showToast('Meal template saved.');
}

function download(name: string, type: string, contents: string): void {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([contents], { type }));
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function csvCell(value: unknown): string {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function exportCsv(): void {
  if (!store) return;
  const header = ['logged_at', 'template', 'portion_multiplier', 'calories_kcal', 'protein_g', 'carbs_g', 'fat_g', 'ingredients'];
  const rows = store.data.logs.map((log) => [log.loggedAt, log.templateName, log.multiplier, round(log.totals.calories), round(log.totals.protein), round(log.totals.carbs), round(log.totals.fat), log.ingredients.map((item) => `${round(item.amount)} ${item.unit} ${item.name}`).join('; ')]);
  download('flex-meal-logs.csv', 'text/csv;charset=utf-8', [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n'));
}

async function handleClick(event: MouseEvent): Promise<void> {
  const route = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (route && route.origin === location.origin) {
    event.preventDefault();
    if (isDemo() && route.pathname === '/app' && store?.demo) await store.resetDemo();
    navigate(route.pathname + route.search);
    return;
  }
  const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'add-ingredient') {
    document.querySelector('#ingredient-editors')?.insertAdjacentHTML('beforeend', ingredientEditor());
  } else if (action === 'remove-ingredient') {
    (event.target as Element).closest('.ingredient-editor')?.remove();
  } else if (action === 'reset-demo' && store) {
    await store.resetDemo(); await render(); showToast('Sample data reset.');
  } else if (action === 'reload-page') {
    location.reload();
  } else if (action === 'recover-records' && store) {
    const message = store.demo ? 'Reset the demo and discard its damaged sample data?' : 'Erase the damaged records in this browser? This cannot be undone.';
    if (confirm(message)) {
      if (store.demo) await store.resetDemo(); else await store.eraseAll();
      await render();
      showToast(store.demo ? 'Sample data reset.' : 'Damaged records erased. You can start again.');
    }
  } else if (action === 'export-csv') exportCsv();
  else if (action === 'export-json' && store) download('flex-meal-templates-backup.json', 'application/json', JSON.stringify(store.data, null, 2));
  else if (action === 'delete-template' && store) {
    const id = (event.target as HTMLElement).closest<HTMLElement>('[data-id]')?.dataset.id;
    const template = store.data.templates.find((item) => item.id === id);
    if (template && confirm(`Delete “${template.name}”? Existing log records will remain.`)) { store.data.templates = store.data.templates.filter((item) => item.id !== id); await store.save(); navigate(pathBase()); showToast('Meal template deleted.'); }
  } else if (action === 'delete-all' && store) {
    if (confirm('Erase every meal template and log in this browser? This cannot be undone.')) { await store.eraseAll(); await render(); showToast('All records erased.'); }
  }
}

async function handleSubmit(event: SubmitEvent): Promise<void> {
  const form = event.target as HTMLFormElement;
  if (form.id === 'template-form') { event.preventDefault(); await saveTemplate(form); return; }
  if (form.id === 'log-form' && store) {
    event.preventDefault();
    const template = store.data.templates.find((item) => item.id === form.dataset.templateId);
    if (!template) return;
    const calculated = calculateLogForm(template);
    store.data.logs.unshift({ id: crypto.randomUUID(), templateId: template.id, templateName: template.name, loggedAt: new Date().toISOString(), ...calculated });
    await store.save(); await render(); showToast('Adjusted meal logged.');
  }
}

async function handleChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.id === 'import-file' && target instanceof HTMLInputElement && target.files?.[0] && store) {
    try {
      await store.importData(JSON.parse(await target.files[0].text()) as unknown);
      await render();
      showToast('Backup imported.');
    } catch (error) {
      const message = error instanceof SyntaxError || (error instanceof Error && error.message === 'This file is not a Flex Meal Templates backup.')
        ? invalidBackupMessage
        : 'The backup is valid, but browser storage could not save it. Your records were not changed.';
      showToast(message);
    } finally {
      target.value = '';
    }
    return;
  }
  const templateId = document.querySelector<HTMLFormElement>('#log-form')?.dataset.templateId;
  const template = store?.data.templates.find((item) => item.id === templateId);
  if (!template) return;
  if (target.id === 'multiplier' || target.id === 'multiplier-number') {
    const other = document.querySelector<HTMLInputElement>(target.id === 'multiplier' ? '#multiplier-number' : '#multiplier');
    if (other) other.value = target.value;
    updateLogCalculation(template, true);
  } else if (target.matches('[data-role="choice"]')) updateLogCalculation(template, true);
  else if (target.matches('[data-role="amount"]')) updateLogCalculation(template, false);
}

document.addEventListener('click', (event) => { void handleClick(event); });
document.addEventListener('submit', (event) => { void handleSubmit(event); });
document.addEventListener('input', (event) => { void handleChange(event); });
document.addEventListener('change', (event) => { void handleChange(event); });
window.addEventListener('popstate', () => { void render(true); });
window.addEventListener('online', updateOfflineNote);
window.addEventListener('offline', updateOfflineNote);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.');
        });
      });
    });
  });
}

if (!isDemo() && location.pathname === '/app' && new URLSearchParams(location.search).get('demo') === '1') {
  void deleteDemoDatabase();
}

void render();
