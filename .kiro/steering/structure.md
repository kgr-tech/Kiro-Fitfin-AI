---
inclusion: always
---

# Project Structure

## Repository Organization

```
kiro-fitfin-agent/
├── src/                    # Frontend source code (React + Tailwind)
├── dist/                   # Production build output (deploy to S3)
├── lambda/                 # Backend Lambda functions (Node.js)
├── .env                    # Local environment variables (not committed)
└── package.json            # Node.js dependencies and scripts
```

## Frontend Architecture

- **Components**: React components with Tailwind CSS styling
- **Dark Mode**: Top-right toggle, persisted per user
- **Dashboard Format**: Always outputs structured sections in order:
  1. LifeFitFinSync Score (overall + 4 sub-scores)
  2. Diet & Health Insights
  3. Fitness & Activity Plan
  4. Personal Development (Study + Skills)
  5. Financial Sync Report
  6. Time Planning (job-schedule-aware)

## Backend Architecture

- **Serverless**: AWS Lambda functions behind API Gateway
- **Auth Flow**: Cognito-based authentication on all protected endpoints
- **Data Storage**: DynamoDB or Aurora Serverless
- **Real-time**: WebSocket connections for emergency alerts
- **Notifications**: SNS for email/SMS alerts

## Key Conventions

### UI/UX Rules

- Red color reserved exclusively for emergency alerts
- Deep gray backgrounds with high-contrast text in dark mode
- WCAG AA accessibility compliance
- Icons + labels (never color-only indicators)
- Emergency banner + pinned doctor contact card for threshold breaches

### Data Input Format

Use annotation syntax for structured data:
- `{{daily_meals}}` — meals, portions, drinks (3-7 days)
- `{{exercise_minutes}}` — type, duration, steps per day
- `{{job_schedule}}` — work hours, commute, workout preferences
- `{{study_goals}}` — subjects, exam dates, weak topics
- `{{weekly_expenses}}` — groceries, takeout, snacks, supplements

### Scoring Logic

- **Health**: Diet quality, hydration, sleep, weight trend
- **Fitness**: Daily movement, weekly minutes, strength sessions
- **Finance**: % home-cooked meals, waste rate, takeout reduction
- **Personal Growth**: Study blocks, revision adherence, practice tasks
- **Overall**: Weighted average with penalties for emergency alerts

### Safety & Emergency Flow

- Threshold breach → Red emergency banner
- Display pinned doctor contact (name, phone, email)
- "Contact Doctor Now" button (call/email) + alert acknowledgment
- Always recommend consulting a doctor for concerning symptoms
