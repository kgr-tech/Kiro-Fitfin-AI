// Emergency Alert Detection for Kiro Fitfin Agent
// Monitors health metrics and triggers alerts when thresholds are breached

import { HealthMetrics, EmergencyAlert } from '../types';

/**
 * Health threshold constants
 * These define the safe ranges for various health metrics
 */
export const HEALTH_THRESHOLDS = {
  // Weight change thresholds (kg per week)
  WEIGHT_CHANGE_WARNING: 1.0, // More than 1kg per week
  WEIGHT_CHANGE_CRITICAL: 2.0, // More than 2kg per week

  // Calorie thresholds (daily)
  CALORIES_MIN_WARNING: 1200,
  CALORIES_MIN_CRITICAL: 800,
  CALORIES_MAX_WARNING: 3500,
  CALORIES_MAX_CRITICAL: 5000,

  // Hydration thresholds (liters per day)
  HYDRATION_MIN_WARNING: 1.5,
  HYDRATION_MIN_CRITICAL: 1.0,

  // Sleep thresholds (hours per night)
  SLEEP_MIN_WARNING: 6,
  SLEEP_MIN_CRITICAL: 4,
  SLEEP_MAX_WARNING: 10,
} as const;

/**
 * Generate a unique alert ID
 */
function generateAlertId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check for weight change alerts
 * Requires historical weight data to detect rapid changes
 */
function checkWeightThresholds(
  currentWeight: number | undefined,
  previousWeight: number | undefined,
  userId: string
): EmergencyAlert | null {
  if (currentWeight === undefined || previousWeight === undefined) {
    return null;
  }

  const weightChange = Math.abs(currentWeight - previousWeight);

  if (weightChange >= HEALTH_THRESHOLDS.WEIGHT_CHANGE_CRITICAL) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'weight_change',
      severity: 'critical',
      message: `Critical: Rapid weight change detected (${weightChange.toFixed(1)}kg). Please consult your doctor immediately.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (weightChange >= HEALTH_THRESHOLDS.WEIGHT_CHANGE_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'weight_change',
      severity: 'warning',
      message: `Warning: Significant weight change detected (${weightChange.toFixed(1)}kg). Monitor your health closely.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
}

/**
 * Check for calorie intake alerts
 */
function checkCalorieThresholds(
  calories: number,
  userId: string
): EmergencyAlert | null {
  if (calories <= HEALTH_THRESHOLDS.CALORIES_MIN_CRITICAL) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'calorie_extreme',
      severity: 'critical',
      message: `Critical: Extremely low calorie intake (${calories} kcal). This is dangerously low. Please consult your doctor.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (calories <= HEALTH_THRESHOLDS.CALORIES_MIN_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'calorie_extreme',
      severity: 'warning',
      message: `Warning: Low calorie intake (${calories} kcal). Ensure you're meeting your nutritional needs.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (calories >= HEALTH_THRESHOLDS.CALORIES_MAX_CRITICAL) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'calorie_extreme',
      severity: 'critical',
      message: `Critical: Extremely high calorie intake (${calories} kcal). This may indicate binge eating. Please seek support.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (calories >= HEALTH_THRESHOLDS.CALORIES_MAX_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'calorie_extreme',
      severity: 'warning',
      message: `Warning: High calorie intake (${calories} kcal). Consider moderating your portions.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
}

/**
 * Check for hydration alerts
 */
function checkHydrationThresholds(
  hydrationLiters: number,
  userId: string
): EmergencyAlert | null {
  if (hydrationLiters <= HEALTH_THRESHOLDS.HYDRATION_MIN_CRITICAL) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'dehydration',
      severity: 'critical',
      message: `Critical: Severe dehydration risk (${hydrationLiters.toFixed(1)}L). Drink water immediately and monitor symptoms.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (hydrationLiters <= HEALTH_THRESHOLDS.HYDRATION_MIN_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'dehydration',
      severity: 'warning',
      message: `Warning: Low hydration (${hydrationLiters.toFixed(1)}L). Aim for at least 2-3 liters per day.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
}

/**
 * Check for sleep deprivation alerts
 */
function checkSleepThresholds(
  sleepHours: number | undefined,
  userId: string
): EmergencyAlert | null {
  if (sleepHours === undefined) {
    return null;
  }

  if (sleepHours <= HEALTH_THRESHOLDS.SLEEP_MIN_CRITICAL) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'sleep_deprivation',
      severity: 'critical',
      message: `Critical: Severe sleep deprivation (${sleepHours.toFixed(1)} hours). This affects your health and safety. Prioritize rest.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (sleepHours <= HEALTH_THRESHOLDS.SLEEP_MIN_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'sleep_deprivation',
      severity: 'warning',
      message: `Warning: Insufficient sleep (${sleepHours.toFixed(1)} hours). Aim for 7-9 hours per night.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  if (sleepHours >= HEALTH_THRESHOLDS.SLEEP_MAX_WARNING) {
    return {
      alertId: generateAlertId(),
      userId,
      type: 'sleep_deprivation',
      severity: 'warning',
      message: `Warning: Excessive sleep (${sleepHours.toFixed(1)} hours). This may indicate underlying health issues.`,
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
}

/**
 * Check all health thresholds and return any triggered alerts
 */
export function checkHealthThresholds(
  metrics: HealthMetrics,
  previousWeight?: number
): EmergencyAlert[] {
  const alerts: EmergencyAlert[] = [];

  // Check weight change
  const weightAlert = checkWeightThresholds(metrics.weightKg, previousWeight, metrics.userId);
  if (weightAlert) alerts.push(weightAlert);

  // Check calories
  const calorieAlert = checkCalorieThresholds(metrics.caloriesEstimated, metrics.userId);
  if (calorieAlert) alerts.push(calorieAlert);

  // Check hydration
  const hydrationAlert = checkHydrationThresholds(metrics.hydrationLiters, metrics.userId);
  if (hydrationAlert) alerts.push(hydrationAlert);

  // Check sleep
  const sleepAlert = checkSleepThresholds(metrics.sleepHours, metrics.userId);
  if (sleepAlert) alerts.push(sleepAlert);

  return alerts;
}

/**
 * Generate an emergency alert with custom parameters
 */
export function generateEmergencyAlert(
  userId: string,
  type: EmergencyAlert['type'],
  severity: EmergencyAlert['severity'],
  message: string
): EmergencyAlert {
  return {
    alertId: generateAlertId(),
    userId,
    type,
    severity,
    message,
    triggeredAt: new Date().toISOString(),
    resolved: false,
  };
}
