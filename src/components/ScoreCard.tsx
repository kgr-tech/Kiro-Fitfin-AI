// ScoreCard Component for Kiro Fitfin Agent
// Displays individual scores with icons, trends, and accessibility support

import React from 'react';
import { ScoreCardProps } from '../types/components';

/**
 * ScoreCard Component
 * Displays a score with title, icon, trend indicator, and proper accessibility
 */
export function ScoreCard({ title, score, maxScore, icon, trend }: ScoreCardProps) {
  // Calculate percentage for visual representation
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Determine color based on score percentage
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (!trend) return null;

    const trendIcons = {
      up: '↑',
      down: '↓',
      stable: '→',
    };

    const trendColors = {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      stable: 'text-gray-600 dark:text-gray-400',
    };

    const trendLabels = {
      up: 'Improving',
      down: 'Declining',
      stable: 'Stable',
    };

    return (
      <span 
        className={`ml-2 text-sm ${trendColors[trend]}`}
        aria-label={`Trend: ${trendLabels[trend]}`}
      >
        {trendIcons[trend]}
      </span>
    );
  };

  return (
    <div 
      className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border"
      role="article"
      aria-label={`${title} score card`}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icon with label for accessibility */}
          <div 
            className="text-2xl text-gray-700 dark:text-gray-300"
            aria-hidden="true"
          >
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        {getTrendDisplay()}
      </div>

      {/* Score display */}
      <div className="flex items-baseline gap-2">
        <span 
          className={`text-4xl font-bold ${getScoreColor()}`}
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          {Math.round(score)}
        </span>
        <span className="text-2xl text-gray-500 dark:text-gray-400">
          / {maxScore}
        </span>
      </div>

      {/* Progress bar */}
      <div 
        className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={`${title} progress`}
      >
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            percentage >= 80 ? 'bg-green-600 dark:bg-green-400' :
            percentage >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' :
            percentage >= 40 ? 'bg-orange-600 dark:bg-orange-400' :
            'bg-red-600 dark:bg-red-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Percentage label */}
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-right">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
