# Implementation Plan

- [x] 1. Set up project structure and dependencies



  - Initialize React project with Vite
  - Install core dependencies: React, Tailwind CSS, Chart.js, React Router
  - Install testing dependencies: Vitest, React Testing Library, fast-check
  - Configure Tailwind CSS with dark mode support
  - Set up environment variables structure (.env.example)



  - _Requirements: 1.1, 7.1_

- [ ] 2. Create data models and TypeScript interfaces
  - Define LifeFitFinSyncScores interface
  - Define HealthMetrics and MealEntry interfaces
  - Define FitnessMetrics and ExerciseEntry interfaces
  - Define FinanceMetrics interface
  - Define GrowthMetrics interface





  - Define EmergencyAlert and DoctorContact interfaces
  - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 9.1_

- [ ] 2.1 Write property test for score bounds
  - **Property 1: Score bounds invariant**
  - **Validates: Requirements 1.2, 2.3**

- [ ] 3. Implement score calculation engine
  - Create calculateHealthScore function with diet, hydration, sleep, weight inputs


  - Create calculateFitnessScore function with movement, exercise, strength inputs
  - Create calculateFinanceScore function with meal ratio, waste, spending inputs


  - Create calculateGrowthScore function with study blocks, revision, practice inputs
  - Create calculateOverallScore function with weighted average logic


  - Implement alert penalty application in overall score
  - Handle missing dimension data in weighted average

  - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4_

- [x] 3.1 Write property test for weighted average calculation

  - **Property 4: Weighted average calculation**
  - **Validates: Requirements 2.1, 2.5**


- [ ] 3.2 Write property test for alert penalty
  - **Property 5: Alert penalty application**
  - **Validates: Requirements 2.2**


- [ ] 3.3 Write property test for health score incorporates diet
  - **Property 7: Health score incorporates diet quality**

  - **Validates: Requirements 3.1**

- [x] 3.4 Write property test for health score incorporates hydration

  - **Property 8: Health score incorporates hydration**



  - **Validates: Requirements 3.2**

- [ ] 3.5 Write property test for health score incorporates sleep
  - **Property 9: Health score incorporates sleep when available**
  - **Validates: Requirements 3.3**

- [ ] 3.6 Write property test for fitness score incorporates movement
  - **Property 12: Fitness score incorporates movement**
  - **Validates: Requirements 4.1**



- [x] 3.7 Write property test for fitness score incorporates exercise duration

  - **Property 13: Fitness score incorporates exercise duration**
  - **Validates: Requirements 4.2**


- [x] 3.8 Write property test for finance score incorporates meal ratio



  - **Property 16: Finance score incorporates meal source ratio**
  - **Validates: Requirements 5.1**

- [ ] 3.9 Write property test for growth score incorporates study completion
  - **Property 20: Growth score incorporates study completion**
  - **Validates: Requirements 6.1**




- [ ] 4. Implement data annotation parser
  - Create parseAnnotatedInput function to extract annotation blocks
  - Implement parseDailyMeals for {{daily_meals}} annotation
  - Implement parseExerciseMinutes for {{exercise_minutes}} annotation
  - Implement parseJobSchedule for {{job_schedule}} annotation
  - Implement parseStudyGoals for {{study_goals}} annotation
  - Implement parseWeeklyExpenses for {{weekly_expenses}} annotation
  - Add input validation and error handling for malformed annotations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 4.1 Write property test for meal annotation parsing
  - **Property 28: Meal annotation parsing**
  - **Validates: Requirements 8.1**

- [ ] 4.2 Write property test for exercise annotation parsing
  - **Property 29: Exercise annotation parsing**
  - **Validates: Requirements 8.2**

- [ ] 4.3 Write property test for expense annotation parsing
  - **Property 32: Expense annotation parsing**
  - **Validates: Requirements 8.5**

- [ ] 5. Implement emergency alert detection
  - Create threshold constants for health metrics (weight change, calories, hydration, sleep)
  - Implement checkHealthThresholds function
  - Create generateEmergencyAlert function
  - Implement alert severity classification logic
  - _Requirements: 3.5, 9.1_

- [ ] 5.1 Write property test for threshold breach triggers alert
  - **Property 11: Threshold breach triggers alert**
  - **Validates: Requirements 3.5**

- [x] 6. Create dark mode context and provider


  - Create DarkModeContext with React Context API
  - Implement useDarkMode hook
  - Add theme persistence to localStorage
  - Create theme toggle logic
  - Configure Tailwind dark mode class strategy
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 6.1 Write property test for dark mode toggle round-trip


  - **Property 24: Dark mode toggle round-trip**
  - **Validates: Requirements 7.1, 7.2**


- [ ] 6.2 Write property test for theme persistence
  - **Property 25: Theme persistence**
  - **Validates: Requirements 7.3**

- [x] 7. Build ScoreCard component



  - Create ScoreCard component with props for title, score, icon, trend
  - Implement score display with /100 format
  - Add trend indicator (up/down/stable) with icons
  - Style with Tailwind CSS for light and dark modes
  - Ensure WCAG AA contrast compliance
  - _Requirements: 2.4, 7.4_

- [x] 7.1 Write property test for complete score display


  - **Property 6: Complete score display**
  - **Validates: Requirements 2.4**


- [ ] 7.2 Write property test for accessibility icon-label pairing
  - **Property 3: Accessibility icon-label pairing**
  - **Validates: Requirements 1.4**

- [x] 8. Build EmergencyAlertBanner component



  - Create EmergencyAlertBanner component with red styling
  - Display alert messages with severity indicators
  - Add doctor contact card with name, phone, email
  - Implement "Contact Doctor Now" button with call/email actions
  - Add alert acknowledgment functionality
  - Ensure red color is used exclusively for alerts
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_



