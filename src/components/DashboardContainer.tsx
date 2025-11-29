// Dashboard Container Component
// Main component that orchestrates all dashboard sections

import React, { useState, useEffect } from 'react';
import { DashboardProps } from '../types/components';
import {
  LifeFitFinSyncScores,
  HealthMetrics,
  FitnessMetrics,
  FinanceMetrics,
  GrowthMetrics,
  EmergencyAlert,
  DoctorContact,
} from '../types';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { LifeFitFinSyncScoreSection } from './LifeFitFinSyncScoreSection';
import { DietHealthInsightsSection } from './DietHealthInsightsSection';
import { FitnessActivitySection } from './FitnessActivitySection';
import { PersonalDevelopmentSection } from './PersonalDevelopmentSection';
import { FinancialSyncSection } from './FinancialSyncSection';
import { TimePlanningSection } from './TimePlanningSection';
import { DarkModeToggle } from './DarkModeToggle';
import { calculateScores } from '../services/scoreCalculation';
import { checkHealthThresholds } from '../services/alertDetection';

export function DashboardContainer({ userId }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for demonstration (will be replaced with Supabase API calls)
  const [scores, setScores] = useState<LifeFitFinSyncScores>({
    userId,
    date: new Date().toISOString(),
    overallScore: 0,
    healthScore: 0,
    fitnessScore: 0,
    financeScore: 0,
    growthScore: 0,
    alertPenalty: 0,
  });

  const [healthData, setHealthData] = useState<HealthMetrics>({
    userId,
    date: new Date().toISOString(),
    meals: [
      { timestamp: new Date().toISOString(), description: 'Oatmeal with fruits', portions: 1, estimatedCalories: 350 },
      { timestamp: new Date().toISOString(), description: 'Grilled chicken salad', portions: 1, estimatedCalories: 450 },
      { timestamp: new Date().toISOString(), description: 'Salmon with vegetables', portions: 1, estimatedCalories: 550 },
    ],
    hydrationLiters: 2.5,
    sleepHours: 7.5,
    sleepQuality: 'good',
    weightKg: 70,
    caloriesEstimated: 2100,
    dietQualityScore: 85,
  });

  const [fitnessData, setFitnessData] = useState<FitnessMetrics>({
    userId,
    date: new Date().toISOString(),
    exercises: [
      { type: 'running', durationMinutes: 30, intensity: 'moderate', timestamp: new Date().toISOString() },
      { type: 'strength', durationMinutes: 45, intensity: 'high', timestamp: new Date().toISOString() },
    ],
    dailySteps: 8500,
    totalMinutes: 75,
    strengthSessions: 1,
    movementTarget: 10000,
    movementAchieved: 8500,
  });

  const [financeData, setFinanceData] = useState<FinanceMetrics>({
    userId,
    weekStart: new Date().toISOString(),
    grocerySpend: 120,
    takeoutSpend: 45,
    snackSpend: 20,
    supplementSpend: 30,
    homeCookedMeals: 15,
    purchasedMeals: 6,
    expiredItems: 2,
    totalItems: 30,
    previousWeekSpend: 250,
  });

  const [growthData, setGrowthData] = useState<GrowthMetrics>({
    userId,
    weekStart: new Date().toISOString(),
    studyBlocksCompleted: 12,
    studyBlocksPlanned: 15,
    revisionTasksCompleted: 8,
    revisionTasksPlanned: 10,
    practiceTasksCompleted: 5,
    practiceTasksPlanned: 8,
    subjects: ['Mathematics', 'Physics', 'Programming'],
  });

  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  const doctorContact: DoctorContact = {
    name: 'Dr. Sarah Johnson',
    phone: '+1-555-0123',
    email: 'dr.johnson@healthcare.com',
    specialty: 'General Practice',
  };

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Calculate scores
        const calculatedScores = calculateScores({
          userId,
          healthMetrics: healthData,
          fitnessMetrics: fitnessData,
          financeMetrics: financeData,
          growthMetrics: growthData,
          activeAlerts: 0,
        });

        setScores({
          userId,
          date: calculatedScores.calculatedAt,
          overallScore: calculatedScores.overallScore,
          healthScore: calculatedScores.healthScore,
          fitnessScore: calculatedScores.fitnessScore,
          financeScore: calculatedScores.financeScore,
          growthScore: calculatedScores.growthScore,
          alertPenalty: 0,
        });

        // Check for alerts
        const detectedAlerts = checkHealthThresholds(healthData);
        setAlerts(detectedAlerts);

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.alertId === alertId 
        ? { ...alert, acknowledgedAt: new Date().toISOString() }
        : alert
    ));
  };

  const handleContactDoctor = (method: 'call' | 'email') => {
    if (method === 'call') {
      window.location.href = `tel:${doctorContact.phone}`;
    } else {
      window.location.href = `mailto:${doctorContact.email}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state for new users
  if (!healthData.meals.length && !fitnessData.exercises.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to Kiro Fitfin AI! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your health, fitness, finance, and personal growth to see your dashboard.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-6 text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                How to get started:
              </h2>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li>1. Log your daily meals and hydration</li>
                <li>2. Track your exercise and movement</li>
                <li>3. Record your spending and meal planning</li>
                <li>4. Set study goals and track progress</li>
                <li>5. Watch your LifeFitFinSync scores improve!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Dark Mode Toggle */}
      <DarkModeToggle />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Kiro Fitfin AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your wellness dashboard for {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </header>

        {/* Emergency Alerts */}
        {alerts.length > 0 && (
          <EmergencyAlertBanner
            alerts={alerts}
            doctorContact={doctorContact}
            onAcknowledge={handleAcknowledgeAlert}
            onContactDoctor={handleContactDoctor}
          />
        )}

        {/* Dashboard Sections in Required Order */}
        <div className="space-y-6">
          {/* 1. LifeFitFinSync Score */}
          <LifeFitFinSyncScoreSection scores={scores} />

          {/* 2. Diet & Health Insights */}
          <DietHealthInsightsSection healthData={healthData} />

          {/* 3. Fitness & Activity Plan */}
          <FitnessActivitySection fitnessData={fitnessData} />

          {/* 4. Personal Development */}
          <PersonalDevelopmentSection growthData={growthData} />

          {/* 5. Financial Sync Report */}
          <FinancialSyncSection financeData={financeData} />

          {/* 6. Time Planning */}
          <TimePlanningSection />
        </div>
      </div>
    </div>
  );
}
