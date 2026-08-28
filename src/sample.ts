import type { AppData } from './types';

export const sampleData: AppData = {
  version: 1,
  templates: [
    {
      id: 'overnight-oats',
      name: 'Weekday overnight oats',
      meal: 'Breakfast',
      note: 'The early-train version. Add fruit after weighing.',
      createdAt: '2026-08-18T07:30:00.000Z',
      updatedAt: '2026-08-26T06:55:00.000Z',
      bands: {
        calories: { min: 430, max: 540 },
        protein: { min: 25, max: 38 },
        carbs: { min: 55, max: 75 },
        fat: { min: 10, max: 18 }
      },
      ingredients: [
        {
          id: 'oats', name: 'Rolled oats', amount: 60, unit: 'g',
          nutrients: { calories: 228, protein: 7.8, carbs: 38.4, fat: 4.2 }, substitutions: []
        },
        {
          id: 'yogurt', name: 'Greek yogurt', amount: 170, unit: 'g',
          nutrients: { calories: 124, protein: 17, carbs: 6.1, fat: 3.8 },
          substitutions: [
            { id: 'soy-yogurt', name: 'Soy yogurt', amount: 170, unit: 'g', nutrients: { calories: 148, protein: 7.5, carbs: 11.2, fat: 7.1 } }
          ]
        },
        {
          id: 'banana', name: 'Banana', amount: 100, unit: 'g',
          nutrients: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
          substitutions: [
            { id: 'blueberries', name: 'Blueberries', amount: 120, unit: 'g', nutrients: { calories: 68, protein: 0.9, carbs: 17.4, fat: 0.4 } }
          ]
        },
        {
          id: 'seeds', name: 'Chia seeds', amount: 15, unit: 'g',
          nutrients: { calories: 73, protein: 2.5, carbs: 6.3, fat: 4.6 }, substitutions: []
        }
      ]
    },
    {
      id: 'lentil-bowl',
      name: 'Lentil desk lunch',
      meal: 'Lunch',
      note: 'Keep the dressing separate until lunch.',
      createdAt: '2026-08-20T12:00:00.000Z',
      updatedAt: '2026-08-25T11:30:00.000Z',
      bands: {
        calories: { min: 560, max: 700 },
        protein: { min: 28, max: 42 },
        carbs: { min: 65, max: 95 },
        fat: { min: 14, max: 26 }
      },
      ingredients: [
        { id: 'lentils', name: 'Cooked green lentils', amount: 220, unit: 'g', nutrients: { calories: 255, protein: 19.8, carbs: 44, fat: 0.9 }, substitutions: [] },
        { id: 'rice', name: 'Cooked brown rice', amount: 150, unit: 'g', nutrients: { calories: 168, protein: 3.9, carbs: 34.5, fat: 1.4 }, substitutions: [
          { id: 'quinoa', name: 'Cooked quinoa', amount: 150, unit: 'g', nutrients: { calories: 180, protein: 6.6, carbs: 31.8, fat: 2.9 } }
        ] },
        { id: 'feta', name: 'Feta', amount: 35, unit: 'g', nutrients: { calories: 93, protein: 5, carbs: 1.4, fat: 7.5 }, substitutions: [] },
        { id: 'dressing', name: 'Lemon olive oil dressing', amount: 18, unit: 'g', nutrients: { calories: 112, protein: 0, carbs: 1.2, fat: 12.2 }, substitutions: [] }
      ]
    }
  ],
  logs: [
    {
      id: 'sample-log-1', templateId: 'overnight-oats', templateName: 'Weekday overnight oats',
      loggedAt: '2026-08-27T07:10:00.000Z', multiplier: 0.75,
      ingredients: [], totals: { calories: 385.5, protein: 21.3, carbs: 55.2, fat: 9.7 }
    }
  ]
};
