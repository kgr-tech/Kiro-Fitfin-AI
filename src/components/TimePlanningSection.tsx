// Time Planning Section
// Displays job-schedule-aware routine planning

import React from 'react';
import { Section } from './Section';

interface TimePlanningSectionProps {
  jobSchedule?: {
    workHours: string;
    commuteMinutes: number;
    preferredWorkoutTimes: string[];
  };
}

export function TimePlanningSection({ jobSchedule }: TimePlanningSectionProps) {
  // Default schedule if none provided
  const schedule = jobSchedule || {
    workHours: '9:00 AM - 5:00 PM',
    commuteMinutes: 30,
    preferredWorkoutTimes: ['Morning', 'Evening'],
  };

  return (
    <Section title="🕰️ Time Planning">
      {/* Job Schedule */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Schedule</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Work Hours</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {schedule.workHours}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Commute</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {schedule.commuteMinutes} min each way
            </span>
          </div>
        </div>
      </div>

      {/* Morning Routine */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🌅 Morning Routine
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Wake up 2 hours before work</li>
          <li>• 15 min: Hydration & light stretching</li>
          <li>• 30 min: Healthy breakfast</li>
          <li>• 20 min: Review daily goals</li>
          <li>• {schedule.commuteMinutes} min: Commute</li>
        </ul>
      </div>

      {/* Work-Hour Micro-Reminders */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          💼 During Work Hours
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Every 2 hours: Stand and stretch (5 min)</li>
          <li>• Lunch break: Walk for 15 minutes</li>
          <li>• Hydration check: Drink water every hour</li>
          <li>• Healthy snack at 3 PM</li>
        </ul>
      </div>

      {/* Evening Plan */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🌙 Evening Plan
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• After work: {schedule.commuteMinutes} min commute</li>
          <li>• 45 min: Workout or physical activity</li>
          <li>• 30 min: Prepare healthy dinner</li>
          <li>• 60 min: Study or skill development</li>
          <li>• 30 min: Relaxation & wind down</li>
          <li>• Sleep by 10:30 PM (7-8 hours)</li>
        </ul>
      </div>

      {/* Preferred Workout Times */}
      {schedule.preferredWorkoutTimes.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🏃 Best Workout Times
          </h3>
          <div className="flex flex-wrap gap-2">
            {schedule.preferredWorkoutTimes.map((time, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Time-Block Template */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          📅 Weekly Time Blocks
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-white dark:bg-gray-700 rounded">
            <strong>Mon-Fri:</strong> Work + Evening routine
          </div>
          <div className="p-2 bg-white dark:bg-gray-700 rounded">
            <strong>Sat:</strong> Meal prep + Long workout
          </div>
          <div className="p-2 bg-white dark:bg-gray-700 rounded">
            <strong>Sun:</strong> Study + Planning + Rest
          </div>
          <div className="p-2 bg-white dark:bg-gray-700 rounded">
            <strong>Daily:</strong> 7-8 hours sleep
          </div>
        </div>
      </div>
    </Section>
  );
}
