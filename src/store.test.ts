import { describe, expect, it } from 'vitest';
import { sampleData } from './sample';
import { isAppData } from './store';

const copy = (): unknown => JSON.parse(JSON.stringify(sampleData)) as unknown;

describe('backup validation', () => {
  it('accepts a complete exported backup', () => {
    expect(isAppData(copy())).toBe(true);
  });

  it('rejects the verifier malformed backup', () => {
    expect(isAppData({ version: 1, templates: [{}], logs: [] })).toBe(false);
  });

  it.each([
    ['missing ingredient substitutions', (backup: any) => { delete backup.templates[0].ingredients[0].substitutions; }],
    ['incomplete nutrition', (backup: any) => { delete backup.templates[0].ingredients[0].nutrients.fat; }],
    ['inverted nutrition range', (backup: any) => { backup.templates[0].bands.calories = { min: 600, max: 400 }; }],
    ['invalid template date', (backup: any) => { backup.templates[0].createdAt = 'not-a-date'; }],
    ['missing log totals', (backup: any) => { delete backup.logs[0].totals; }],
    ['invalid log ingredients', (backup: any) => { backup.logs[0].ingredients = [{}]; }],
    ['non-finite nutrient', (backup: any) => { backup.templates[0].ingredients[0].nutrients.calories = Number.POSITIVE_INFINITY; }]
  ])('rejects %s', (_name, damage) => {
    const backup = copy();
    damage(backup);
    expect(isAppData(backup)).toBe(false);
  });
});
