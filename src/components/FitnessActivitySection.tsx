// Fitness & Activity Section
// Displays movement target, exercise plan, and motivation

import React from 'react';
import { Section } from './Section';
import { FitnessMetrics } from '../types';

interface FitnessActivitySectionProps {
  fitnessData: FitnessMetrics;
}

export function FitnessActivitySection({ fitnessData }: FitnessActivitySectionProps) {
  const movementPercentage = fitnessData.movementTarget > 0
    ? (fitnessData.movementAchieved / fitnessData.movementTarget) * 100
    : 0;

  return (
    <Section title="🏋️ Fitness & Activity Plan">
      {/* Daily Movement Target */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Daily Movement</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {fitnessData.movementAchieved.toLocaleString()} / {fitnessData.movementTarget.toLocaleString()} steps
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              movementPercentage >= 100 ? 'bg-green-600' :
              movementPercentage >= 75 ? 'bg-yellow-600' :
              'bg-orange-600'
            }`}
            style={{ width: `${Math.min(movementPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(movementPercentage)}% of daily goal
        </p>
      </div>

      {/* Weekly Exercise Plan */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Weekly Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fitnessData.totalMinutes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strength Sessions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fitnessData.strengthSessions}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Daily Steps</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fitnessData.dailySteps.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Exercises</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fitnessData.exercises.length}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Exercises */}
      {fitnessData.exercises.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Activities</h3>
          <ul className="space-y-2">
            {fitnessData.exercises.slice(0, 5).map((exercise, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {exercise.type}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {exercise.durationMinutes} min
                  <span className="ml-2 text-xs">({exercise.intensity})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Motivation Checkpoint */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💪 <strong>Keep going!</strong> {
            movementPercentage >= 100 ? "You've hit your daily goal!" :
            movementPercentage >= 75 ? "You're almost there!" :
            movementPercentage >= 50 ? "You're halfway to your goal!" :
            "Every step counts. Let's move!"
          }
        </p>
      </div>
    </Section>
  );
}
