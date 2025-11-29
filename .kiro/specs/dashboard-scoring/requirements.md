# Requirements Document

## Introduction

The Dashboard with LifeFitFinSync Scoring System is the central interface of the Kiro Fitfin Agent. It provides users with a unified view of their health, fitness, finance, and personal growth metrics through a structured dashboard format with calculated scores. The system emphasizes clarity, discipline tracking, and actionable insights presented in a calm, mentor-style tone.

## Glossary

- **Dashboard**: The main user interface displaying all LifeFitFinSync metrics and insights
- **LifeFitFinSync Score**: A composite score (0-100) representing overall wellness across four dimensions
- **Health Score**: Sub-score (0-100) based on diet quality, hydration, sleep, and weight trends
- **Fitness Score**: Sub-score (0-100) based on daily movement, weekly exercise minutes, and strength training
- **Finance Score**: Sub-score (0-100) based on home-cooked meal percentage, food waste rate, and spending reduction
- **Personal Growth Score**: Sub-score (0-100) based on study blocks completed, revision adherence, and practice tasks
- **Emergency Alert**: A red-colored notification triggered when health thresholds are breached
- **Dark Mode**: A visual theme with deep gray backgrounds and high-contrast text for comfortable viewing
- **Data Annotation**: Structured input format using syntax like `{{daily_meals}}` for parsing user data

## Requirements

### Requirement 1: Dashboard Display

**User Story:** As a user, I want to view a structured dashboard with all my wellness metrics, so that I can quickly understand my overall progress and areas needing attention.

#### Acceptance Criteria

1. WHEN a user accesses the dashboard THEN the System SHALL display six sections in the following order: LifeFitFinSync Score, Diet & Health Insights, Fitness & Activity Plan, Personal Development, Financial Sync Report, and Time Planning
2. WHEN the dashboard renders THEN the System SHALL display all scores as numerical values between 0 and 100
3. WHEN the dashboard loads THEN the System SHALL present data in a structured, easy-to-read format with clear section headings
4. WHEN displaying metrics THEN the System SHALL use icons and labels together to convey information without relying on color alone
5. WHEN the user has no data THEN the System SHALL display placeholder content with guidance on how to input data

### Requirement 2: LifeFitFinSync Score Calculation

**User Story:** As a user, I want to see my overall LifeFitFinSync score and its component scores, so that I can understand my wellness across multiple dimensions.

#### Acceptance Criteria

1. WHEN calculating the overall LifeFitFinSync score THEN the System SHALL compute a weighted average of the four sub-scores (Health, Fitness, Finance, Personal Growth)
2. WHEN an emergency alert is active THEN the System SHALL apply a penalty to the overall LifeFitFinSync score
3. WHEN any sub-score is calculated THEN the System SHALL ensure the result is a value between 0 and 100
4. WHEN displaying scores THEN the System SHALL show both the overall score and all four sub-scores with their respective values
5. WHEN score data is unavailable for a dimension THEN the System SHALL exclude that dimension from the weighted average calculation

### Requirement 3: Health Score Calculation

**User Story:** As a user, I want my health score to reflect my diet quality, hydration, sleep, and weight trends, so that I can monitor my physical wellness.

#### Acceptance Criteria

1. WHEN calculating the Health Score THEN the System SHALL incorporate diet quality assessment based on meal data
2. WHEN calculating the Health Score THEN the System SHALL incorporate hydration level based on daily fluid intake
3. WHEN sleep data is provided THEN the System SHALL incorporate sleep quality into the Health Score calculation
4. WHEN weight trend data is available THEN the System SHALL incorporate weight change patterns into the Health Score calculation
5. WHEN any health metric exceeds safe thresholds THEN the System SHALL trigger an emergency alert

### Requirement 4: Fitness Score Calculation

**User Story:** As a user, I want my fitness score to reflect my daily movement and exercise habits, so that I can track my physical activity progress.

#### Acceptance Criteria

1. WHEN calculating the Fitness Score THEN the System SHALL incorporate daily movement targets and actual movement achieved
2. WHEN calculating the Fitness Score THEN the System SHALL incorporate weekly exercise minutes logged by the user
3. WHEN strength training sessions are logged THEN the System SHALL incorporate them into the Fitness Score calculation
4. WHEN exercise data spans multiple days THEN the System SHALL compute an average activity level for score calculation
5. WHEN no exercise data exists THEN the System SHALL assign a Fitness Score of 0

