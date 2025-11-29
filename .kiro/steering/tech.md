---
inclusion: always
---

# Tech Stack

## Frontend

- **Framework**: React with Tailwind CSS
- **Charts**: Chart.js or D3.js for data visualization
- **Mode**: Dark/Night mode support (persisted per user)
- **Build Tool**: Vite (inferred from `VITE_API_BASE_URL`)

## Backend (AWS Serverless)

- **Compute**: AWS Lambda (Node.js)
- **API**: API Gateway (REST + WebSocket for real-time alerts)
- **Auth**: Amazon Cognito (User Pool + App Client)
- **Database**: DynamoDB (logs, items, alerts) OR Aurora Serverless (relational)
- **Storage**: S3 (static hosting, reports) + CloudFront (CDN)
- **Notifications**: Amazon SNS (email/SMS alerts)
- **Monitoring**: CloudWatch

## CI/CD

- AWS CodePipeline + CodeBuild OR GitHub Actions
- Deploy frontend to S3, invalidate CloudFront
- Package Lambda functions via Serverless Framework or CDK

## Environment Variables

Required for local development (`.env`) and AWS deployment:

- `VITE_API_BASE_URL` — API Gateway base URL
- `COGNITO_USER_POOL_ID` — Cognito User Pool ID
- `COGNITO_CLIENT_ID` — Cognito App Client ID
- `AWS_REGION` — e.g., ap-south-1
- `SNS_TOPIC_ARN` — Alerts topic (optional)
- `DB_MODE` — `dynamodb` or `aurora`

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
```

### Build & Deploy
```bash
npm run build        # Build for production (outputs to /dist)
# Upload /dist to S3, invalidate CloudFront cache
```

### Backend Deployment
- Package Lambda functions
- Deploy via Serverless Framework or AWS CDK
- Wire endpoints in API Gateway
- Connect Cognito authorizer

## API Endpoints Structure

- Auth: `/auth/signup`, `/auth/login`
- Dashboard: `/dashboard` (KPIs + scores)
- Health: `/health/meal`, `/health/activity`, `/health/trend`
- Study: `/study/task`, `/study/heatmap`, `/study/complete`
- Finance: `/finance/grocery`, `/finance/expiry`, `/finance/spend`
- Alerts: `/alerts/acknowledge`, `/alerts/history`
- Settings: `/settings/profile` (GET/PUT)
