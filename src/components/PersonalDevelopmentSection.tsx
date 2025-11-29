// Personal Development Section
// Displays study blocks, revision, and practice tasks

import React from 'react';
import { Section } from './Section';
import { GrowthMetrics } from '../types';

interface PersonalDevelopmentSectionProps {
  growthData: GrowthMetrics;
}

export function PersonalDevelopmentSection({ growthData }: PersonalDevelopmentSectionProps) {
  const studyCompletion = growthData.studyBlocksPlanned > 0
    ? (growthData.studyBlocksCompleted / growthData.studyBlocksPlanned) * 100
    : 0;

  const revisionCompletion = growthData.revisionTasksPlanned > 0
    ? (growthData.revisionTasksCompleted / growthData.revisionTasksPlanned) * 100
    : 0;

  const practiceCompletion = growthData.practiceTasksPlanned > 0
    ? (growthData.practiceTasksCompleted / growthData.practiceTasksPlanned) * 100
    : 0;

  const overallCompletion = (studyCompletion + revisionCompletion + practiceCompletion) / 3;

  return (
    <Section title="📘 Personal Development">
      {/* Study Blocks */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Study Blocks</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {growthData.studyBlocksCompleted} / {growthData.studyBlocksPlanned}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{ width: `${Math.min(studyCompletion, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(studyCompletion)}% complete
        </p>
      </div>

      {/* Revision Schedule */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Revision Tasks</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {growthData.revisionTasksCompleted} / {growthData.revisionTasksPlanned}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-purple-600 transition-all"
            style={{ width: `${Math.min(revisionCompletion, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(revisionCompletion)}% complete
        </p>
      </div>

      {/* Practice Tasks */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Practice Tasks</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {growthData.practiceTasksCompleted} / {growthData.practiceTasksPlanned}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-green-600 transition-all"
            style={{ width: `${Math.min(practiceCompletion, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(practiceCompletion)}% complete
        </p>
      </div>

      {/* Subjects */}
      {growthData.subjects.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Active Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {growthData.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Discipline Score */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Weekly Discipline Score
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(overallCompletion)}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {overallCompletion >= 80 ? "Excellent discipline! Keep it up!" :
             overallCompletion >= 60 ? "Good progress. Stay consistent!" :
             overallCompletion >= 40 ? "You're building momentum!" :
             "Small steps lead to big results!"}
          </p>
        </div>
      </div>
    </Section>
  );
}
