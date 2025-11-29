// Property-Based Tests for Emergency Alert Detection
// Feature: dashboard-scoring

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  checkHealthThresholds,
  generateEmergencyAlert,
  HEALTH_THRESHOLDS,
} from './alertDetection';
import { HealthMetrics, MealEntry } from '../types';

// Generator for health metrics
const healthMetricsArbitrary = fc.record({
  userId: fc.uuid(),
  date: fc.date().map(d => d.toISOString()),
  meals: fc.array(fc.record({
    timestamp: fc.date().map(d => d.toISOString()),
    description: fc.string({ minLength: 1, maxLength: 50 }),
    portions: fc.integer({ min: 1, max: 5 }),
    estimatedCalories: fc.integer({ min: 50, max: 1500 }),
  }), { minLength: 0, maxLength: 10 }) as fc.Arbitrary<MealEntry[]>,
  hydrationLiters: fc.float({ min: 0, max: 10, noNaN: true }),
  sleepHours: fc.option(fc.float({ min: 0, max: 16, noNaN: true })),
  sleepQuality: fc.option(fc.constantFrom('poor', 'fair', 'good', 'excellent')),
  weightKg: fc.option(fc.float({ min: 30, max: 200, noNaN: true })),
  caloriesEstimated: fc.integer({ min: 0, max: 6000 }),
  dietQualityScore: fc.float({ min: 0, max: 100, noNaN: true }),
}) as fc.Arbitrary<HealthMetrics>;