### Requirement 5: Finance Score Calculation

**User Story:** As a user, I want my finance score to reflect my food spending habits and waste reduction, so that I can improve my financial discipline.

#### Acceptance Criteria

1. WHEN calculating the Finance Score THEN the System SHALL incorporate the percentage of home-cooked meals versus purchased meals
2. WHEN calculating the Finance Score THEN the System SHALL incorporate the food waste rate based on expired items
3. WHEN calculating the Finance Score THEN the System SHALL incorporate spending reduction compared to previous periods
4. WHEN weekly expense data is provided THEN the System SHALL parse grocery, takeout, and snack spending separately
5. WHEN no financial data exists THEN the System SHALL assign a Finance Score of 0

### Requirement 6: Personal Growth Score Calculation

**User Story:** As a user, I want my personal growth score to reflect my study habits and skill development, so that I can track my learning discipline.

#### Acceptance Criteria

1. WHEN calculating the Personal Growth Score THEN the System SHALL incorporate the number of study blocks completed
2. WHEN calculating the Personal Growth Score THEN the System SHALL incorporate adherence to spaced repetition revision schedules
3. WHEN calculating the Personal Growth Score THEN the System SHALL incorporate completion of practice tasks
4. WHEN study goals are defined THEN the System SHALL compare actual progress against planned study blocks
5. WHEN no study data exists THEN the System SHALL assign a Personal Growth Score of 0

### Requirement 7: Dark Mode Support

**User Story:** As a user, I want to toggle between light and dark modes, so that I can view the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user clicks the dark mode toggle THEN the System SHALL switch the visual theme to dark mode with deep gray backgrounds and high-contrast text
2. WHEN a user clicks the dark mode toggle in dark mode THEN the System SHALL switch back to light mode
3. WHEN the user's theme preference is set THEN the System SHALL persist that preference for future sessions
4. WHEN displaying content in dark mode THEN the System SHALL maintain WCAG AA accessibility standards for color contrast
5. WHEN in dark mode THEN the System SHALL reserve red color exclusively for emergency alerts

### Requirement 8: Data Input Parsing

**User Story:** As a user, I want to input my wellness data using structured annotations, so that the system can accurately parse and display my information.

#### Acceptance Criteria

1. WHEN a user provides data with `{{daily_meals}}` annotation THEN the System SHALL parse meals, portions, and drinks for the specified date range
2. WHEN a user provides data with `{{exercise_minutes}}` annotation THEN the System SHALL parse exercise type, duration, and steps per day
3. WHEN a user provides data with `{{job_schedule}}` annotation THEN the System SHALL parse work hours, commute time, and preferred workout times
4. WHEN a user provides data with `{{study_goals}}` annotation THEN the System SHALL parse subjects, exam dates, and weak topics
5. WHEN a user provides data with `{{weekly_expenses}}` annotation THEN the System SHALL parse groceries, takeout, snacks, and supplement costs

### Requirement 9: Emergency Alert Display

**User Story:** As a user, I want to see prominent emergency alerts when my health metrics breach safe thresholds, so that I can take immediate action.

#### Acceptance Criteria

1. WHEN a health threshold is breached THEN the System SHALL display a red emergency banner at the top of the dashboard
2. WHEN an emergency alert is active THEN the System SHALL display a pinned doctor contact card with name, phone, and email
3. WHEN an emergency alert is displayed THEN the System SHALL provide a "Contact Doctor Now" button that enables calling or emailing
4. WHEN a user acknowledges an emergency alert THEN the System SHALL record the acknowledgment timestamp
5. WHEN displaying emergency alerts THEN the System SHALL use red color exclusively for this purpose to maintain visual hierarchy

### Requirement 10: Responsive Layout

**User Story:** As a user, I want the dashboard to display properly on different screen sizes, so that I can access my wellness data on any device.

#### Acceptance Criteria

1. WHEN the dashboard is viewed on a mobile device THEN the System SHALL stack sections vertically with full-width components
2. WHEN the dashboard is viewed on a tablet THEN the System SHALL arrange sections in a two-column layout where appropriate
3. WHEN the dashboard is viewed on a desktop THEN the System SHALL utilize available horizontal space with multi-column layouts
4. WHEN the viewport size changes THEN the System SHALL adjust the layout without requiring a page reload
5. WHEN displaying charts on small screens THEN the System SHALL scale them proportionally to maintain readability
