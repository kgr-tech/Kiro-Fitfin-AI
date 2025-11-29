// Core Data Models for Kiro Fitfin Agent

/**
 * LifeFitFinSync Scores
 * Represents the composite wellness score across all dimensions
 */
export interface LifeFitFinSyncScores {
  userId: string;
  date: string;
  overallScore: number;
  healthScore: number;
  fitnessScore: number;
  financeScore: number;
  growthScore: number;
  alertPenalty: number;
}

/**
 * Health Metrics
 * Tracks diet, hydration, sleep, and weight data
 */
export interface HealthMetrics {
  userId: string;
  date: string;
  meals: MealEntry[];
  hydrationLiters: number;
  sleepHours?: number;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  weightKg?: number;
  caloriesEstimated: number;
  dietQualityScore: number;
}

export interface MealEntry {
  timestamp: string;
  description: string;
  portions: number;
  estimatedCalories: number;
}

/**
 * Fitness Metrics
 * Tracks exercise, movement, and physical activity
 */
export interface FitnessMetrics {
  userId: string;
  date: string;
  exercises: ExerciseEntry[];
  dailySteps: number;
  totalMinutes: number;
  strengthSessions: number;
  movementTarget: number;
  movementAchieved: number;
}

export interface ExerciseEntry {
  type: string;
  durationMinutes: number;
  intensity: 'low' | 'moderate' | 'high';
  timestamp: string;
}

/**
 * Finance Metrics
 * Tracks spending, meal sources, and food waste
 */
export interface FinanceMetrics {
  userId: string;
  weekStart: string;
  grocerySpend: number;
  takeoutSpend: number;
  snackSpend: number;
  supplementSpend: number;
  homeCookedMeals: number;
  purchasedMeals: number;
  expiredItems: number;
  totalItems: number;
  previousWeekSpend: number;
}

/**
 * Growth Metrics
 * Tracks study blocks, revision, and practice tasks
 */
export interface GrowthMetrics {
  userId: string;
  weekStart: string;
  studyBlocksCompleted: number;
  studyBlocksPlanned: number;
  revisionTasksCompleted: number;
  revisionTasksPlanned: number;
  practiceTasksCompleted: number;
  practiceTasksPlanned: number;
  subjects: string[];
}

/**
 * Emergency Alert
 * Represents health threshold breaches requiring immediate attention
 */
export interface EmergencyAlert {
  alertId: string;
  userId: string;
  type: 'weight_change' | 'calorie_extreme' | 'dehydration' | 'sleep_deprivation';
  severity: 'warning' | 'critical';
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolved: boolean;
}

/**
 * Doctor Contact
 * Contact information for emergency medical consultation
 */
export interface DoctorContact {
  name: string;
  phone: string;
  email: string;
  specialty?: string;
}

/**
 * Score Calculation Input
 * Input data for computing LifeFitFinSync scores
 */
export interface ScoreCalculationInput {
  userId: string;
  healthMetrics?: HealthMetrics;
  fitnessMetrics?: FitnessMetrics;
  financeMetrics?: FinanceMetrics;
  growthMetrics?: GrowthMetrics;
  activeAlerts: number;
}

/**
 * Score Calculation Output
 * Result of score computation with all dimensional scores
 */
export interface ScoreCalculationOutput {
  overallScore: number;
  healthScore: number;
  fitnessScore: number;
  financeScore: number;
  growthScore: number;
  calculatedAt: string;
}

/**
 * Parsed Data
 * Result of parsing annotated user input
 */
export interface ParsedData {
  dailyMeals?: MealData[];
  exerciseMinutes?: ExerciseData[];
  jobSchedule?: ScheduleData;
  studyGoals?: StudyData;
  weeklyExpenses?: ExpenseData;
}

// Supporting types for ParsedData
export interface MealData {
  date: string;
  meals: MealEntry[];
}

export interface ExerciseData {
  date: string;
  type: string;
  durationMinutes: number;
  steps: number;
}

export interface ScheduleData {
  workHours: string;
  commuteMinutes: number;
  preferredWorkoutTimes: string[];
}

export interface StudyData {
  subjects: string[];
  examDate?: string;
  weakTopics: string[];
}

export interface ExpenseData {
  groceries: number;
  takeout: number;
  snacks: number;
  supplements: number;
}
