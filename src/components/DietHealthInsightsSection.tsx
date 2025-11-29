// Diet & Health Insights Section
// Displays meals, hydration, sleep, and weight prediction

import React from 'react';
import { Section } from './Section';
import { HealthMetrics } from '../types';

interface DietHealthInsightsSectionProps {
  healthData: HealthMetrics;
}

export function DietHealthInsightsSection({ healthData }: DietHealthInsightsSectionProps) {
  // Calculate 4-6 week weight prediction (simplified)
  const predictWeight = () => {
    if (!healthData.weightKg) return null;
    
    const calorieDeficit = 2000 - healthData.caloriesEstimated;
    const weeklyWeightChange = (calorieDeficit * 7) / 7700; // 7700 cal = 1kg
    const fourWeekPrediction = healthData.weightKg + (weeklyWeightChange * 4);
    const sixWeekPrediction = healthData.weightKg + (weeklyWeightChange * 6);
    
    return { fourWeek: fourWeekPrediction, sixWeek: sixWeekPrediction };
  };

  const weightPrediction = predictWeight();

  return (
    <Section title="🍽️ Diet & Health Insights">
      {/* Daily Calorie Estimation */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Daily Calories</span>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {healthData.caloriesEstimated} kcal
        </span>
      </div>

      {/* Meal Quality Assessment */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Diet Quality</span>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {Math.round(healthData.dietQualityScore)}/100
        </span>
      </div>

      {/* Hydration Level */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Hydration</span>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {healthData.hydrationLiters.toFixed(1)}L / 2.5L
        </span>
      </div>

      {/* Sleep Quality */}
      {healthData.sleepHours !== undefined && (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Sleep</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {healthData.sleepHours.toFixed(1)} hours
            {healthData.sleepQuality && ` (${healthData.sleepQuality})`}
          </span>
        </div>
      )}

      {/* Weight Prediction */}
      {weightPrediction && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            4-6 Week Weight Prediction
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Current: {healthData.weightKg?.toFixed(1)} kg
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              4 weeks: {weightPrediction.fourWeek.toFixed(1)} kg
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              6 weeks: {weightPrediction.sixWeek.toFixed(1)} kg
            </p>
          </div>
        </div>
      )}

      {/* Recent Meals */}
      {healthData.meals.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Meals</h3>
          <ul className="space-y-2">
            {healthData.meals.slice(0, 3).map((meal, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{meal.description}</span>
                <span className="ml-2">({meal.estimatedCalories} kcal)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
