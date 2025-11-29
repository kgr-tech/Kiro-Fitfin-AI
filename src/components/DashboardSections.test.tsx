// Property-Based Tests for Dashboard Section Ordering
// Feature: dashboard-scoring

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { LifeFitFinSyncScoreSection } from './LifeFitFinSyncScoreSection';
import { DietHealthInsightsSection } from './DietHealthInsightsSection';
import { FitnessActivitySection } from './FitnessActivitySection';
import { PersonalDevelopmentSection } from './PersonalDevelopmentSection';
import { FinancialSyncSection } from './FinancialSyncSection';
import { TimePlanningSection } from './TimePlanningSection';
import {
  LifeFitFinSyncScores,
  HealthMetrics,
  FitnessMetrics,
  FinanceMetrics,
  GrowthMetrics,
  MealEntry,
  ExerciseEntry,
} from '../types';

// Generators
const scoresArbitrary = fc.record({
  userId: fc.uuid(),
  date: fc.date().map(d => d.toISOString()),
  overallScore: fc.float({ min: 0, max: 100, noNaN: true }),
  healthScore: fc.float({ min: 0, max: 100, noNaN: true }),
  fitnessScore: fc.float({ min: 0, max: 100, noNaN: true }),
  financeScore: fc.float({ min: 0, max: 100, noNaN: true }),
  growthScore: fc.float({ min: 0, max: 100, noNaN: true }),
  alertPenalty: fc.float({ min: 0, max: 50, noNaN: true }),
}) as fc.Arbitrary<LifeFitFinSyncScores>;

const healthMetricsArbitrary = fc.record({
  userId: fc.uuid(),
  date: fc.date().map(d => d.toISOString()),
  meals: fc.array(fc.record({
    timestamp: fc.date().map(d => d.toISOString()),
    description: fc.string({ minLength: 3, maxLength: 30 }),
    portions: fc.integer({ min: 1, max: 5 }),
    estimatedCalories: fc.integer({ min: 50, max: 1500 }),
  }), { minLength: 0, maxLength: 5 }) as fc.Arbitrary<MealEntry[]>,
  hydrationLiters: fc.float({ min: 0, max: 5, noNaN: true }),
  sleepHours: fc.option(fc.float({ min: 4, max: 10, noNaN: true })),
  sleepQuality: fc.option(fc.constantFrom('poor', 'fair', 'good', 'excellent')),
  weightKg: fc.option(fc.float({ min: 50, max: 120, noNaN: true })),
  caloriesEstimated: fc.integer({ min: 1000, max: 3000 }),
  dietQualityScore: fc.float({ min: 0, max: 100, noNaN: true }),
}) as fc.Arbitrary<HealthMetrics>;

const fitnessMetricsArbitrary = fc.record({
  userId: fc.uuid(),
  date: fc.date().map(d => d.toISOString()),
  exercises: fc.array(fc.record({
    type: fc.constantFrom('running', 'cycling', 'walking'),
    durationMinutes: fc.integer({ min: 10, max: 60 }),
    intensity: fc.constantFrom('low', 'moderate', 'high'),
    timestamp: fc.date().map(d => d.toISOString()),
  }), { minLength: 0, maxLength: 5 }) as fc.Arbitrary<ExerciseEntry[]>,
  dailySteps: fc.integer({ min: 0, max: 20000 }),
  totalMinutes: fc.integer({ min: 0, max: 300 }),
  strengthSessions: fc.integer({ min: 0, max: 5 }),
  movementTarget: fc.integer({ min: 5000, max: 15000 }),
  movementAchieved: fc.integer({ min: 0, max: 20000 }),
}) as fc.Arbitrary<FitnessMetrics>;

