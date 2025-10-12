# Daily Writing App

A minimalist daily writing application designed to help people form consistent writing habits through clarity, calmness, and privacy.

## Overview

This is a web-based journaling and habit-tracking app where users can:

- Write daily entries with a distraction-free editor
- Track writing streaks and progress
- View writing history in a calendar format
- Get AI-powered reflections on their writing (premium feature)
- Manage their writing habit with stats and insights

## Tech Stack

**Frontend:**

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend:**

- Supabase (Authentication, Database, Row-Level Security)
- PostgreSQL

**Integrations:**

- OpenAI API (AI writing reflections)
- Paddle (subscription management)

**Deployment:**

- Vercel (frontend hosting)

## Features

**Core Features:**

- Fullscreen distraction-free text editor
- Autosave functionality
- Daily writing prompts
- Streak tracking (consecutive writing days)
- Word count tracking
- Calendar view of writing history
- Statistics dashboard (total words, writing frequency)

**Premium Features:**

- AI-powered writing reflections and insights
- Advanced analytics
- Export and download entries

**User Management:**

- Email and Google authentication
- Free and paid subscription tiers
- User settings (dark mode, reminders, preferences)

**Technical Features:**

- Progressive Web App (PWA) with offline support
- Responsive design for all devices
- Secure data storage with Row-Level Security
- Automated backup and sync

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Supabase account
- OpenAI API key (for AI features)
- Paddle account (for payments)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/daily-writing-app.git
cd daily-writing-app
```
