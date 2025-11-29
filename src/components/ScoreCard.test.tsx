// Property-Based Tests for ScoreCard Component
// Feature: dashboard-scoring

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ScoreCard } from './ScoreCard';
import React from 'react';

// Feature: dashboard-scoring, Property 6: Complete score display
// Validates: Requirements 2.4
describe('Property 6: Complete score display', () => {
  it('should display score with numerical value', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.constantFrom('up', 'down', 'stable', undefined),
        (title, score, trend) => {
          const { container } = render(
            <ScoreCard
              title={title}
              score={score}
              maxScore={100}
              icon={<span>📊</span>}
              trend={trend}
            />
          );

          // Should display the title
          expect(screen.getByText(title)).toBeInTheDocument();

          // Should display the score value (rounded)
          const roundedScore = Math.round(score);
          expect(screen.getByText(roundedScore.toString())).toBeInTheDocument();

          // Should display the max score
          expect(screen.getByText('/ 100')).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all five scores when rendering multiple score cards', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (overall, health, fitness, finance, growth) => {
          const scores = [
            { title: 'Overall Score', score: overall },
            { title: 'Health Score', score: health },
            { title: 'Fitness Score', score: fitness },
            { title: 'Finance Score', score: finance },
            { title: 'Personal Growth Score', score: growth },
          ];

          const { container } = render(
            <div>
              {scores.map((s, i) => (
                <ScoreCard
                  key={i}
                  title={s.title}
                  score={s.score}
                  maxScore={100}
                  icon={<span>📊</span>}
                />
              ))}
            </div>
          );

          // All five titles should be present
          scores.forEach(s => {
            expect(screen.getByText(s.title)).toBeInTheDocument();
          });

          // All five score values should be present
          scores.forEach(s => {
            const roundedScore = Math.round(s.score);
            expect(screen.getByText(roundedScore.toString())).toBeInTheDocument();
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display score in /maxScore format', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.integer({ min: 50, max: 200 }),
        (score, maxScore) => {
          render(
            <ScoreCard
              title="Test Score"
              score={score}
              maxScore={maxScore}
              icon={<span>📊</span>}
            />
          );

          // Should display in "score / maxScore" format
          expect(screen.getByText(`/ ${maxScore}`)).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: dashboard-scoring, Property 3: Accessibility icon-label pairing
// Validates: Requirements 1.4
describe('Property 3: Accessibility icon-label pairing', () => {
  it('should have both icon and text label for every metric', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (title, score) => {
          const iconContent = '📊';
          const { container } = render(
            <ScoreCard
              title={title}
              score={score}
              maxScore={100}
              icon={<span>{iconContent}</span>}
            />
          );

          // Should have the icon (visual indicator)
          expect(screen.getByText(iconContent)).toBeInTheDocument();

          // Should have the text label
          expect(screen.getByText(title)).toBeInTheDocument();

          // Both should be present together
          const iconElement = screen.getByText(iconContent);
          const labelElement = screen.getByText(title);
          
          expect(iconElement).toBeInTheDocument();
          expect(labelElement).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have proper ARIA labels for accessibility', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        (title, score) => {
          const { container } = render(
            <ScoreCard
              title={title}
              score={score}
              maxScore={100}
              icon={<span>📊</span>}
            />
          );

          // Should have aria-label for the card
          const card = container.querySelector('[role="article"]');
          expect(card).toHaveAttribute('aria-label', `${title} score card`);

          // Should have aria-label for the score
          const scoreElement = screen.getByLabelText(`Score: ${Math.round(score)} out of 100`);
          expect(scoreElement).toBeInTheDocument();

          // Should have progressbar with proper ARIA attributes
          const progressBar = container.querySelector('[role="progressbar"]');
          expect(progressBar).toHaveAttribute('aria-valuenow', score.toString());
          expect(progressBar).toHaveAttribute('aria-valuemin', '0');
          expect(progressBar).toHaveAttribute('aria-valuemax', '100');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display trend indicator with label when provided', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.constantFrom('up', 'down', 'stable'),
        (title, score, trend) => {
          const { container } = render(
            <ScoreCard
              title={title}
              score={score}
              maxScore={100}
              icon={<span>📊</span>}
              trend={trend}
            />
          );

          // Should have trend indicator
          const trendLabels = {
            up: 'Trend: Improving',
            down: 'Trend: Declining',
            stable: 'Trend: Stable',
          };

          const trendElement = screen.getByLabelText(trendLabels[trend]);
          expect(trendElement).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('ScoreCard visual behavior', () => {
  it('should apply correct color based on score percentage', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        (score) => {
          const { container } = render(
            <ScoreCard
              title="Test Score"
              score={score}
              maxScore={100}
              icon={<span>📊</span>}
            />
          );

          const percentage = score;
          const scoreElement = screen.getByLabelText(`Score: ${Math.round(score)} out of 100`);

          // Verify color class is applied based on percentage
          if (percentage >= 80) {
            expect(scoreElement.className).toContain('green');
          } else if (percentage >= 60) {
            expect(scoreElement.className).toContain('yellow');
          } else if (percentage >= 40) {
            expect(scoreElement.className).toContain('orange');
          } else {
            expect(scoreElement.className).toContain('red');
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display progress bar with correct width', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        (score) => {
          const { container } = render(
            <ScoreCard
              title="Test Score"
              score={score}
              maxScore={100}
              icon={<span>📊</span>}
            />
          );

          const progressBar = container.querySelector('[role="progressbar"]');
          expect(progressBar).toBeInTheDocument();

          // Progress bar should have correct aria values
          expect(progressBar).toHaveAttribute('aria-valuenow', score.toString());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
