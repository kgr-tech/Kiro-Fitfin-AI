// LifeFitFinSync Score Section
// Displays all 5 score cards (Overall + 4 dimensions)

import React from 'react';
import { Section } from './Section';
import { ScoreCard } from './ScoreCard';
import { LifeFitFinSyncScores } from '../types';

interface LifeFitFinSyncScoreSectionProps {
  scores: LifeFitFinSyncScores;
}

export function LifeFitFinSyncScoreSection({ scores }: LifeFitFinSyncScoreSectionProps) {
  return (
    <Section title="🧬 LifeFitFinSync Score">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScoreCard
          title="Overall Score"
          score={scores.overallScore}
          maxScore={100}
          icon={<span>⭐</span>}
        />
        <ScoreCard
          title="Health Score"
          score={scores.healthScore}
          maxScore={100}
          icon={<span>❤️</span>}
        />
        <ScoreCard
          title="Fitness Score"
          score={scores.fitnessScore}
          maxScore={100}
          icon={<span>💪</span>}
        />
        <ScoreCard
          title="Finance Score"
          score={scores.financeScore}
          maxScore={100}
          icon={<span>💰</span>}
        />
        <ScoreCard
          title="Personal Growth Score"
          score={scores.growthScore}
          maxScore={100}
          icon={<span>📚</span>}
        />
      </div>
    </Section>
  );
}
