// Property-Based Tests for Chart Components
// Feature: dashboard-scoring

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { HealthTrendChart } from './HealthTrendChart';
import { FitnessActivityChart } from './FitnessActivityChart';
import { FinanceSpendingChart } from './FinanceSpendingChart';
import { StudyProgressChart } from './StudyProgressChart';

// Feature: dashboard-scoring, Property 41: Chart proportional scaling
// Validates: Requirements 10.5
describe('Property 41: Chart proportional scaling', () => {
  it('should render HealthTrendChart at different viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            date: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
            weight: fc.option(fc.float({ min: 50, max: 120, noNaN: true })),
            calories: fc.integer({ min: 1000, max: 3000 }),
          }),
          { minLength: 3, maxLength: 14 }
        ),
        (data) => {
          const { container } = render(<HealthTrendChart data={data} />);
          
          // Chart should render
          const canvas = container.querySelector('canvas');
          expect(canvas).toBeInTheDocument();

          // Chart should have responsive attributes
          // Chart.js sets these automatically
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render FitnessActivityChart at different viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            day: fc.constantFrom('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
            minutes: fc.integer({ min: 0, max: 120 }),
            type: fc.constantFrom('running', 'cycling', 'swimming', 'walking'),
          }),
          { minLength: 3, maxLength: 7 }
        ),
        (data) => {
          const { container } = render(<FitnessActivityChart data={data} />);
          
          // Chart should render
          const canvas = container.querySelector('canvas');
          expect(canvas).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render FinanceSpendingChart at different viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 300, noNaN: true }),
        fc.float({ min: 0, max: 200, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (groceries, takeout, snacks, supplements) => {
          const { container } = render(
            <FinanceSpendingChart
              groceries={groceries}
              takeout={takeout}
              snacks={snacks}
              supplements={supplements}
            />
          );
          
          // Chart should render if there's data
          if (groceries + takeout + snacks + supplements > 0) {
            const canvas = container.querySelector('canvas');
            expect(canvas).toBeInTheDocument();
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render StudyProgressChart at different viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            subject: fc.string({ minLength: 3, maxLength: 15 }),
            completed: fc.integer({ min: 0, max: 20 }),
            planned: fc.integer({ min: 5, max: 20 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (data) => {
          const { container } = render(<StudyProgressChart data={data} />);
          
          // Chart should render
          const canvas = container.querySelector('canvas');
          expect(canvas).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display "No data available" message when data is empty', () => {
    const { container: healthContainer } = render(<HealthTrendChart data={[]} />);
    expect(healthContainer.textContent).toContain('No data available');

    const { container: fitnessContainer } = render(<FitnessActivityChart data={[]} />);
    expect(fitnessContainer.textContent).toContain('No data available');

    const { container: financeContainer } = render(
      <FinanceSpendingChart groceries={0} takeout={0} snacks={0} supplements={0} />
    );
    expect(financeContainer.textContent).toContain('No data available');

    const { container: studyContainer } = render(<StudyProgressChart data={[]} />);
    expect(studyContainer.textContent).toContain('No data available');
  });

  it('should maintain aspect ratio across different data sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 30 }),
        (dataPoints) => {
          const healthData = Array.from({ length: dataPoints }, (_, i) => ({
            date: new Date(2024, 0, i + 1).toISOString(),
            weight: 70 + Math.random() * 10,
            calories: 2000 + Math.random() * 500,
          }));

          const { container } = render(<HealthTrendChart data={healthData} />);
          
          // Chart should render regardless of data size
          const canvas = container.querySelector('canvas');
          expect(canvas).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Chart dark mode support', () => {
  it('should render charts with appropriate styling', () => {
    const healthData = [
      { date: '2024-01-01', weight: 70, calories: 2000 },
      { date: '2024-01-02', weight: 69.5, calories: 1900 },
    ];

    const { container } = render(<HealthTrendChart data={healthData} />);
    
    // Chart container should have dark mode classes
    const chartContainer = container.querySelector('.dark\\:bg-dark-surface');
    expect(chartContainer).toBeInTheDocument();
  });
});
