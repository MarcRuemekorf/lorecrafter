# Lorecrafter — project context

Handoff notes from the design and planning conversation. Keep this file up to date as decisions change.

## What we're building

An interactive storytelling web app. The AI is the author and the world; the user is the protagonist.
The story remembers (structured state is the source of truth) and the world continues.

- Personal project, single user (the owner), invite-only. Sign-up disabled. For now.
- Hosted in the EU. Domain: `lorecrafter.nl`, app at `app.lorecrafter.nl`.
- Designs live on a Claude Design canvas. Designs will be updated during development.

## How to work with the owner

- The owner wants to keep **learning**. For every step, take a moment to explain what we're doing and why, not only the commands.
- Work **one step at a time**: explain, don't take over but let the owner do it, check the result, then move on.
- Ask clarifying questions before long, detailed answers.
- Keep pleasantries to a minimum; stick to the subject.
- In code reviews, always include code examples that show how to fix each finding.
- Comfortable with: TypeScript, React, Next.js. New to: SQL/Postgres, Docker/servers/DNS.
- Develops on Linux, VS Code.

## Conventions

- **Everything runs in Docker.** Never run `node` or `pnpm` directly on the host. Check ./Taskfile for relevant commands otherwise use `docker compose run --rm app pnpm …` or `docker compose exec app pnpm …`.
- Node version lives only in the dev Dockerfile (`node:26-slim`). pnpm version is pinned in `package.json` (`packageManager`), used by Corepack inside the container.
- Always commit `pnpm-lock.yaml`.
- Git commits use the GitHub noreply address.
- Secrets go in `.env.local` (gitignored), never in Git.
- Dev server port is bound to `127.0.0.1` only.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS v4 + Radix primitives |
| Composer | Tiptap (live formatting of `*action*` and `(( author notes ))`) |
| AI calls | Vercel AI SDK (`streamText`, `generateObject` + zod) |
| Model access | OpenRouter (model per role: narrator, memory, illustrator) |
| Schemas | zod |
| Database | Postgres + Drizzle ORM (pgvector later, if needed) |
| Background jobs | pg-boss |
| Auth | Better Auth + passkeys (`@better-auth/passkey`), sign-up disabled, RP ID `lorecrafter.nl` |
| File storage | S3-compatible EU storage (Hetzner Object Storage), private bucket, signed URLs |
| Hosting | Hetzner VPS + Coolify (Docker) |
| Lint/format | Biome |
| Testing | Vitest + Playwright |
| Backups | Nightly `pg_dump` to object storage, with a tested restore |

## MVP scope

In:
- Library, Create Story, Story View (streaming prose, composer markup, regenerate/edit last turn, chapter/scene breadcrumb, chapter suggestion, story settings panel).
- Memory backend: structured `StoryState`, scenes, chapters, threads, character facts, updated after every reply via a `SceneDelta` (zod) background job.
- Private stories: hidden by default, passkey or PIN unlock, auto-lock, blur when switching away, excluded from recents/search, signed image URLs. Adult maturity forces private.
- Illustrations: confirm step, monthly allowance (10), one illustration per scene with versions and a canonical choice, Images page (grouped by chapter) and viewer.
- Settings subset: privacy, new-story defaults, illustrations, reading, model per role.

Out (post-MVP): Story Map UI, Character pages, "Previously…" recap, portraits, push notifications, multi-user, billing, export, account deletion.

Composer markup: plain text = speech, `*…*` = action/mood, `(( … ))` = note to the author (never shown in prose).

## Milestones

M0 Foundation · M1 Core loop · M2 Memory · M3 Privacy · M4 Illustrations · M5 Polish

## M0 Foundation — steps and progress

| # | Step | Status |
|---|---|---|
| 1 | Machine setup: Docker, Git, SSH key for GitHub, noreply email | Done |
| 2 | Create the Next.js project, private GitHub repo, dev container (Dockerfile.dev + compose) | Done |
| 3 | Guardrails: strict TypeScript, Biome | Done |
| 4 | Local Postgres as a second compose service | In progress |
| 5 | Drizzle schema and migrations | |
| 6 | Validated environment config (zod) | |
| 7 | Auth: Better Auth, single seeded account, passkeys | |
| 8 | Protecting pages server-side | |
| 9 | Tests and CI (GitHub Actions, same `node:26-slim` image) | |
| 10 | Hetzner VPS, SSH hardening, firewall, DNS, Coolify | |
| 11 | First deploy: production multi-stage Dockerfile, secrets, HTTPS, migrations on deploy | |
| 12 | Backups to object storage and a tested restore | |

Done when: passkey sign-in works on `app.lorecrafter.nl`, a push to `main` is tested and deployed, and a backup has been restored successfully.