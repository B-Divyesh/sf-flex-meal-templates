export type Nutrients = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionBands = Record<keyof Nutrients, { min: number; max: number }>;

export type Substitution = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrients;
};

export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrients;
  substitutions: Substitution[];
};

export type MealTemplate = {
  id: string;
  name: string;
  meal: string;
  note: string;
  ingredients: Ingredient[];
  bands: NutritionBands;
  createdAt: string;
  updatedAt: string;
};

export type LoggedIngredient = {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrients;
  substitutionId?: string;
};

export type MealLog = {
  id: string;
  templateId: string;
  templateName: string;
  loggedAt: string;
  multiplier: number;
  ingredients: LoggedIngredient[];
  totals: Nutrients;
};

export type AppData = {
  version: 1;
  templates: MealTemplate[];
  logs: MealLog[];
};
