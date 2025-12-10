# Genspark - AI-Powered Programming Education Platform

## Overview

Genspark is an AI-powered programming education mobile-first web application built for learning 150+ programming languages. The platform combines gamified learning elements (XP, streaks, achievements) with an AI tutor, interactive lessons, code practice, and quizzes. It draws inspiration from Duolingo's gamification approach and modern developer tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark modes)
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Design System**: Material 3 + Soft-Neumorphism aesthetic with custom color palette (Electric Blue primary, Neon Purple secondary, Gold accent)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful endpoints under `/api/*`
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command
- **Key Tables**: users, languages, lessons, userProgress, achievements, quizzes, challenges, chatMessages, sessions

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: tsx for running TypeScript directly
- **Build Output**: `dist/` directory with `public/` subfolder for static assets

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # Reusable UI components
    pages/        # Route-level page components
    hooks/        # Custom React hooks
    lib/          # Utilities, constants, theme
server/           # Backend Express application
  routes.ts       # API route definitions
  storage.ts      # Database operations interface
  db.ts           # Drizzle database connection
  seed.ts         # Database seeding logic
shared/           # Shared code between frontend/backend
  schema.ts       # Drizzle schema definitions
```

### Key Design Patterns
- **Monorepo Structure**: Client and server share types via `@shared/*` path alias
- **Storage Interface Pattern**: `IStorage` interface in `storage.ts` abstracts database operations
- **Query Pattern**: Frontend uses React Query with fetch-based API requests
- **Theme System**: CSS variables with light/dark mode support via `ThemeProvider`

## External Dependencies

### AI Integration
- **OpenAI API**: GPT-5 model for AI tutor chat functionality (`server/openai.ts`)
- Features: Chat responses, code explanation, debugging assistance

### Authentication
- **Replit Auth**: OpenID Connect-based authentication
- Session storage in PostgreSQL via connect-pg-simple

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for AI tutor (optional, graceful fallback)
- `SESSION_SECRET`: Secret for session encryption
- `ISSUER_URL`: Replit OIDC issuer (defaults to https://replit.com/oidc)
- `REPL_ID`: Replit environment identifier

### Frontend Libraries
- Radix UI primitives for accessible components
- Lucide React and react-icons for iconography
- date-fns for date formatting
- Embla Carousel for carousels
- Vaul for drawer components