# Kiro Fitfin AI

A calm, practical, mentor-style AI-powered web app that unifies health, fitness, finance and personal growth.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS (with dark mode support)
- **Charts**: Chart.js + react-chartjs-2
- **Testing**: Vitest + React Testing Library + fast-check (property-based testing)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account (for backend deployment)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm test:ui
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Project Structure

```
src/
├── components/       # React components
├── contexts/         # React contexts (dark mode, etc.)
├── services/         # Business logic and API clients
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
└── test/             # Test setup and utilities
```

## Features

- ✅ Dashboard with LifeFitFinSync scoring
- ✅ Dark/Night mode support
- ✅ Health & fitness tracking
- ✅ Finance & food waste sync
- ✅ Study & skills planner
- ✅ Emergency alerts with doctor contact
- ✅ Responsive design (mobile, tablet, desktop)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Vercel will automatically detect Vite and configure the build
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Set up Supabase

1. Create a project at [Supabase](https://supabase.com)
2. Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health metrics table
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  calories_estimated INTEGER,
  hydration_liters DECIMAL,
  sleep_hours DECIMAL,
  sleep_quality TEXT,
  weight_kg DECIMAL,
  diet_quality_score DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness metrics table
CREATE TABLE fitness_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  daily_steps INTEGER,
  total_minutes INTEGER,
  strength_sessions INTEGER,
  movement_target INTEGER,
  movement_achieved INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finance metrics table
CREATE TABLE finance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  week_start DATE NOT NULL,
  grocery_spend DECIMAL,
  takeout_spend DECIMAL,
  snack_spend DECIMAL,
  supplement_spend DECIMAL,
  home_cooked_meals INTEGER,
  purchased_meals INTEGER,
  expired_items INTEGER,
  total_items INTEGER,
  previous_week_spend DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth metrics table
CREATE TABLE growth_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  week_start DATE NOT NULL,
  study_blocks_completed INTEGER,
  study_blocks_planned INTEGER,
  revision_tasks_completed INTEGER,
  revision_tasks_planned INTEGER,
  practice_tasks_completed INTEGER,
  practice_tasks_planned INTEGER,
  subjects TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN DEFAULT FALSE
);
```

3. Enable Row Level Security (RLS) on all tables
4. Copy your project URL and anon key to `.env`

## License

Private - All rights reserved
