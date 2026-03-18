# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, Claude generates code via tool calls, and components render in a sandboxed iframe with in-browser JSX transpilation.

## Commands

- **Setup**: `npm run setup` (installs deps, generates Prisma client, runs migrations)
- **Dev server**: `npm run dev` (Next.js with Turbopack on port 3000)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test` (Vitest with jsdom environment)
- **Run single test**: `npx vitest run path/to/test.ts`
- **DB reset**: `npm run db:reset`
- **Prisma generate** (after schema changes): `npx prisma generate`
- **Prisma migrate** (after schema changes): `npx prisma migrate dev`

Note: Dev/build/start commands require `NODE_OPTIONS='--require ./node-compat.cjs'` (already configured in package.json scripts).

## Architecture

### AI Generation Flow

1. User sends message via ChatProvider (`lib/contexts/chat-context.tsx`) → POST `/api/chat`
2. API route (`app/api/chat/route.ts`) streams responses using Vercel AI SDK's `streamText` with tool calls
3. Two tools available to the AI: `str_replace_editor` (create/edit/view files) and `file_manager` (rename/delete)
4. Tools operate on a **VirtualFileSystem** — no files are written to disk
5. FileSystemProvider (`lib/contexts/file-system-context.tsx`) mirrors tool calls client-side via `onToolCall`
6. On stream finish, messages + file system state are persisted to the project in SQLite via Prisma

### Language Model Provider

`lib/provider.ts` selects the model: uses `claude-haiku-4-5` via `@ai-sdk/anthropic` when `ANTHROPIC_API_KEY` is set, otherwise falls back to a MockLanguageModel that returns static placeholder components.

### Preview System

`PreviewFrame` renders components in a sandboxed iframe. The JSX transformer (`lib/transform/jsx-transformer.ts`) uses Babel to transpile JSX/TS in-browser, generates ESM import maps with blob URLs for local files and esm.sh CDN for third-party packages, and injects Tailwind CSS + React 19 via CDN.

### Virtual File System

`lib/file-system.ts` implements an in-memory tree (Map-based) with serialize/deserialize for JSON persistence. Stored as a flat `Record<path, FileNode>` JSON string in the `project.data` column.

### Auth

JWT sessions (HS256, httpOnly cookies, 7-day expiry) managed in `lib/auth.ts`. Server actions in `actions/index.ts` handle signUp/signIn/signOut with bcrypt. Middleware protects API routes. Anonymous users can work without auth; `lib/anon-work-tracker.ts` uses sessionStorage to preserve work and convert it to a project on sign-up.

### UI Layout

Horizontal resizable panels: chat (35% left) and preview/code (65% right). Code view splits vertically into file tree (30%) and Monaco editor (70%). Uses shadcn/ui (new-york style) with Radix primitives and Tailwind CSS v4.

### Data Model (Prisma/SQLite)

- **User**: email, bcrypt password, has many Projects
- **Project**: name, userId (cascade delete), messages (JSON string), data (serialized VFS JSON string)

### Path Aliases

TypeScript `@/` alias maps to `src/`. shadcn/ui components live in `src/components/ui/`.
