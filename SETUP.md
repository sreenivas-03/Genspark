# Running the Task Manager AI App Locally

## Prerequisites

Before you can run the app, you need to set up a PostgreSQL database.

### Option 1: Using Docker (Recommended)

If you have Docker installed, run this command to start a PostgreSQL container:

```bash
docker run -d `
  --name postgres-taskmanager `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=task_manager `
  -p 5432:5432 `
  postgres:16
```

Then your `.env.local` can use:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager
```

### Option 2: Local PostgreSQL Installation

If you have PostgreSQL installed locally (from https://www.postgresql.org/download/):

1. Create a database:
```sql
CREATE DATABASE task_manager;
```

2. Update `.env.local` with your connection string:
```
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/task_manager
```

### Option 3: Cloud PostgreSQL

Use a free tier cloud database like:
- **Railway** (free tier): https://railway.app
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com

Then update `.env.local` with the provided connection string.

## Setup & Run

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.local` (already created) and update `DATABASE_URL` with your database connection string

3. **Initialize the database**:
   ```bash
   npm run db:push
   ```
   This creates all the necessary tables.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   - Open your browser to `http://localhost:5000`

## Project Structure

- **Frontend**: React app in `/client`
- **Backend**: Express API in `/server`
- **Shared**: Schema definitions in `/shared/schema.ts`

## API Routes

Once running, the API is available at:
- `http://localhost:5000/api/*`

The frontend is served from the same port (Vite dev server is proxied through Express in development).

## Troubleshooting

### "DATABASE_URL must be set" error
- Make sure you've created the `.env.local` file with a valid `DATABASE_URL`
- Verify your database is running and accessible

### Database connection refused
- Check that your PostgreSQL server is running
- Verify the connection string format and credentials

### Port 5000 already in use
- Update `PORT` in `.env.local` to a different port
- Or kill the process using port 5000

## Features

The app includes:
- AI-powered code tutor
- Programming language lessons (150+ languages)
- Interactive code challenges
- Gamification (XP, streaks, achievements)
- Dark/light theme support
- Responsive mobile-first design
