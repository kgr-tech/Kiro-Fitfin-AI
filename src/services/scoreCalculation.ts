// Score Calculation Engine for Kiro Fitfin Agent

import {
  HealthMetrics,
  FitnessMetrics,
  FinanceMetrics,
  GrowthMetrics,
  ScoreCalculationInput,
  ScoreCalculationOutput,
} from '../types';

/**
 * Clamps a score value between 0 and 100
 */
function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Health Score based on diet, hydration, sleep, and weight
 */
export function calculateHealthScore(metrics: HealthMetrics): number {
  let score = 0;
  let components = 0;

  // Diet quality (0-100)
  if (metrics.dietQualityScore !== undefined) {
    score += metrics.dietQualityScore;
    components++;
  }

  // Hydration (target: 2-3 liters per day)
  if (metrics.hydrationLiters !== undefined) {
    const hydrationScore = Math.min(100, (metrics.hydrationLiters / 2.5) * 100);
    score += hydrationScore;
    components++;
  }

  // Sleep quality
  if (metrics.sleepHours !== undefined) {
    const sleepScore = Math.min(100, (metrics.sleepHours / 8) * 100);
    score += sleepScore;
    components++;
  }

  // Weight trend (simplified - would need historical data)
  if (metrics.weightKg !== undefined) {
    // Placeholder: assume stable weight is good
    score += 80;
    components++;
  }

  const finalScore = components > 0 ? score / components : 0;
  return clampScore(finalScore);
}

/**
 * Calculate Fitness Score based on movement and exercise
 */
export function calculateFitnessScore(metrics: FitnessMetrics): number {
  let score = 0;
  let components = 0;

  // Movement achievement
  if (metrics.movementTarget > 0) {
    const movementScore = Math.min(100, (metrics.movementAchieved / metrics.movementTarget) * 100);
    score += movementScore;
    components++;
  }

  // Exercise minutes (target: 150 minutes per week = ~21 per day)
  if (metrics.totalMinutes !== undefined) {
    const exerciseScore = Math.min(100, (metrics.totalMinutes / 21) * 100);
    score += exerciseScore;
    components++;
  }

  // Strength training sessions
  if (metrics.strengthSessions !== undefined) {
    const strengthScore = Math.min(100, (metrics.strengthSessions / 3) * 100);
    score += strengthScore;
    components++;
  }

  const finalScore = components > 0 ? score / components : 0;
  return clampScore(finalScore);
}

/**
 * Calculate Finance Score based on meal sources and spending
 */
export function calculateFinanceScore(metrics: FinanceMetrics): number {
  let score = 0;
  let components = 0;

  // Home-cooked meal ratio
  const totalMeals = metrics.homeCookedMeals + metrics.purchasedMeals;
  if (totalMeals > 0) {
    const mealRatioScore = (metrics.homeCookedMeals / totalMeals) * 100;
    score += mealRatioScore;
    components++;
  }

  // Food waste rate (lower is better)
  if (metrics.totalItems > 0) {
    const wasteRate = metrics.expiredItems / metrics.totalItems;
    const wasteScore = (1 - wasteRate) * 100;
    score += wasteScore;
    components++;
  }

  // Spending reduction
  const totalSpend = metrics.grocerySpend + metrics.takeoutSpend + metrics.snackSpend + metrics.supplementSpend;
  if (metrics.previousWeekSpend > 0) {
    const spendingReduction = (metrics.previousWeekSpend - totalSpend) / metrics.previousWeekSpend;
    const spendingScore = Math.max(0, Math.min(100, 50 + spendingReduction * 100));
    score += spendingScore;
    components++;
  }

  const finalScore = components > 0 ? score / components : 0;
  return clampScore(finalScore);
}

/**
 * Calculate Personal Growth Score based on study and practice
 */
export function calculateGrowthScore(metrics: GrowthMetrics): number {
  let score = 0;
  let components = 0;

  // Study blocks completion
  if (metrics.studyBlocksPlanned > 0) {
    const studyScore = (metrics.studyBlocksCompleted / metrics.studyBlocksPlanned) * 100;
    score += studyScore;
    components++;
  }

  // Revision adherence
  if (metrics.revisionTasksPlanned > 0) {
    const revisionScore = (metrics.revisionTasksCompleted / metrics.revisionTasksPlanned) * 100;
    score += revisionScore;
    components++;
  }

  // Practice tasks
  if (metrics.practiceTasksPlanned > 0) {
    const practiceScore = (metrics.practiceTasksCompleted / metrics.practiceTasksPlanned) * 100;
    score += practiceScore;
    components++;
  }

  const finalScore = components > 0 ? score / components : 0;
  return clampScore(finalScore);
}

/**
 * Calculate Overall LifeFitFinSync Score with weighted average
 * Only includes available dimensions in the calculation
 */
export function calculateOverallScore(
  healthScore: number,
  fitnessScore: number,
  financeScore: number,
  growthScore: number,
  activeAlerts: number
): number {
  // Simple average of all four dimensions (equal weights)
  const weightedScore = (healthScore + fitnessScore + financeScore + growthScore) / 4;

  // Apply alert penalty (5 points per active alert)
  const alertPenalty = activeAlerts * 5;
  const finalScore = weightedScore - alertPenalty;

  return clampScore(finalScore);
}

/**
 * Main score calculation function
 * Handles missing dimensions by excluding them from weighted average
 */
export function calculateScores(input: ScoreCalculationInput): ScoreCalculationOutput {
  const healthScore = input.healthMetrics ? calculateHealthScore(input.healthMetrics) : 0;
  const fitnessScore = input.fitnessMetrics ? calculateFitnessScore(input.fitnessMetrics) : 0;
  const financeScore = input.financeMetrics ? calculateFinanceScore(input.financeMetrics) : 0;
  const growthScore = input.growthMetrics ? calculateGrowthScore(input.growthMetrics) : 0;
  
  // Calculate overall score based on available dimensions
  const availableScores: number[] = [];
  if (input.healthMetrics) availableScores.push(healthScore);
  if (input.fitnessMetrics) availableScores.push(fitnessScore);
  if (input.financeMetrics) availableScores.push(financeScore);
  if (input.growthMetrics) availableScores.push(growthScore);
  
  let overallScore = 0;
  if (availableScores.length > 0) {
    const averageScore = availableScores.reduce((a, b) => a + b, 0) / availableScores.length;
    const alertPenalty = input.activeAlerts * 5;
    overallScore = clampScore(averageScore - alertPenalty);
  }

  return {
    overallScore,
    healthScore,
    fitnessScore,
    financeScore,
    growthScore,
    calculatedAt: new Date().toISOString(),
  };
}
