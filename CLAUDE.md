# Matchmaker Project Guidelines

## Project Overview
Matchmaker is a Telegram-based conversational AI system for practicing intimacy and emotional resilience.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Bot Platform:** Telegram (via Grammy)
- **Styling:** Tailwind CSS

## Architecture
- `src/lib/matchmaker`: Core logic for memory, matching, and agent behavior.
- `mini-services/telegram-bot`: Telegram interface and bot logic.
- `mini-services/matchmaker-worker`: Background job processor for async matching.
- `prisma/schema.prisma`: Unified database schema.

## Development Standards
- **TypeScript:** Use strict typing. Avoid `any`.
- **Naming Conventions:**
  - Files: `kebab-case`.
  - Components: `PascalCase`.
  - Functions/Variables: `camelCase`.
- **Database:** Always use Prisma Client for database interactions.
- **State Management:** Keep agents' emotional states and memories in the database.
- **Async Flow:** The matchmaker process must be asynchronous (24-hour flow).

## Key Specs
Refer to `/home/team/shared/specs/` for:
- `memory-spec.md`: SM-2 algorithm details.
- `relationship-health-spec.md`: Affection/Trust metrics and boundaries.
- `matching-logic-spec.md`: Bidirectional matching logic.
- `soul-generation.md`: Persona generation framework.
- `sensory-lexicon-spec.md`: Emotional vocabulary.

## Coding Patterns
- Use **functional programming** where possible.
- Ensure **idempotency** in background workers.
- Implement **graceful error handling** for LLM and Telegram API calls.
