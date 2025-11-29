// Data Annotation Parser for Kiro Fitfin Agent
// Parses structured user input with {{annotation}} syntax

import {
  ParsedData,
  MealData,
  ExerciseData,
  ScheduleData,
  StudyData,
  ExpenseData,
  MealEntry,
} from '../types';

/**
 * Extract annotation blocks from raw input
 */
function extractAnnotation(rawInput: string, annotationName: string): string | null {
  const regex = new RegExp(`\\{\\{${annotationName}\\}\\}([\\s\\S]*?)(?=\\{\\{|$)`, 'i');
  const match = rawInput.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Parse {{daily_meals}} annotation
 * Format: Date: YYYY-MM-DD, Meal: description, Portions: N, Calories: N
 */
export function parseDailyMeals(annotationContent: string): MealData[] {
  const mealDataList: MealData[] = [];
  const lines = annotationContent.split('\n').filter(line => line.trim());

  let currentDate = '';
  let currentMeals: MealEntry[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for date line
    const dateMatch = trimmedLine.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
    if (dateMatch) {
      // Save previous date's meals if any
      if (currentDate && currentMeals.length > 0) {
        mealDataList.push({ date: currentDate, meals: [...currentMeals] });
        currentMeals = [];
      }
      currentDate = dateMatch[1];
      continue;
    }

    // Parse meal entry
    const mealMatch = trimmedLine.match(/Meal:\s*([^,]+),\s*Portions:\s*(\d+),\s*Calories:\s*(\d+)/i);
    if (mealMatch && currentDate) {
      const meal: MealEntry = {
        timestamp: new Date(currentDate).toISOString(),
        description: mealMatch[1].trim(),
        portions: parseInt(mealMatch[2]),
        estimatedCalories: parseInt(mealMatch[3]),
      };
      currentMeals.push(meal);
    }
  }

  // Save last date's meals
  if (currentDate && currentMeals.length > 0) {
    mealDataList.push({ date: currentDate, meals: currentMeals });
  }

  return mealDataList;
}

/**
 * Parse {{exercise_minutes}} annotation
 * Format: Date: YYYY-MM-DD, Type: exercise_type, Duration: N minutes, Steps: N
 */
export function parseExerciseMinutes(annotationContent: string): ExerciseData[] {
  const exerciseDataList: ExerciseData[] = [];
  const lines = annotationContent.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Parse exercise entry
    const exerciseMatch = trimmedLine.match(
      /Date:\s*(\d{4}-\d{2}-\d{2}),\s*Type:\s*([^,]+),\s*Duration:\s*(\d+)\s*minutes?,\s*Steps:\s*(\d+)/i
    );

    if (exerciseMatch) {
      const exerciseData: ExerciseData = {
        date: exerciseMatch[1],
        type: exerciseMatch[2].trim(),
        durationMinutes: parseInt(exerciseMatch[3]),
        steps: parseInt(exerciseMatch[4]),
      };
      exerciseDataList.push(exerciseData);
    }
  }

  return exerciseDataList;
}

/**
 * Parse {{job_schedule}} annotation
 * Format: Work Hours: HH:MM-HH:MM, Commute: N minutes, Preferred Workout: time1, time2
 */
export function parseJobSchedule(annotationContent: string): ScheduleData | null {
  const lines = annotationContent.split('\n').filter(line => line.trim());

  let workHours = '';
  let commuteMinutes = 0;
  let preferredWorkoutTimes: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Parse work hours
    const workHoursMatch = trimmedLine.match(/Work Hours:\s*([0-9:]+\s*-\s*[0-9:]+)/i);
    if (workHoursMatch) {
      workHours = workHoursMatch[1].trim();
    }

    // Parse commute
    const commuteMatch = trimmedLine.match(/Commute:\s*(\d+)\s*minutes?/i);
    if (commuteMatch) {
      commuteMinutes = parseInt(commuteMatch[1]);
    }

    // Parse preferred workout times
    const workoutMatch = trimmedLine.match(/Preferred Workout:\s*(.+)/i);
    if (workoutMatch) {
      preferredWorkoutTimes = workoutMatch[1].split(',').map(t => t.trim());
    }
  }

  if (workHours) {
    return {
      workHours,
      commuteMinutes,
      preferredWorkoutTimes,
    };
  }

  return null;
}

