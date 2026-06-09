<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Instructions

## Architecture

* Frontend: Next.js App Router
* Backend: Next.js Route Handlers
* Database: Supabase PostgreSQL
* ORM: Prisma
* Authentication: Supabase Auth
* Storage: Supabase Storage
* Styling: Tailwind CSS
* UI Components: shadcn/ui

## Required Skills

Before performing tasks, load these skills when relevant:

### Product Planning

* bmad-agent-pm
* bmad-create-prd
* bmad-create-epics-and-stories

### Architecture

* bmad-agent-architect
* bmad-create-architecture

### Development

* bmad-agent-dev
* bmad-dev-story
* prisma-client-api
* prisma-database-setup
* supabase

### Database Optimization

* supabase-postgres-best-practices

## Development Rules

### Next.js

* Always use App Router.
* Prefer Server Components.
* Use Server Actions when appropriate.
* Avoid deprecated APIs.
* Check local Next.js documentation before implementation.

### Prisma

* Use Prisma Client for database access.
* Never write raw SQL unless necessary.
* Use transactions for multi-step writes.
* Keep schema.prisma as source of truth.

### Supabase

* Auth must be handled by Supabase Auth.
* Respect Row Level Security (RLS).
* Use service role only in trusted server environments.
* Never expose service role keys to the client.

### Database

* PostgreSQL runs on Supabase.
* Create indexes for frequently filtered columns.
* Use cursor pagination for large datasets.
* Avoid N+1 query patterns.

### Coding Standards

* TypeScript strict mode.
* No any unless justified.
* Prefer Zod for validation.
* Prefer async/await.
* Write reusable components.

## Before Coding

For every implementation:

1. Analyze requirements.
2. Check architecture impact.
3. Check database impact.
4. Check security implications.
5. Produce implementation plan.
6. Implement.
7. Validate against acceptance criteria.

## Before Database Changes

Always:

* Review Prisma schema.
* Generate migration.
* Verify Supabase compatibility.
* Consider RLS impact.
* Consider indexing requirements.

## Security Rules

* Never leak secrets.
* Never expose service_role keys.
* Validate all user input.
* Enforce authorization on server.
* Do not trust client-side permissions.
