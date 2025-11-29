# Design Document

## Overview

The Dashboard with LifeFitFinSync Scoring System serves as the central hub of the Kiro Fitfin Agent application. It implements a React-based frontend that displays wellness metrics across four dimensions (Health, Fitness, Finance, Personal Growth) with a calculated composite score. The design emphasizes serverless architecture using AWS services, clear data visualization with Chart.js, and accessibility-first UI principles with dark mode support.

The system processes structured user input through data annotations, calculates dimensional scores using weighted algorithms, and presents information in a fixed six-section dashboard format. Emergency health alerts are prominently displayed with red visual indicators and direct doctor contact functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React App     │
│  (Vite + React) │
│                 │
│  - Dashboard    │
│  - Score Cards  │
│  - Charts       │
│  - Dark Mode    │
└────────┬────────┘
         │
         │ HTTPS/REST
         │
┌────────▼────────┐
│  API Gateway    │
│   (REST API)    │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│ Lambda Functions│
│   (Node.js)     │
│                 │
│ - Score Calc    │
│ - Data Parser   │
│ - Alert Logic   │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   DynamoDB      │
│                 │
│ - User Data     │
│ - Metrics       │
│ - Alerts        │
└─────────────────┘
```

### Component Layers

1. **Presentation Layer** (React Frontend)
   - Dashboard container component
   - Score display components
   - Chart visualization components
   - Dark mode context provider
   - Emergency alert banner

2. **API Layer** (API Gateway + Lambda)
   - `/dashboard` - GET endpoint for fetching all dashboard data
   - `/scores/calculate` - POST endpoint for score computation
   - `/data/parse` - POST endpoint for parsing annotated input
   - `/alerts/check` - GET endpoint for active emergency alerts

3. **Business Logic Layer** (Lambda Functions)
   - Score calculation engine
   - Data annotation parser
   - Threshold monitoring for alerts
   - Weighted average computation

4. **Data Layer** (DynamoDB)
   - User metrics table (partition key: userId, sort key: timestamp)
   - Scores table (partition key: userId, sort key: date)
   - Alerts table (partition key: userId, sort key: alertId)

## Components and Interfaces

### Frontend Components

#### DashboardContainer
```typescript
interface DashboardProps {
  userId: string;
}

interface DashboardState {
  scores: LifeFitFinSyncScores;
  healthData: HealthMetrics;
  fitnessData: FitnessMetrics;
  financeData: FinanceMetrics;
  growthData: GrowthMetrics;
  alerts: EmergencyAlert[];
  loading: boolean;
  error: string | null;
}

const DashboardContainer: React.FC<DashboardProps>
```

#### ScoreCard
```typescript
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const ScoreCard: React.FC<ScoreCardProps>
```

#### EmergencyAlertBanner
```typescript
interface EmergencyAlertProps {
  alerts: EmergencyAlert[];
  doctorContact: DoctorContact;
  onAcknowledge: (alertId: string) => void;
  onContactDoctor: (method: 'call' | 'email') => void;
}

const EmergencyAlertBanner: React.FC<EmergencyAlertProps>
```

#### DarkModeToggle
```typescript
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps>
```

### Backend Interfaces

#### Score Calculation Service
```typescript
interface ScoreCalculationInput {
  userId: string;
  healthMetrics?: HealthMetrics;
  fitnessMetrics?: FitnessMetrics;
  financeMetrics?: FinanceMetrics;
  growthMetrics?: GrowthMetrics;
  activeAlerts: number;
}

interface ScoreCalculationOutput {
  overallScore: number;
  healthScore: number;
  fitnessScore: number;
  financeScore: number;
  growthScore: number;
  calculatedAt: string;
}

function calculateScores(input: ScoreCalculationInput): ScoreCalculationOutput
```

#### Data Parser Service
```typescript
interface ParsedData {
  dailyMeals?: MealData[];
  exerciseMinutes?: ExerciseData[];
  jobSchedule?: ScheduleData;
  studyGoals?: StudyData;
  weeklyExpenses?: ExpenseData;
}

