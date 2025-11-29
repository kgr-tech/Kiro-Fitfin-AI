// Property-Based Tests for Data Annotation Parser
// Feature: dashboard-scoring

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  parseAnnotatedInput,
  parseDailyMeals,
  parseExerciseMinutes,
  parseWeeklyExpenses,
} from './dataParser';

// Feature: dashboard-scoring, Property 28: Meal annotation parsing
// Validates: Requirements 8.1
describe('Property 28: Meal annotation parsing', () => {
  it('should extract meals, portions, and drinks from daily_meals annotation', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            meals: fc.array(
              fc.record({
                description: fc.string({ minLength: 3, maxLength: 30 }).filter(s => !s.includes(',')),
                portions: fc.integer({ min: 1, max: 5 }),
                calories: fc.integer({ min: 50, max: 1500 }),
              }),
              { minLength: 1, maxLength: 5 }
            ),
          }),
          { minLength: 1, maxLength: 7 }
        ),
        (mealDays) => {
          // Generate annotation content
          let annotationContent = '';
          for (const day of mealDays) {
            annotationContent += `Date: ${day.date}\n`;
            for (const meal of day.meals) {
              annotationContent += `Meal: ${meal.description}, Portions: ${meal.portions}, Calories: ${meal.calories}\n`;
            }
          }

          // Parse it
          const parsed = parseDailyMeals(annotationContent);

          // Verify we got the right number of days
          expect(parsed.length).toBe(mealDays.length);

          // Verify each day's data
          for (let i = 0; i < mealDays.length; i++) {
            expect(parsed[i].date).toBe(mealDays[i].date);
            expect(parsed[i].meals.length).toBe(mealDays[i].meals.length);

            for (let j = 0; j < mealDays[i].meals.length; j++) {
              expect(parsed[i].meals[j].description).toBe(mealDays[i].meals[j].description);
              expect(parsed[i].meals[j].portions).toBe(mealDays[i].meals[j].portions);
              expect(parsed[i].meals[j].estimatedCalories).toBe(mealDays[i].meals[j].calories);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should parse daily_meals from full annotated input', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            meals: fc.array(
              fc.record({
                description: fc.string({ minLength: 3, maxLength: 30 }).filter(s => !s.includes(',')),
                portions: fc.integer({ min: 1, max: 5 }),
                calories: fc.integer({ min: 50, max: 1500 }),
              }),
              { minLength: 1, maxLength: 3 }
            ),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (mealDays) => {
          // Generate full input with annotation
          let mealContent = '';
          for (const day of mealDays) {
            mealContent += `Date: ${day.date}\n`;
            for (const meal of day.meals) {
              mealContent += `Meal: ${meal.description}, Portions: ${meal.portions}, Calories: ${meal.calories}\n`;
            }
          }

          const rawInput = `{{daily_meals}}\n${mealContent}`;

          // Parse it
          const parsed = parseAnnotatedInput(rawInput);

          // Verify meals were extracted
          expect(parsed.dailyMeals).toBeDefined();
          expect(parsed.dailyMeals!.length).toBe(mealDays.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: dashboard-scoring, Property 29: Exercise annotation parsing
// Validates: Requirements 8.2
describe('Property 29: Exercise annotation parsing', () => {
  it('should extract exercise type, duration, and steps from exercise_minutes annotation', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            type: fc.constantFrom('running', 'cycling', 'swimming', 'walking', 'strength'),
            duration: fc.integer({ min: 5, max: 180 }),
            steps: fc.integer({ min: 0, max: 30000 }),
          }),
          { minLength: 1, maxLength: 7 }
        ),
        (exercises) => {
          // Generate annotation content
          let annotationContent = '';
          for (const exercise of exercises) {
            annotationContent += `Date: ${exercise.date}, Type: ${exercise.type}, Duration: ${exercise.duration} minutes, Steps: ${exercise.steps}\n`;
          }

          // Parse it
          const parsed = parseExerciseMinutes(annotationContent);

          // Verify we got the right number of exercises
          expect(parsed.length).toBe(exercises.length);

          // Verify each exercise's data
          for (let i = 0; i < exercises.length; i++) {
            expect(parsed[i].date).toBe(exercises[i].date);
            expect(parsed[i].type).toBe(exercises[i].type);
            expect(parsed[i].durationMinutes).toBe(exercises[i].duration);
            expect(parsed[i].steps).toBe(exercises[i].steps);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should parse exercise_minutes from full annotated input', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            type: fc.constantFrom('running', 'walking'),
            duration: fc.integer({ min: 10, max: 60 }),
            steps: fc.integer({ min: 1000, max: 15000 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (exercises) => {
          // Generate full input with annotation
          let exerciseContent = '';
          for (const exercise of exercises) {
            exerciseContent += `Date: ${exercise.date}, Type: ${exercise.type}, Duration: ${exercise.duration} minutes, Steps: ${exercise.steps}\n`;
          }

          const rawInput = `{{exercise_minutes}}\n${exerciseContent}`;

          // Parse it
          const parsed = parseAnnotatedInput(rawInput);

          // Verify exercises were extracted
          expect(parsed.exerciseMinutes).toBeDefined();
          expect(parsed.exerciseMinutes!.length).toBe(exercises.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: dashboard-scoring, Property 32: Expense annotation parsing
// Validates: Requirements 8.5
describe('Property 32: Expense annotation parsing', () => {
  it('should extract groceries, takeout, snacks, and supplements from weekly_expenses annotation', () => {
    fc.assert(
      fc.property(
        fc.record({
          groceries: fc.float({ min: 0, max: 500, noNaN: true }).map(n => Math.round(n * 100) / 100),
          takeout: fc.float({ min: 0, max: 300, noNaN: true }).map(n => Math.round(n * 100) / 100),
          snacks: fc.float({ min: 0, max: 100, noNaN: true }).map(n => Math.round(n * 100) / 100),
          supplements: fc.float({ min: 0, max: 200, noNaN: true }).map(n => Math.round(n * 100) / 100),
        }),
        (expenses) => {
          // Generate annotation content
          const annotationContent = `
Groceries: $${expenses.groceries}
Takeout: $${expenses.takeout}
Snacks: $${expenses.snacks}
Supplements: $${expenses.supplements}
          `.trim();

          // Parse it
          const parsed = parseWeeklyExpenses(annotationContent);

          // Verify all categories were extracted
          expect(parsed).toBeDefined();
          expect(Math.abs(parsed!.groceries - expenses.groceries)).toBeLessThan(0.01);
          expect(Math.abs(parsed!.takeout - expenses.takeout)).toBeLessThan(0.01);
          expect(Math.abs(parsed!.snacks - expenses.snacks)).toBeLessThan(0.01);
          expect(Math.abs(parsed!.supplements - expenses.supplements)).toBeLessThan(0.01);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should parse weekly_expenses from full annotated input', () => {
    fc.assert(
      fc.property(
        fc.record({
          groceries: fc.float({ min: 0, max: 500, noNaN: true }).map(n => Math.round(n * 100) / 100),
          takeout: fc.float({ min: 0, max: 300, noNaN: true }).map(n => Math.round(n * 100) / 100),
          snacks: fc.float({ min: 0, max: 100, noNaN: true }).map(n => Math.round(n * 100) / 100),
          supplements: fc.float({ min: 0, max: 200, noNaN: true }).map(n => Math.round(n * 100) / 100),
        }),
        (expenses) => {
          // Generate full input with annotation
          const rawInput = `{{weekly_expenses}}
Groceries: $${expenses.groceries}
Takeout: $${expenses.takeout}
Snacks: $${expenses.snacks}
Supplements: $${expenses.supplements}`;

          // Parse it
          const parsed = parseAnnotatedInput(rawInput);

          // Verify expenses were extracted
          expect(parsed.weeklyExpenses).toBeDefined();
          expect(Math.abs(parsed.weeklyExpenses!.groceries - expenses.groceries)).toBeLessThan(0.01);
          expect(Math.abs(parsed.weeklyExpenses!.takeout - expenses.takeout)).toBeLessThan(0.01);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
