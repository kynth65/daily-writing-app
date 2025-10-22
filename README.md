# Daily Writing App

A minimalist daily writing and journaling application built with Next.js 15, designed to help users form consistent writing habits through a calm, focused, and private writing environment.

## Overview

Daily Writing App is a feature-complete web application that combines habit tracking, journaling, and AI-powered insights to help users maintain a consistent writing practice. The app works offline and provides a distraction-free writing experience with intelligent caching and synchronization.

## Features

### Writing & Editing

- **Rich Text Editor**: TipTap-based editor with autosave functionality
- **Distraction-Free Interface**: Clean, minimal design focused on writing
- **Writing Prompts**: Daily prompts to inspire your writing
- **Autosave**: Automatic saving of entries as you write
- **Offline Support**: Write entries even without internet connection

### Tracking & Analytics

- **Streak Tracking**: Track consecutive writing days
- **Word Count Statistics**: Monitor daily and total word counts
- **Calendar View**: Visual calendar showing writing history
- **Statistics Dashboard**: Comprehensive metrics including:
  - Current streak and longest streak
  - Total entries and total words written
  - Average words per entry
  - Writing frequency over time
- **Monthly History**: Browse entries by month with calendar visualization

### AI-Powered Insights

- **Sentiment Analysis**: Automatic emotion and mood detection for each entry
- **AI Reflections**: Generate weekly or monthly reflections on your writing journey
- **Mood Tracking**: Visual mood trends over time
- **Insights Page**: View AI-generated reflections and themes from your entries

### Data Management

- **Export Functionality**: Download all entries in multiple formats:
  - JSON (structured data)
  - CSV (spreadsheet-friendly)
  - Markdown (portable text format)
- **Secure Storage**: All data protected with Row-Level Security in Supabase
- **IndexedDB Caching**: Local storage for instant access and offline capability
- **Background Sync**: Automatic synchronization when connection is restored

### User Experience

- **Authentication**: Email signup/login and Google OAuth
- **Settings Management**:
  - Reminder preferences
  - Notification settings
  - Account management
- **PWA Support**: Install as a mobile or desktop app
- **Responsive Design**: Works seamlessly on all devices
- **Smooth Transitions**: Fast, fluid navigation between pages
- **Online/Offline Indicator**: Visual status indicator

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **TipTap Editor** - Rich text editing
- **SWR** - Data fetching with intelligent caching
- **date-fns** - Date manipulation and formatting
- **Lucide React** - Icon library

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - Authentication (Email + Google OAuth)
  - PostgreSQL database
  - Row-Level Security policies
  - Real-time capabilities
- **OpenAI API** - AI-powered sentiment analysis and reflections

### Performance & PWA

- **Service Workers** - Offline caching and background sync
- **IndexedDB** - Client-side data storage
- **Turbopack** - Fast build optimization
- **Next.js Image Optimization** - Optimized image delivery

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (or yarn/pnpm/bun)
- Supabase account (free tier available)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd daily-writing-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database:

- Create a new project at [Supabase](https://supabase.com)
- Run the SQL migrations in the Supabase SQL editor:
  - `database/001_initial_schema.sql` - Core tables and RLS policies
  - `database/002_ai_features.sql` - AI features (sentiment, reflections)
- Enable Google OAuth in Authentication > Providers (optional)
- Copy your project URL and anon key to `.env.local`

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
daily-writing-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/             # Protected app routes
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── write/         # Writing editor
│   │   │   ├── history/       # Entry history
│   │   │   ├── stats/         # Statistics
│   │   │   ├── insights/      # AI insights
│   │   │   └── settings/      # User settings
│   │   ├── api/               # API routes
│   │   │   ├── entries/       # Entry CRUD operations
│   │   │   ├── stats/         # Statistics data
│   │   │   ├── history/       # Historical data
│   │   │   ├── settings/      # User settings
│   │   │   ├── export/        # Data export
│   │   │   └── ai/            # AI features
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   └── auth/callback/     # OAuth callback
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── editor/            # TipTap editor
│   │   ├── calendar/          # Calendar views
│   │   ├── history/           # Entry previews
│   │   ├── stats/             # Statistics displays
│   │   ├── insights/          # AI insights components
│   │   ├── settings/          # Settings components
│   │   ├── layout/            # Navigation and layout
│   │   ├── transitions/       # Page transitions
│   │   └── pwa/               # PWA components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAutosave.ts     # Autosave functionality
│   │   ├── useStats.ts        # Statistics data fetching
│   │   └── useHistory.ts      # History data fetching
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/          # Supabase clients
│   │   ├── ai/                # OpenAI integration
│   │   ├── db/                # IndexedDB manager
│   │   ├── sync/              # Sync manager
│   │   ├── streaks.ts         # Streak calculations
│   │   ├── stats.ts           # Statistics utilities
│   │   ├── prompts.ts         # Writing prompts
│   │   └── utils.ts           # General utilities
│   ├── types/                 # TypeScript types
│   │   ├── database.ts        # Database types
│   │   └── index.ts           # App types
│   └── middleware.ts          # Route protection
├── database/                  # SQL migrations
│   ├── 001_initial_schema.sql
│   └── 002_ai_features.sql
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker
│   └── icon.svg               # App icon
└── CLAUDE.md                  # Development guide
```

## Database Schema

### Tables

- **entries** - User writing entries with content, word count, sentiment, and mood data
- **user_settings** - User preferences (reminders, notifications)
- **user_streaks** - Denormalized streak and statistics data
- **reflections** - AI-generated weekly/monthly reflections

All tables have Row-Level Security (RLS) policies ensuring users can only access their own data.

## API Routes

- `POST /api/entries` - Create new entry
- `GET /api/entries` - List user entries
- `PATCH /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry
- `GET /api/history?month=YYYY-MM` - Get entries for specific month
- `GET /api/stats?type=overview` - Get user statistics
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings
- `GET /api/export?format=json|csv|markdown` - Export all entries
- `POST /api/ai/analyze` - Analyze entry sentiment
- `GET /api/ai/mood` - Get mood trends
- `POST /api/ai/reflect` - Generate AI reflection
- `GET /api/ai/reflect?limit=20` - Get reflection history

## Development

### Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Variables

The app requires these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `OPENAI_API_KEY` - Your OpenAI API key for AI features

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Configure Supabase

1. Add your production URL to Supabase Authentication > URL Configuration
2. Add the URL to "Redirect URLs" for OAuth callbacks
3. Ensure all database migrations are run

## Design System

### Color Palette

- **Background**: `#3A4F41` - Dark sage green for a calm environment
- **Text**: `#F7F7FF` - Off-white for excellent readability
- **Borders**: `rgba(247, 247, 255, 0.1)` - Subtle separation
- **Hover States**: `rgba(247, 247, 255, 0.1)` - Gentle interaction feedback

### Typography

- **Primary Font**: Instrument Serif (400 weight)
- **Display Font**: Playfair Display (400 weight)
- All text uses normal weight for a clean, elegant appearance

### Design Principles

- Minimalist and uncluttered interface
- High contrast for readability
- No gradients - flat color design only
- Plenty of white space
- Intuitive navigation patterns

## Performance Features

- **SWR Caching**: Intelligent data fetching with stale-while-revalidate
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Turbopack**: Fast development and production builds
- **IndexedDB**: Client-side caching for instant data access
- **Service Worker**: Offline-first architecture with background sync

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
