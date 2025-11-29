// Finance Spending Chart Component
// Displays spending categories breakdown as a doughnut chart

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface FinanceSpendingChartProps {
  groceries: number;
  takeout: number;
  snacks: number;
  supplements: number;
}

export function FinanceSpendingChart({
  groceries,
  takeout,
  snacks,
  supplements,
}: FinanceSpendingChartProps) {
  const total = groceries + takeout + snacks + supplements;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Groceries', 'Takeout', 'Snacks', 'Supplements'],
    datasets: [
      {
        label: 'Spending ($)',
        data: [groceries, takeout, snacks, supplements],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // Green for groceries
          'rgba(239, 68, 68, 0.7)',    // Red for takeout
          'rgba(251, 191, 36, 0.7)',   // Yellow for snacks
          'rgba(59, 130, 246, 0.7)',   // Blue for supplements
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Spending Categories Breakdown',
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-lg">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
