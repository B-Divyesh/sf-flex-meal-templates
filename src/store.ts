import type { AppData } from './types';
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

function readState(db: IDBDatabase): Promise<AppData | undefined> {
  return new Promise((resolve, reject) => {
    const request = db.transaction('app').objectStore('app').get('state');
    request.onsuccess = () => resolve(request.result as AppData | undefined);
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

  constructor(readonly demo: boolean) {}

  async load(): Promise<AppData> {
    this.db = await openDatabase(this.demo);
    const stored = await readState(this.db);
    this.data = stored ?? (this.demo ? clone(sampleData) : emptyData());
    if (!stored && this.demo) await this.save();
    return this.data;
  }

  async save(): Promise<void> {
    if (!this.db) this.db = await openDatabase(this.demo);
    await writeState(this.db, this.data);
  }

  async resetDemo(): Promise<void> {
    if (!this.demo) return;
    this.data = clone(sampleData);
    await this.save();
  }

  async importData(value: unknown): Promise<void> {
    if (!isAppData(value)) throw new Error('This file is not a Flex Meal Templates backup.');
    this.data = clone(value);
    await this.save();
  }
}

export function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AppData>;
  return item.version === 1 && Array.isArray(item.templates) && Array.isArray(item.logs);
}

export function deleteDemoDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('flex-meals-demo');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
