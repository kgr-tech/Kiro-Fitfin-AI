// Study Progress Chart Component
// Displays study blocks completion as a heatmap-style bar chart

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudyProgressData {
  subject: string;
  completed: number;
  planned: number;
}

interface StudyProgressChartProps {
  data: StudyProgressData[];
}

export function StudyProgressChart({ data }: StudyProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const labels = data.map(d => d.subject);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completed',
        data: data.map(d => d.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Remaining',
        data: data.map(d => Math.max(0, d.planned - d.completed)),
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Study Blocks Completion by Subject',
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            const completed = data[index].completed;
            const planned = data[index].planned;
            const percentage = planned > 0 ? ((completed / planned) * 100).toFixed(1) : '0';
            return `Progress: ${percentage}%`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Study Blocks',
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          stepSize: 1,
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
}