function parseAnnotatedInput(rawInput: string): ParsedData
```

## Data Models

### LifeFitFinSyncScores
```typescript
interface LifeFitFinSyncScores {
  userId: string;
  date: string;
  overallScore: number;
  healthScore: number;
  fitnessScore: number;
  financeScore: number;
  growthScore: number;
  alertPenalty: number;
}
```

### HealthMetrics
```typescript
interface HealthMetrics {
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

interface MealEntry {
  timestamp: string;
  description: string;
  portions: number;
  estimatedCalories: number;
}
```

### FitnessMetrics
```typescript
interface FitnessMetrics {
  userId: string;
  date: string;
  exercises: ExerciseEntry[];
  dailySteps: number;
  totalMinutes: number;
  strengthSessions: number;
  movementTarget: number;
  movementAchieved: number;
}

interface ExerciseEntry {
  type: string;
  durationMinutes: number;
  intensity: 'low' | 'moderate' | 'high';
  timestamp: string;
}
```

### FinanceMetrics
```typescript
interface FinanceMetrics {
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
```

### GrowthMetrics
```typescript
interface GrowthMetrics {
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
```

### EmergencyAlert
```typescript
interface EmergencyAlert {
  alertId: string;
  userId: string;
  type: 'weight_change' | 'calorie_extreme' | 'dehydration' | 'sleep_deprivation';
  severity: 'warning' | 'critical';
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolved: boolean;
}
```

### DoctorContact
```typescript
interface DoctorContact {
  name: string;
  phone: string;
  email: string;
  specialty?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Score bounds invariant
*For any* calculated score (overall or sub-score), the value SHALL be between 0 and 100 inclusive.
**Validates: Requirements 1.2, 2.3**

### Property 2: Dashboard section ordering
*For any* dashboard render, the six sections SHALL appear in the following order: LifeFitFinSync Score, Diet & Health Insights, Fitness & Activity Plan, Personal Development, Financial Sync Report, Time Planning.
**Validates: Requirements 1.1**

### Property 3: Accessibility icon-label pairing
*For any* metric display, both an icon and a text label SHALL be present together.
**Validates: Requirements 1.4**

### Property 4: Weighted average calculation
*For any* set of available sub-scores, the overall LifeFitFinSync score SHALL equal the weighted average of those sub-scores, excluding unavailable dimensions.
**Validates: Requirements 2.1, 2.5**

### Property 5: Alert penalty application
*For any* score calculation with active emergency alerts, the overall score SHALL be lower than the same calculation without alerts.
**Validates: Requirements 2.2**

### Property 6: Complete score display
*For any* dashboard render with score data, all five scores (overall, health, fitness, finance, growth) SHALL be displayed with their numerical values.
**Validates: Requirements 2.4**

### Property 7: Health score incorporates diet quality
*For any* two sets of meal data with different diet quality, the health scores SHALL differ, with higher quality meals producing higher scores.
**Validates: Requirements 3.1**

### Property 8: Health score incorporates hydration
*For any* two hydration levels, the health score SHALL reflect the difference, with adequate hydration producing higher scores than inadequate hydration.
**Validates: Requirements 3.2**

### Property 9: Health score incorporates sleep when available
*For any* health metrics with sleep data, the health score SHALL differ from the same metrics without sleep data.
**Validates: Requirements 3.3**

### Property 10: Health score incorporates weight trends
*For any* health metrics with weight trend data, the health score SHALL reflect weight change patterns.
**Validates: Requirements 3.4**

### Property 11: Threshold breach triggers alert
*For any* health metric that exceeds defined safe thresholds, an emergency alert SHALL be triggered.
**Validates: Requirements 3.5**

### Property 12: Fitness score incorporates movement
*For any* two movement achievement levels, the fitness score SHALL reflect the difference, with higher achievement producing higher scores.
**Validates: Requirements 4.1**

### Property 13: Fitness score incorporates exercise duration
*For any* two sets of exercise data with different total minutes, the fitness scores SHALL differ, with more exercise producing higher scores.
**Validates: Requirements 4.2**

### Property 14: Fitness score incorporates strength training
*For any* fitness metrics with strength training sessions, the fitness score SHALL be higher than the same metrics without strength training.
**Validates: Requirements 4.3**

### Property 15: Multi-day exercise averaging
*For any* exercise data spanning multiple days, the fitness score SHALL be based on the average daily activity level.
**Validates: Requirements 4.4**

### Property 16: Finance score incorporates meal source ratio
*For any* two meal source ratios (home-cooked vs purchased), the finance scores SHALL differ, with higher home-cooked percentages producing higher scores.
**Validates: Requirements 5.1**

### Property 17: Finance score incorporates waste rate
*For any* two food waste rates, the finance scores SHALL differ, with lower waste rates producing higher scores.
**Validates: Requirements 5.2**

### Property 18: Finance score incorporates spending trends
*For any* spending data showing reduction compared to previous periods, the finance score SHALL be higher than data showing increased spending.
**Validates: Requirements 5.3**

### Property 19: Expense parsing separates categories
*For any* annotated expense data with `{{weekly_expenses}}`, the parser SHALL extract grocery, takeout, snack, and supplement spending as separate values.
**Validates: Requirements 5.4**

### Property 20: Growth score incorporates study completion
*For any* two study completion levels, the growth scores SHALL differ, with higher completion producing higher scores.
**Validates: Requirements 6.1**

### Property 21: Growth score incorporates revision adherence
*For any* two revision adherence levels, the growth scores SHALL differ, with higher adherence producing higher scores.
**Validates: Requirements 6.2**

### Property 22: Growth score incorporates practice tasks
*For any* two practice task completion levels, the growth scores SHALL differ, with higher completion producing higher scores.
**Validates: Requirements 6.3**

### Property 23: Study progress comparison
*For any* study metrics with defined goals, the growth score SHALL reflect the ratio of actual progress to planned study blocks.
**Validates: Requirements 6.4**

### Property 24: Dark mode toggle round-trip
*For any* theme state, toggling dark mode twice SHALL return to the original theme state.
**Validates: Requirements 7.1, 7.2**

### Property 25: Theme persistence
*For any* theme preference set by a user, reloading the session SHALL restore the same theme preference.
**Validates: Requirements 7.3**

### Property 26: Dark mode contrast compliance
*For any* text and background color combination in dark mode, the contrast ratio SHALL meet WCAG AA standards (minimum 4.5:1 for normal text).
**Validates: Requirements 7.4**

### Property 27: Red color exclusivity
*For any* UI element in the dashboard, red color SHALL only be used for emergency alert contexts.
**Validates: Requirements 7.5, 9.5**

### Property 28: Meal annotation parsing
*For any* input with `{{daily_meals}}` annotation, the parser SHALL extract meals, portions, and drinks for the specified date range.
**Validates: Requirements 8.1**

### Property 29: Exercise annotation parsing
*For any* input with `{{exercise_minutes}}` annotation, the parser SHALL extract exercise type, duration, and steps per day.
**Validates: Requirements 8.2**

### Property 30: Schedule annotation parsing
*For any* input with `{{job_schedule}}` annotation, the parser SHALL extract work hours, commute time, and preferred workout times.
**Validates: Requirements 8.3**

### Property 31: Study annotation parsing
*For any* input with `{{study_goals}}` annotation, the parser SHALL extract subjects, exam dates, and weak topics.
**Validates: Requirements 8.4**

### Property 32: Expense annotation parsing
*For any* input with `{{weekly_expenses}}` annotation, the parser SHALL extract groceries, takeout, snacks, and supplement costs.
**Validates: Requirements 8.5**

### Property 33: Emergency banner display on threshold breach
*For any* health data with threshold breaches, a red emergency banner SHALL be displayed at the top of the dashboard.
**Validates: Requirements 9.1**

### Property 34: Doctor contact card with active alerts
*For any* dashboard state with active emergency alerts, a doctor contact card SHALL be displayed with name, phone, and email.
**Validates: Requirements 9.2**

### Property 35: Contact doctor button availability
*For any* displayed emergency alert, a "Contact Doctor Now" button SHALL be present with call and email functionality.
**Validates: Requirements 9.3**

### Property 36: Alert acknowledgment timestamp
*For any* emergency alert that is acknowledged, the system SHALL record a timestamp of the acknowledgment.
**Validates: Requirements 9.4**

### Property 37: Mobile layout vertical stacking
*For any* dashboard viewed at mobile viewport width, sections SHALL be stacked vertically with full-width components.
**Validates: Requirements 10.1**

### Property 38: Tablet layout two-column arrangement
*For any* dashboard viewed at tablet viewport width, sections SHALL be arranged in a two-column layout where appropriate.
**Validates: Requirements 10.2**

### Property 39: Desktop layout multi-column utilization
*For any* dashboard viewed at desktop viewport width, the layout SHALL utilize available horizontal space with multi-column arrangements.
**Validates: Requirements 10.3**

### Property 40: Dynamic layout adjustment
*For any* viewport size change, the dashboard layout SHALL adjust without requiring a page reload.
**Validates: Requirements 10.4**

### Property 41: Chart proportional scaling
*For any* chart displayed at different viewport sizes, the chart SHALL scale proportionally to maintain readability.
**Validates: Requirements 10.5**



## Error Handling

### Frontend Error Handling

1. **API Request Failures**
   - Display user-friendly error messages when API calls fail
   - Implement retry logic with exponential backoff for transient failures
   - Show offline indicator when network connectivity is lost
   - Cache last successful dashboard data for offline viewing

2. **Data Parsing Errors**
   - Validate annotated input format before sending to backend
   - Display specific error messages indicating which annotation failed to parse
   - Provide examples of correct annotation syntax
   - Allow partial data submission (process valid annotations, report invalid ones)

3. **Score Calculation Errors**
   - Handle division by zero when calculating averages with no data
   - Validate score inputs are within expected ranges
   - Log calculation errors to monitoring service
   - Display fallback UI when scores cannot be calculated

4. **Chart Rendering Errors**
   - Gracefully handle missing or malformed chart data
   - Display "No data available" message instead of broken charts
   - Catch and log Chart.js rendering exceptions
   - Provide text-based data summary as fallback

### Backend Error Handling

1. **Lambda Function Errors**
   - Implement try-catch blocks around all business logic
   - Return structured error responses with error codes and messages
   - Log errors to CloudWatch with context (userId, timestamp, input data)
   - Set up CloudWatch alarms for error rate thresholds

2. **DynamoDB Errors**
   - Handle ProvisionedThroughputExceededException with retry logic
   - Validate data before write operations
   - Implement conditional writes to prevent data corruption
   - Handle item not found scenarios gracefully

3. **Input Validation Errors**
   - Validate all API inputs against expected schemas
   - Return 400 Bad Request with detailed validation errors
   - Sanitize user input to prevent injection attacks
   - Enforce rate limiting to prevent abuse

4. **Emergency Alert Errors**
   - Ensure alert generation failures don't block score calculation
   - Implement fallback notification methods if SNS fails
   - Log all alert generation attempts for audit trail
   - Validate doctor contact information before displaying

## Testing Strategy

### Unit Testing

**Frontend Unit Tests (React Testing Library + Vitest)**
- Component rendering tests for all dashboard components
- Score display formatting tests
- Dark mode toggle functionality tests
- Emergency alert banner display tests
- Data parsing validation tests
- Responsive layout breakpoint tests

**Backend Unit Tests (Jest)**
- Score calculation algorithm tests with known inputs/outputs
- Data annotation parser tests with various input formats
- Threshold detection logic tests
- Weighted average computation tests
- DynamoDB query/write operation tests (with mocked DynamoDB)

### Property-Based Testing

**Property-Based Testing Framework: fast-check (JavaScript/TypeScript)**

Property-based tests will be configured to run a minimum of 100 iterations per property to ensure comprehensive coverage across the input space.

Each property-based test MUST be tagged with a comment explicitly referencing the correctness property from this design document using the format:
`// Feature: dashboard-scoring, Property {number}: {property_text}`

Each correctness property MUST be implemented by a SINGLE property-based test.

**Key Property Tests:**
- Score bounds validation across all calculation scenarios
- Weighted average correctness with various sub-score combinations
- Alert penalty application consistency
- Annotation parsing round-trip tests (generate data → format → parse → verify equality)
- Theme toggle idempotence
- Responsive layout behavior across viewport ranges
- Color usage constraints (red exclusivity)
- Accessibility compliance (contrast ratios)

**Generator Strategies:**
- Generate random but valid score inputs (0-100 range)
- Generate random health metrics (meals, hydration, sleep, weight)
- Generate random fitness data (exercises, steps, duration)
- Generate random financial data (expenses, meal counts, waste rates)
- Generate random study data (blocks, tasks, adherence percentages)
- Generate random viewport dimensions for responsive tests
- Generate edge cases (empty data, maximum values, boundary conditions)

### Integration Testing

- End-to-end dashboard load test (API → Lambda → DynamoDB → Frontend)
- Authentication flow integration with Cognito
- Emergency alert flow from threshold detection to UI display
- Dark mode persistence across sessions
- Multi-device responsive layout verification

### Accessibility Testing

- WCAG AA compliance verification using axe-core
- Keyboard navigation testing
- Screen reader compatibility testing
- Color contrast validation in both light and dark modes
- Focus management testing

## Performance Considerations

### Frontend Performance

1. **Code Splitting**
   - Lazy load chart components
   - Split dashboard sections into separate chunks
   - Use React.lazy() for route-based code splitting

2. **Rendering Optimization**
   - Memoize expensive score calculations with useMemo
   - Use React.memo for pure components
   - Implement virtual scrolling for large data lists
   - Debounce viewport resize handlers

3. **Asset Optimization**
   - Compress and optimize images
   - Use SVG for icons
   - Minimize CSS and JavaScript bundles
   - Implement service worker for caching

### Backend Performance

1. **Lambda Optimization**
   - Keep Lambda functions warm with scheduled pings
   - Minimize cold start time by reducing package size
   - Use Lambda layers for shared dependencies
   - Set appropriate memory allocation (1024MB recommended)

2. **DynamoDB Optimization**
   - Design efficient partition key strategy (userId)
   - Use sort keys for time-based queries
   - Implement DynamoDB Streams for real-time updates
   - Enable DAX caching for frequently accessed data

3. **API Gateway Optimization**
   - Enable API Gateway caching for GET requests
   - Implement request throttling and rate limiting
   - Use compression for response payloads
   - Set appropriate timeout values

## Security Considerations

1. **Authentication & Authorization**
   - All API endpoints protected by Cognito authorizer
   - JWT token validation on every request
   - Implement token refresh mechanism
   - Enforce principle of least privilege for IAM roles

2. **Data Protection**
   - Encrypt data at rest in DynamoDB
   - Use HTTPS/TLS for all data in transit
   - Sanitize all user inputs to prevent XSS attacks
   - Implement CORS policies to restrict API access

3. **Privacy**
   - Store only necessary health data
   - Implement data retention policies
   - Provide user data export functionality
   - Allow users to delete their data

4. **Monitoring & Auditing**
   - Log all API access attempts
   - Monitor for unusual access patterns
   - Set up CloudWatch alarms for security events
   - Implement audit trail for emergency alert acknowledgments

## Deployment Strategy

1. **Frontend Deployment**
   - Build React app with `npm run build`
   - Upload dist/ folder to S3 bucket
   - Configure S3 for static website hosting
   - Set up CloudFront distribution for CDN
   - Invalidate CloudFront cache after deployment

2. **Backend Deployment**
   - Package Lambda functions with dependencies
   - Deploy using AWS SAM or Serverless Framework
   - Configure API Gateway endpoints
   - Set up Cognito User Pool and App Client
   - Create DynamoDB tables with appropriate indexes

3. **Environment Configuration**
   - Separate dev, staging, and production environments
   - Use environment-specific configuration files
   - Store secrets in AWS Secrets Manager
   - Configure CloudWatch logging for all environments

4. **CI/CD Pipeline**
   - Automated testing on pull requests
   - Automated deployment to staging on merge to main
   - Manual approval gate for production deployment
   - Automated rollback on deployment failures