const financeMetricsArbitrary = fc.record({
  userId: fc.uuid(),
  weekStart: fc.date().map(d => d.toISOString()),
  grocerySpend: fc.float({ min: 0, max: 300, noNaN: true }),
  takeoutSpend: fc.float({ min: 0, max: 200, noNaN: true }),
  snackSpend: fc.float({ min: 0, max: 50, noNaN: true }),
  supplementSpend: fc.float({ min: 0, max: 100, noNaN: true }),
  homeCookedMeals: fc.integer({ min: 0, max: 21 }),
  purchasedMeals: fc.integer({ min: 0, max: 21 }),
  expiredItems: fc.integer({ min: 0, max: 10 }),
  totalItems: fc.integer({ min: 10, max: 50 }),
  previousWeekSpend: fc.float({ min: 0, max: 500, noNaN: true }),
}) as fc.Arbitrary<FinanceMetrics>;

const growthMetricsArbitrary = fc.record({
  userId: fc.uuid(),
  weekStart: fc.date().map(d => d.toISOString()),
  studyBlocksCompleted: fc.integer({ min: 0, max: 30 }),
  studyBlocksPlanned: fc.integer({ min: 10, max: 30 }),
  revisionTasksCompleted: fc.integer({ min: 0, max: 20 }),
  revisionTasksPlanned: fc.integer({ min: 10, max: 20 }),
  practiceTasksCompleted: fc.integer({ min: 0, max: 15 }),
  practiceTasksPlanned: fc.integer({ min: 10, max: 15 }),
  subjects: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
}) as fc.Arbitrary<GrowthMetrics>;

// Feature: dashboard-scoring, Property 2: Dashboard section ordering
// Validates: Requirements 1.1
describe('Property 2: Dashboard section ordering', () => {
  it('should render sections in the correct order', () => {
    fc.assert(
      fc.property(
        scoresArbitrary,
        healthMetricsArbitrary,
        fitnessMetricsArbitrary,
        financeMetricsArbitrary,
        growthMetricsArbitrary,
        (scores, health, fitness, finance, growth) => {
          const { container } = render(
            <div>
              <LifeFitFinSyncScoreSection scores={scores} />
              <DietHealthInsightsSection healthData={health} />
              <FitnessActivitySection fitnessData={fitness} />
              <PersonalDevelopmentSection growthData={growth} />
              <FinancialSyncSection financeData={finance} />
              <TimePlanningSection />
            </div>
          );

          // Get all section elements
          const sections = container.querySelectorAll('section');
          expect(sections.length).toBe(6);

          // Verify order by checking section titles
          const sectionTitles = Array.from(sections).map(
            section => section.querySelector('h2')?.textContent || ''
          );

          // Expected order
          expect(sectionTitles[0]).toContain('LifeFitFinSync Score');
          expect(sectionTitles[1]).toContain('Diet & Health Insights');
          expect(sectionTitles[2]).toContain('Fitness & Activity');
          expect(sectionTitles[3]).toContain('Personal Development');
          expect(sectionTitles[4]).toContain('Financial Sync');
          expect(sectionTitles[5]).toContain('Time Planning');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain section order regardless of data values', () => {
    fc.assert(
      fc.property(
        scoresArbitrary,
        healthMetricsArbitrary,
        fitnessMetricsArbitrary,
        financeMetricsArbitrary,
        growthMetricsArbitrary,
        (scores, health, fitness, finance, growth) => {
          const { container } = render(
            <div>
              <LifeFitFinSyncScoreSection scores={scores} />
              <DietHealthInsightsSection healthData={health} />
              <FitnessActivitySection fitnessData={fitness} />
              <PersonalDevelopmentSection growthData={growth} />
              <FinancialSyncSection financeData={finance} />
              <TimePlanningSection />
            </div>
          );

          const sections = container.querySelectorAll('section');
          
          // All 6 sections should always be present
          expect(sections.length).toBe(6);

          // Each section should have proper ARIA labeling
          sections.forEach(section => {
            const heading = section.querySelector('h2');
            expect(heading).toBeInTheDocument();
            expect(section).toHaveAttribute('aria-labelledby');
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