- [ ] 8.1 Write property test for emergency banner display
  - **Property 33: Emergency banner display on threshold breach**

  - **Validates: Requirements 9.1**

- [x] 8.2 Write property test for doctor contact card

  - **Property 34: Doctor contact card with active alerts**



  - **Validates: Requirements 9.2**

- [ ] 8.3 Write property test for red color exclusivity
  - **Property 27: Red color exclusivity**
  - **Validates: Requirements 7.5, 9.5**

- [ ] 9. Build dashboard section components
  - Create LifeFitFinSyncScoreSection component (displays 5 score cards)





  - Create DietHealthInsightsSection component (meals, hydration, sleep, weight prediction)
  - Create FitnessActivitySection component (movement target, exercise plan, motivation)
  - Create PersonalDevelopmentSection component (study blocks, revision, practice tasks)
  - Create FinancialSyncSection component (spending breakdown, savings target, meal planning)
  - Create TimePlanningSection component (job-schedule-aware routine display)
  - _Requirements: 1.1, 2.4, 3.1, 4.1, 5.1, 6.1_

- [x] 9.1 Write property test for dashboard section ordering




  - **Property 2: Dashboard section ordering**
  - **Validates: Requirements 1.1**

- [ ] 10. Implement chart components with Chart.js
  - Create HealthTrendChart component (weight, calories over time)
  - Create FitnessActivityChart component (weekly exercise minutes)
  - Create FinanceSpendingChart component (spending categories breakdown)
  - Create StudyProgressChart component (study blocks completion heatmap)
  - Add responsive chart sizing logic
  - Handle empty data states with "No data available" message
  - _Requirements: 1.1, 10.5_

- [ ] 10.1 Write property test for chart proportional scaling
  - **Property 41: Chart proportional scaling**
  - **Validates: Requirements 10.5**

- [ ] 11. Build main DashboardContainer component
  - Create DashboardContainer with state management for all metrics
  - Implement data fetching logic (placeholder for API integration)
  - Add loading and error states
  - Integrate all section components in correct order
  - Add empty state with guidance for new users
  - Wire up dark mode context


  - _Requirements: 1.1, 1.3, 1.5_


- [ ] 12. Implement responsive layout with Tailwind
  - Configure mobile breakpoint styles (vertical stacking, full-width)
  - Configure tablet breakpoint styles (two-column layout)
  - Configure desktop breakpoint styles (multi-column layout)
  - Add viewport resize handling without page reload
  - Test layout at various breakpoints
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 12.1 Write property test for mobile layout
  - **Property 37: Mobile layout vertical stacking**
  - **Validates: Requirements 10.1**

- [ ] 12.2 Write property test for dynamic layout adjustment
  - **Property 40: Dynamic layout adjustment**
  - **Validates: Requirements 10.4**

- [ ] 13. Create DarkModeToggle component
  - Build toggle button component with sun/moon icons
  - Position in top-right corner of dashboard
  - Connect to dark mode context
  - Add smooth transition animations
  - Ensure accessibility (keyboard navigation, ARIA labels)
  - _Requirements: 7.1, 7.2_

- [ ] 14. Implement error handling and validation
  - Add try-catch blocks around score calculations
  - Implement input validation for annotation parsing
  - Create user-friendly error messages
  - Add error boundary component for React errors
  - Handle API request failures gracefully
  - _Requirements: All_

- [ ] 15. Set up AWS Lambda backend functions
  - Create Lambda function for /dashboard endpoint
  - Create Lambda function for /scores/calculate endpoint
  - Create Lambda function for /data/parse endpoint
  - Create Lambda function for /alerts/check endpoint
  - Implement Cognito authorizer integration
  - Add CloudWatch logging
  - _Requirements: All backend requirements_

- [ ] 16. Set up DynamoDB tables
  - Create UserMetrics table (partition: userId, sort: timestamp)
  - Create Scores table (partition: userId, sort: date)
  - Create Alerts table (partition: userId, sort: alertId)
  - Configure indexes for efficient queries
  - Set up DynamoDB Streams for real-time updates
  - _Requirements: All data persistence requirements_

- [ ] 17. Configure API Gateway
  - Create REST API in API Gateway
  - Configure endpoints: /dashboard, /scores/calculate, /data/parse, /alerts/check
  - Set up Cognito authorizer
  - Enable CORS
  - Configure request/response models
  - Set up API Gateway caching
  - _Requirements: All API requirements_

- [ ] 18. Integrate frontend with backend API
  - Create API client service with axios or fetch
  - Implement authentication token handling
  - Connect DashboardContainer to /dashboard endpoint
  - Connect score calculations to /scores/calculate endpoint
  - Connect data parsing to /data/parse endpoint
  - Connect alert checking to /alerts/check endpoint
  - Add request retry logic with exponential backoff
  - _Requirements: All integration requirements_

- [ ] 19. Implement accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout dashboard
  - Test with screen readers
  - Verify WCAG AA color contrast in both themes
  - Add focus indicators for keyboard navigation
  - _Requirements: 1.4, 7.4_

- [ ] 19.1 Write property test for dark mode contrast compliance
  - **Property 26: Dark mode contrast compliance**
  - **Validates: Requirements 7.4**

- [ ] 20. Set up deployment pipeline
  - Configure S3 bucket for static hosting
  - Set up CloudFront distribution
  - Create deployment script for frontend
  - Configure AWS SAM or Serverless Framework for backend
  - Set up environment-specific configurations
  - Create CI/CD pipeline with GitHub Actions or CodePipeline
  - _Requirements: Deployment requirements_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
