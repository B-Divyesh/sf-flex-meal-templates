import type { AppData, Ingredient, LoggedIngredient, MealLog, MealTemplate, Nutrients, NutritionBands, Substitution } from './types';
import { sampleData } from './sample';

const emptyData = (): AppData => ({ version: 1, templates: [], logs: [] });
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function openDatabase(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? 'flex-meals-demo' : 'flex-meals-real', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('app');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readState(db: IDBDatabase): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = db.transaction('app').objectStore('app').get('state');
    request.onsuccess = () => resolve(request.result as unknown);
    request.onerror = () => reject(request.error);
  });
}

function writeState(db: IDBDatabase, value: AppData): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('app', 'readwrite');
    transaction.objectStore('app').put(value, 'state');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export class MealStore {
  private db?: IDBDatabase;
  data: AppData = emptyData();
  needsRecovery = false;

  constructor(readonly demo: boolean) {}

  async load(): Promise<AppData> {
    this.db = await openDatabase(this.demo);
    const stored = await readState(this.db);
    if (stored !== undefined && !isAppData(stored)) {
      this.data = emptyData();
      this.needsRecovery = true;
      return this.data;
    }
    this.needsRecovery = false;
    this.data = stored === undefined ? (this.demo ? clone(sampleData) : emptyData()) : clone(stored);
    if (stored === undefined && this.demo) await this.save();
    return this.data;
  }

  async save(): Promise<void> {
    if (!this.db) this.db = await openDatabase(this.demo);
    await writeState(this.db, this.data);
  }

  async resetDemo(): Promise<void> {
    if (!this.demo) return;
    const next = clone(sampleData);
    if (!this.db) this.db = await openDatabase(this.demo);
    await writeState(this.db, next);
    this.data = next;
    this.needsRecovery = false;
  }

  async importData(value: unknown): Promise<void> {
    if (!isAppData(value)) throw new Error('This file is not a Flex Meal Templates backup.');
    const next = clone(value);
    if (!this.db) this.db = await openDatabase(this.demo);
    await writeState(this.db, next);
    this.data = next;
    this.needsRecovery = false;
  }

  async eraseAll(): Promise<void> {
    const next = emptyData();
    if (!this.db) this.db = await openDatabase(this.demo);
    await writeState(this.db, next);
    this.data = next;
    this.needsRecovery = false;
  }
}

export function isAppData(value: unknown): value is AppData {
  if (!isRecord(value)) return false;
  return value.version === 1
    && Array.isArray(value.templates)
    && value.templates.every(isMealTemplate)
    && Array.isArray(value.logs)
    && value.logs.every(isMealLog);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown, allowEmpty = false): value is string {
  return typeof value === 'string' && (allowEmpty || value.trim().length > 0);
}

function isNumber(value: unknown, minimum = 0): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum;
}

function isDate(value: unknown): value is string {
  return isText(value) && Number.isFinite(Date.parse(value));
}

function isNutrients(value: unknown): value is Nutrients {
  return isRecord(value)
    && isNumber(value.calories)
    && isNumber(value.protein)
    && isNumber(value.carbs)
    && isNumber(value.fat);
}

function isBand(value: unknown): value is { min: number; max: number } {
  return isRecord(value) && isNumber(value.min) && isNumber(value.max) && value.min <= value.max;
}

function isBands(value: unknown): value is NutritionBands {
  return isRecord(value)
    && isBand(value.calories)
    && isBand(value.protein)
    && isBand(value.carbs)
    && isBand(value.fat);
}

function isSubstitution(value: unknown): value is Substitution {
  return isRecord(value)
    && isText(value.id)
    && isText(value.name)
    && isNumber(value.amount, Number.MIN_VALUE)
    && isText(value.unit)
    && isNutrients(value.nutrients);
}

function isIngredient(value: unknown): value is Ingredient {
  return isRecord(value)
    && isText(value.id)
    && isText(value.name)
    && isNumber(value.amount, Number.MIN_VALUE)
    && isText(value.unit)
    && isNutrients(value.nutrients)
    && Array.isArray(value.substitutions)
    && value.substitutions.every(isSubstitution);
}

function isMealTemplate(value: unknown): value is MealTemplate {
  return isRecord(value)
    && isText(value.id)
    && isText(value.name)
    && isText(value.meal)
    && isText(value.note, true)
    && Array.isArray(value.ingredients)
    && value.ingredients.length > 0
    && value.ingredients.every(isIngredient)
    && isBands(value.bands)
    && isDate(value.createdAt)
    && isDate(value.updatedAt);
}

function isLoggedIngredient(value: unknown): value is LoggedIngredient {
  return isRecord(value)
    && isText(value.ingredientId)
    && (value.substitutionId === undefined || isText(value.substitutionId))
    && isText(value.name)
    && isNumber(value.amount)
    && isText(value.unit)
    && isNutrients(value.nutrients);
}

function isMealLog(value: unknown): value is MealLog {
  return isRecord(value)
    && isText(value.id)
    && isText(value.templateId)
    && isText(value.templateName)
    && isDate(value.loggedAt)
    && isNumber(value.multiplier, Number.MIN_VALUE)
    && Array.isArray(value.ingredients)
    && value.ingredients.every(isLoggedIngredient)
    && isNutrients(value.totals);
}

export function deleteDemoDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('flex-meals-demo');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
