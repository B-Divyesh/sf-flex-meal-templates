import { describe, expect, it } from 'vitest';
import { addNutrients, bandState, ingredientForLog } from './math';

describe('meal calculations', () => {
  it('scales a base ingredient', () => {
    const result = ingredientForLog({ id: 'a', name: 'Oats', amount: 60, unit: 'g', nutrients: { calories: 200, protein: 8, carbs: 30, fat: 4 }, substitutions: [] }, 1.5);
    expect(result.amount).toBe(90);
    expect(result.nutrients.calories).toBe(300);
  });

  it('adds nutrient totals', () => {
    expect(addNutrients([{ calories: 100, protein: 2, carbs: 3, fat: 4 }, { calories: 50, protein: 1, carbs: 2, fat: 3 }])).toEqual({ calories: 150, protein: 3, carbs: 5, fat: 7 });
  });

  it('describes both edges as within the band', () => {
    expect(bandState(400, { min: 400, max: 500 })).toBe('within');
    expect(bandState(501, { min: 400, max: 500 })).toBe('above');
  });
});
