// Component Prop Interfaces for Kiro Fitfin Agent

import { ReactNode } from 'react';
import {
  LifeFitFinSyncScores,
  HealthMetrics,
  FitnessMetrics,
  FinanceMetrics,
  GrowthMetrics,
  EmergencyAlert,
  DoctorContact,
} from './index';

/**
 * Dashboard Container Props
 */
export interface DashboardProps {
  userId: string;
}

export interface DashboardState {
  scores: LifeFitFinSyncScores;
  healthData: HealthMetrics;
  fitnessData: FitnessMetrics;
  financeData: FinanceMetrics;
  growthData: GrowthMetrics;
  alerts: EmergencyAlert[];
  loading: boolean;
  error: string | null;
}

/**
 * Score Card Props
 */
export interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

/**
 * Emergency Alert Banner Props
 */
export interface EmergencyAlertProps {
  alerts: EmergencyAlert[];
  doctorContact: DoctorContact;
  onAcknowledge: (alertId: string) => void;
  onContactDoctor: (method: 'call' | 'email') => void;
}

/**
 * Dark Mode Toggle Props
 */
export interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * Chart Props
 */
export interface ChartProps {
  data: any; // Will be typed more specifically per chart type
  options?: any;
}

/**
 * Section Props
 */
export interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}