// Feature: dashboard-scoring, Property 11: Threshold breach triggers alert
// Validates: Requirements 3.5
describe('Property 11: Threshold breach triggers alert', () => {
  describe('Calorie threshold breaches', () => {
    it('should trigger critical alert for extremely low calories', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.integer({ min: 0, max: HEALTH_THRESHOLDS.CALORIES_MIN_CRITICAL }),
          (baseMetrics, lowCalories) => {
            const metrics = { ...baseMetrics, caloriesEstimated: lowCalories };
            const alerts = checkHealthThresholds(metrics);

            // Should have at least one alert
            expect(alerts.length).toBeGreaterThan(0);

            // Should have a calorie_extreme alert
            const calorieAlert = alerts.find(a => a.type === 'calorie_extreme');
            expect(calorieAlert).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger critical alert for extremely high calories', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.integer({ min: HEALTH_THRESHOLDS.CALORIES_MAX_CRITICAL, max: 10000 }),
          (baseMetrics, highCalories) => {
            const metrics = { ...baseMetrics, caloriesEstimated: highCalories };
            const alerts = checkHealthThresholds(metrics);

            // Should have at least one alert
            expect(alerts.length).toBeGreaterThan(0);

            // Should have a calorie_extreme alert
            const calorieAlert = alerts.find(a => a.type === 'calorie_extreme');
            expect(calorieAlert).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger alert for normal calorie range', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.integer({ 
            min: HEALTH_THRESHOLDS.CALORIES_MIN_WARNING + 100, 
            max: HEALTH_THRESHOLDS.CALORIES_MAX_WARNING - 100 
          }),
          (baseMetrics, normalCalories) => {
            const metrics = { 
              ...baseMetrics, 
              caloriesEstimated: normalCalories,
              hydrationLiters: 2.5, // Normal hydration
              sleepHours: 8, // Normal sleep
            };
            const alerts = checkHealthThresholds(metrics);

            // Should not have a calorie alert
            const calorieAlert = alerts.find(a => a.type === 'calorie_extreme');
            expect(calorieAlert).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Hydration threshold breaches', () => {
    it('should trigger alert for low hydration', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 0, max: HEALTH_THRESHOLDS.HYDRATION_MIN_CRITICAL, noNaN: true }),
          (baseMetrics, lowHydration) => {
            const metrics = { 
              ...baseMetrics, 
              hydrationLiters: lowHydration,
              caloriesEstimated: 2000, // Normal calories
            };
            const alerts = checkHealthThresholds(metrics);

            // Should have at least one alert
            expect(alerts.length).toBeGreaterThan(0);

            // Should have a dehydration alert
            const hydrationAlert = alerts.find(a => a.type === 'dehydration');
            expect(hydrationAlert).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger alert for adequate hydration', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 2.0, max: 5.0, noNaN: true }),
          (baseMetrics, goodHydration) => {
            const metrics = { 
              ...baseMetrics, 
              hydrationLiters: goodHydration,
              caloriesEstimated: 2000, // Normal calories
              sleepHours: 8, // Normal sleep
            };
            const alerts = checkHealthThresholds(metrics);

            // Should not have a hydration alert
            const hydrationAlert = alerts.find(a => a.type === 'dehydration');
            expect(hydrationAlert).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Sleep threshold breaches', () => {
    it('should trigger alert for severe sleep deprivation', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 0, max: HEALTH_THRESHOLDS.SLEEP_MIN_CRITICAL, noNaN: true }),
          (baseMetrics, lowSleep) => {
            const metrics = { 
              ...baseMetrics, 
              sleepHours: lowSleep,
              caloriesEstimated: 2000, // Normal calories
              hydrationLiters: 2.5, // Normal hydration
            };
            const alerts = checkHealthThresholds(metrics);

            // Should have at least one alert
            expect(alerts.length).toBeGreaterThan(0);

            // Should have a sleep_deprivation alert
            const sleepAlert = alerts.find(a => a.type === 'sleep_deprivation');
            expect(sleepAlert).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger alert for adequate sleep', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 7, max: 9, noNaN: true }),
          (baseMetrics, goodSleep) => {
            const metrics = { 
              ...baseMetrics, 
              sleepHours: goodSleep,
              caloriesEstimated: 2000, // Normal calories
              hydrationLiters: 2.5, // Normal hydration
            };
            const alerts = checkHealthThresholds(metrics);

            // Should not have a sleep alert
            const sleepAlert = alerts.find(a => a.type === 'sleep_deprivation');
            expect(sleepAlert).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Weight change threshold breaches', () => {
    it('should trigger alert for rapid weight change', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 60, max: 100, noNaN: true }),
          (baseMetrics, currentWeight) => {
            // Create a previous weight that differs by more than the threshold
            const previousWeight = currentWeight + HEALTH_THRESHOLDS.WEIGHT_CHANGE_CRITICAL + 0.5;
            
            const metrics = { 
              ...baseMetrics, 
              weightKg: currentWeight,
              caloriesEstimated: 2000, // Normal calories
              hydrationLiters: 2.5, // Normal hydration
              sleepHours: 8, // Normal sleep
            };
            
            const alerts = checkHealthThresholds(metrics, previousWeight);

            // Should have at least one alert
            expect(alerts.length).toBeGreaterThan(0);

            // Should have a weight_change alert
            const weightAlert = alerts.find(a => a.type === 'weight_change');
            expect(weightAlert).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger alert for normal weight change', () => {
      fc.assert(
        fc.property(
          healthMetricsArbitrary,
          fc.float({ min: 60, max: 100, noNaN: true }),
          (baseMetrics, currentWeight) => {
            // Create a previous weight that differs by less than the warning threshold
            const previousWeight = currentWeight + 0.5; // Small change
            
            const metrics = { 
              ...baseMetrics, 
              weightKg: currentWeight,
              caloriesEstimated: 2000, // Normal calories
              hydrationLiters: 2.5, // Normal hydration
              sleepHours: 8, // Normal sleep
            };
            
            const alerts = checkHealthThresholds(metrics, previousWeight);

            // Should not have a weight alert
            const weightAlert = alerts.find(a => a.type === 'weight_change');
            expect(weightAlert).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Alert generation', () => {
    it('should generate valid emergency alerts', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.constantFrom('weight_change', 'calorie_extreme', 'dehydration', 'sleep_deprivation'),
          fc.constantFrom('warning', 'critical'),
          fc.string({ minLength: 10, maxLength: 200 }),
          (userId, type, severity, message) => {
            const alert = generateEmergencyAlert(userId, type, severity, message);

            // Verify alert structure
            expect(alert.alertId).toBeDefined();
            expect(alert.userId).toBe(userId);
            expect(alert.type).toBe(type);
            expect(alert.severity).toBe(severity);
            expect(alert.message).toBe(message);
            expect(alert.triggeredAt).toBeDefined();
            expect(alert.resolved).toBe(false);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
