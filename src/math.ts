import type { Ingredient, LoggedIngredient, Nutrients, NutritionBands } from './types';

export const nutrientKeys: (keyof Nutrients)[] = ['calories', 'protein', 'carbs', 'fat'];

export const emptyNutrients = (): Nutrients => ({ calories: 0, protein: 0, carbs: 0, fat: 0 });

export function addNutrients(items: Nutrients[]): Nutrients {
  return items.reduce((total, item) => {
    for (const key of nutrientKeys) total[key] += item[key];
    return total;
  }, emptyNutrients());
}

export function scaleNutrients(nutrients: Nutrients, factor: number): Nutrients {
  return Object.fromEntries(nutrientKeys.map((key) => [key, nutrients[key] * factor])) as Nutrients;
}

export function ingredientForLog(ingredient: Ingredient, multiplier: number, substitutionId?: string): LoggedIngredient {
  const source = ingredient.substitutions.find((item) => item.id === substitutionId) ?? ingredient;
  return {
    ingredientId: ingredient.id,
    substitutionId,
    name: source.name,
    amount: source.amount * multiplier,
    unit: source.unit,
    nutrients: scaleNutrients(source.nutrients, multiplier)
  };
}

export function bandState(value: number, band: { min: number; max: number }): 'below' | 'within' | 'above' {
  if (value < band.min) return 'below';
  if (value > band.max) return 'above';
  return 'within';
}

export function defaultBands(): NutritionBands {
  return {
    calories: { min: 400, max: 600 },
    protein: { min: 25, max: 45 },
    carbs: { min: 35, max: 70 },
    fat: { min: 10, max: 25 }
  };
}

export function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
