// Financial Sync Section
// Displays spending breakdown, savings target, and meal planning

import React from 'react';
import { Section } from './Section';
import { FinanceMetrics } from '../types';

interface FinancialSyncSectionProps {
  financeData: FinanceMetrics;
}

export function FinancialSyncSection({ financeData }: FinancialSyncSectionProps) {
  const totalSpend = financeData.grocerySpend + financeData.takeoutSpend + 
                     financeData.snackSpend + financeData.supplementSpend;
  
  const spendingChange = financeData.previousWeekSpend > 0
    ? ((totalSpend - financeData.previousWeekSpend) / financeData.previousWeekSpend) * 100
    : 0;

  const totalMeals = financeData.homeCookedMeals + financeData.purchasedMeals;
  const homeCookedPercentage = totalMeals > 0
    ? (financeData.homeCookedMeals / totalMeals) * 100
    : 0;

  const wasteRate = financeData.totalItems > 0
    ? (financeData.expiredItems / financeData.totalItems) * 100
    : 0;

  const weeklySavingsTarget = financeData.previousWeekSpend * 0.1; // 10% savings goal

  return (
    <Section title="💸 Financial Sync Report">
      {/* Spending Breakdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Weekly Spending</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Groceries</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ${financeData.grocerySpend.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Takeout</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ${financeData.takeoutSpend.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Snacks</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ${financeData.snackSpend.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Supplements</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ${financeData.supplementSpend.toFixed(2)}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-300 dark:border-gray-600 flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Total</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ${totalSpend.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Spending Comparison */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          vs. Previous Week
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${
            spendingChange < 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {spendingChange > 0 ? '+' : ''}{spendingChange.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {spendingChange < 0 ? '↓ Saving money!' : '↑ Spending more'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Previous week: ${financeData.previousWeekSpend.toFixed(2)}
        </p>
      </div>

      {/* Meal Planning Comparison */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Meal Planning
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Home-cooked</span>
            <span className="font-semibold text-green-600">
              {financeData.homeCookedMeals} meals ({Math.round(homeCookedPercentage)}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Purchased</span>
            <span className="font-semibold text-orange-600">
              {financeData.purchasedMeals} meals ({Math.round(100 - homeCookedPercentage)}%)
            </span>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-green-600 transition-all"
            style={{ width: `${homeCookedPercentage}%` }}
          />
        </div>
      </div>

      {/* Food Waste */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Food Waste
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {financeData.expiredItems} of {financeData.totalItems} items expired
          </span>
          <span className={`font-bold ${
            wasteRate < 5 ? 'text-green-600' :
            wasteRate < 10 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {wasteRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Weekly Savings Target */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Weekly Savings Target
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Aim to save ${weeklySavingsTarget.toFixed(2)} this week by:
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>Cooking more meals at home</li>
          <li>Reducing takeout orders</li>
          <li>Planning meals to minimize waste</li>
          <li>Buying groceries in bulk when possible</li>
        </ul>
      </div>
    </Section>
  );
}