/**
 * Parse {{study_goals}} annotation
 * Format: Subjects: subject1, subject2; Exam Date: YYYY-MM-DD; Weak Topics: topic1, topic2
 */
export function parseStudyGoals(annotationContent: string): StudyData | null {
  const lines = annotationContent.split('\n').filter(line => line.trim());

  let subjects: string[] = [];
  let examDate: string | undefined;
  let weakTopics: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Parse subjects
    const subjectsMatch = trimmedLine.match(/Subjects:\s*([^;]+)/i);
    if (subjectsMatch) {
      subjects = subjectsMatch[1].split(',').map(s => s.trim());
    }

    // Parse exam date
    const examMatch = trimmedLine.match(/Exam Date:\s*(\d{4}-\d{2}-\d{2})/i);
    if (examMatch) {
      examDate = examMatch[1];
    }

    // Parse weak topics
    const topicsMatch = trimmedLine.match(/Weak Topics:\s*(.+)/i);
    if (topicsMatch) {
      weakTopics = topicsMatch[1].split(',').map(t => t.trim());
    }
  }

  if (subjects.length > 0) {
    return {
      subjects,
      examDate,
      weakTopics,
    };
  }

  return null;
}

/**
 * Parse {{weekly_expenses}} annotation
 * Format: Groceries: $N, Takeout: $N, Snacks: $N, Supplements: $N
 */
export function parseWeeklyExpenses(annotationContent: string): ExpenseData | null {
  const lines = annotationContent.split('\n').filter(line => line.trim());

  let groceries = 0;
  let takeout = 0;
  let snacks = 0;
  let supplements = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Parse groceries
    const groceriesMatch = trimmedLine.match(/Groceries:\s*\$?(\d+(?:\.\d+)?)/i);
    if (groceriesMatch) {
      groceries = parseFloat(groceriesMatch[1]);
    }

    // Parse takeout
    const takeoutMatch = trimmedLine.match(/Takeout:\s*\$?(\d+(?:\.\d+)?)/i);
    if (takeoutMatch) {
      takeout = parseFloat(takeoutMatch[1]);
    }

    // Parse snacks
    const snacksMatch = trimmedLine.match(/Snacks:\s*\$?(\d+(?:\.\d+)?)/i);
    if (snacksMatch) {
      snacks = parseFloat(snacksMatch[1]);
    }

    // Parse supplements
    const supplementsMatch = trimmedLine.match(/Supplements:\s*\$?(\d+(?:\.\d+)?)/i);
    if (supplementsMatch) {
      supplements = parseFloat(supplementsMatch[1]);
    }
  }

  return {
    groceries,
    takeout,
    snacks,
    supplements,
  };
}

/**
 * Main parser function that extracts and parses all annotations
 */
export function parseAnnotatedInput(rawInput: string): ParsedData {
  const parsed: ParsedData = {};

  // Extract and parse each annotation type
  const dailyMealsContent = extractAnnotation(rawInput, 'daily_meals');
  if (dailyMealsContent) {
    try {
      parsed.dailyMeals = parseDailyMeals(dailyMealsContent);
    } catch (error) {
      console.error('Error parsing daily_meals:', error);
    }
  }

  const exerciseContent = extractAnnotation(rawInput, 'exercise_minutes');
  if (exerciseContent) {
    try {
      parsed.exerciseMinutes = parseExerciseMinutes(exerciseContent);
    } catch (error) {
      console.error('Error parsing exercise_minutes:', error);
    }
  }

  const scheduleContent = extractAnnotation(rawInput, 'job_schedule');
  if (scheduleContent) {
    try {
      const schedule = parseJobSchedule(scheduleContent);
      if (schedule) parsed.jobSchedule = schedule;
    } catch (error) {
      console.error('Error parsing job_schedule:', error);
    }
  }

  const studyContent = extractAnnotation(rawInput, 'study_goals');
  if (studyContent) {
    try {
      const study = parseStudyGoals(studyContent);
      if (study) parsed.studyGoals = study;
    } catch (error) {
      console.error('Error parsing study_goals:', error);
    }
  }

  const expensesContent = extractAnnotation(rawInput, 'weekly_expenses');
  if (expensesContent) {
    try {
      const expenses = parseWeeklyExpenses(expensesContent);
      if (expenses) parsed.weeklyExpenses = expenses;
    } catch (error) {
      console.error('Error parsing weekly_expenses:', error);
    }
  }

  return parsed;
}
