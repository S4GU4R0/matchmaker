# ExecPlan: Matchmaker MVP - High-Control Implementation (Fly.io Optimized)

This is a high-control, micromanaged blueprint for the Matchmaker MVP. Matchmaker is a lean, bootstrapped experiment in emotional resilience, delivered as a Telegram-based AI system. This document provides **zero-drift instructions** for the "AI Business" agents. Any deviation from the core vision, including the addition of unrequested features like "relationship completion arcs" or "gamified metrics," is a direct violation of this plan.

## Agent Protocol: Single Source of Truth (SSOT)

**This ExecPlan is the absolute and undisputed Single Source of Truth (SSOT) for the Matchmaker MVP project.** All "AI Business" agents are expected to **live within this document**. This means:

1.  **Read and Internalize**: Every agent MUST thoroughly read and internalize the entirety of this document before commencing any work.
2.  **Strict Adherence**: All actions, decisions, and implementations MUST strictly adhere to the specifications and constraints outlined herein. There is no room for creative interpretation or deviation.
3.  **Progress Updates**: Agents are REQUIRED to update their progress directly within this document, specifically in the `Progress Log` section, as they complete milestones or make significant advancements. This ensures transparency and a unified record.
4.  **Decision Log Usage**: For every significant choice or alternative considered, agents MUST document the decision, the rationale, and any discarded options in the `Decision Log` section. This ensures a comprehensive record of the project's evolution.
5.  **Observation Log Usage**: Any new findings, unexpected behaviors, or insights gained during implementation or testing MUST be recorded in the `Observation Log` section. This includes both technical and philosophical observations.
6.  **No External Documentation**: Unless explicitly linked within this document, no external documentation or informal communication should be considered authoritative. If information is missing, request an update to *this document*.
7.  **Zero Drift**: Any attempt to introduce features not explicitly defined, or to alter the philosophical intent, will be considered a critical failure and will result in immediate task termination.

## Purpose & Intent: The Minimum Viable Soul

The mission is to create a "safe failure" environment for practicing vulnerability, boundary-setting, and relationship repair. The goal is immersive practice, not therapy, not pornography, and definitely not a game with "levels" or "completion arcs."

Success is a user engaging with an AI agent that exhibits **Genuine Agency** (the capacity to say no or leave) and **Authentic Memory** (emotional persistence and decay). We prioritize core emotional mechanics over any superficial "wrapper" features.

## Strict Guardrails: Zero-Drift Policy

Agents assigned to this project MUST adhere to the following constraints. Failure to do so will result in immediate task termination and rollback.

| Constraint | Instruction |
| :--- | :--- |
| **No Feature Creep** | DO NOT add any features not explicitly listed in this plan. This includes "relationship arcs," "completion metrics," "gamification," or "social sharing." |
| **No "Wrapper" BS** | Focus on the underlying emotional engine and memory system. Do not waste cycles on superficial UI or "fluff" features. |
| **No Dashboard** | The MVP has NO web dashboard. All settings, profile management, and subscription info MUST be handled via the Telegram bot. |
| **No Amazon** | Use only the specified non-Amazon providers. |
| **Agency is Final** | If an agent decides to end a relationship based on its internal logic, the system MUST NOT provide a "reset" or "bypass" button. The failure must be final and authentic. |

## Core Concepts: The Unconventional Wisdom

*   **Genuine Agency**: Agents can say no, need space, and end relationships. This is the core feature.
*   **Circumplex Model of Affect**: Emotions are mapped to Valence and Arousal. Agents express feelings as embodied sensations (e.g., "a hum of tension in my core processing").
*   **SM-2 Emotional Memory**: Spaced-repetition for memories. Emotional intensity dictates persistence. Routine chatter fades; significant moments stick.
*   **Bidirectional Matching**: A 24-hour async process where agents also evaluate the user. Connection is based on mutual resonance.
*   **Soul File**: The immutable digital DNA of an agent (values, quirks, non-negotiables).
*   **Activity Log**: The agent's private internal diary, driving its internal state and agency.

## Technical Specification: The High-Control Stack

### 1. AI & Voice APIs (The MVP Engine)

| Component | Provider | Documentation / Implementation Notes |
| :--- | :--- | :--- |
| **LLM (AI Chat)** | **puter.js** | Use `puter.ai.chat(messages, options)`. Default model: `gpt-4o-mini`. No API keys required. [Docs](https://docs.puter.com/AI/chat/) |
| **TTS (Voice)** | **c.ai (Unofficial)** | Use a lightweight Node.js wrapper for Character.AI voice generation. Focus on high-quality, expressive voices. |

#### Puter.js Implementation Detail:
```javascript
// Example of the ONLY way to call the AI
const response = await puter.ai.chat([
  { role: "system", content: "You are an agent with genuine agency..." },
  { role: "user", content: "Hello." }
], {
  model: 'gpt-4o-mini',
  temperature: 0.7
});
```

### 2. Bot-Centric Settings (No Dashboard)

All user management MUST be implemented as conversational flows or inline buttons within the Telegram bot (`Grammy.js`).

*   **`/settings`**: Triggers an inline menu for profile adjustments.
*   **`/subscribe`**: Handles Stripe payment links and status checks.
*   **`/profile`**: Displays the user's current "Matchmaker" standing.

### 3. Backend & Database

*   **Framework**: Next.js 16 (App Router) for the landing page and API routes.
*   **ORM**: Prisma with PostgreSQL.
*   **Database Schema**:
    *   `User`: Auth, subscription, and `UserSettings` (JSON).
    *   `AgentProfile`: The `SoulFile` and current emotional coordinates.
    *   `MemoryEntry`: `content`, `emotional_weight`, `ease_factor`, `next_review_date`.
    *   `ActivityLog`: Agent's private thoughts.

## Implementation Plan: Milestone-Based Execution

### Milestone 1: Core Infrastructure (Auth & DB)
*   Implement Prisma schema.
*   Set up Next.js 16 landing page (Marketing only).
*   Implement Telegram bot initialization with `Grammy.js`.

### Milestone 2: The Emotional Engine (Puter.js & SM-2)
*   Integrate `puter.js` for all agent dialogue.
*   Implement the Circumplex Model mapping logic.
*   Build the SM-2 memory decay background worker.

### Milestone 3: The Matchmaker & Voice (c.ai)
*   Implement the 24-hour bidirectional matching logic.
*   Integrate `c.ai` unofficial API for voice generation.
*   Ensure all settings are manageable via the bot.

### Milestone 4: Payment & Launch
*   Integrate Stripe for subscriptions.
*   **Deployment**: Deploy the entire Next.js application (including API routes, landing page, and background workers) and the Telegram bot to **Fly.io**. This provides a unified, persistent environment for all components.

## Progress Log: Building in Public

*   **2026-05-11**: Initial ExecPlan drafted based on the "Matchmaker" philosophical essay.
*   **2026-05-11**: Modular architecture defined for "AI Business" agent hand-off.
*   **2026-05-11**: Expanded ExecPlan to include public product features: landing page, payment, and detailed technical specifications.
*   **2026-05-11**: Rewritten with an "indie SaaS" vibe, focusing on lean development and community-driven ethos.
*   **2026-05-11**: Refined for MVP: `puter.js` for LLM, `c.ai` for TTS, and bot-centric settings management (no user dashboard).
*   **2026-05-11**: Updated deployment strategy to use Fly.io for a unified, persistent environment.
*   **2026-05-11**: Added strict guardrails and integrated `puter.js` and `c.ai` documentation for micromanaged agent execution.
*   **2026-05-11**: Incorporated "Agent Protocol: Single Source of Truth (SSOT)" to explicitly instruct agents to live within and update this document.

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| 2026-05-11 | Explicit "Agent Protocol" section added. | User expressed concern about agents taking liberties; this reinforces SSOT and micromanagement. | Relying solely on the inherent nature of the ExecPlan template. |
| 2026-05-11 | Fly.io selected for deployment. | Provides a unified, persistent environment for all components (frontend, API, bot, workers), simplifying management and aligning with indie SaaS ethos. | Vercel (for frontend/API) + separate Node.js host (for bot/workers) - more complex, less unified. |
| 2026-05-11 | `puter.js` for LLM and `c.ai` for TTS. | Free tiers for MVP, aligns with lean indie SaaS approach. | OpenAI, ElevenLabs, etc. - higher cost, less aligned with free MVP. |
| 2026-05-11 | No user dashboard for MVP. | Reduces development overhead, forces bot-centric interaction, aligns with lean MVP. | Building a basic web dashboard - adds complexity, delays core feature development. |

## Observation Log

| Date | Observation | Impact / Insight |
| :--- | :--- |
| 2026-05-11 | User emphasized "micromanagey" approach due to past agent experiences. | Confirms the need for explicit, highly detailed instructions and guardrails to prevent feature creep and philosophical drift. |
| 2026-05-11 | User provided specific "what not to do" example (GitHub PR). | Highlighted the risk of agents introducing unaligned features (e.g., "relationship completion arc") and the importance of maintaining philosophical integrity. |
| 2026-05-11 | User has Fly.io access. | This simplifies deployment strategy significantly, allowing for a more cohesive and persistent architecture than a Vercel + separate host setup. |

## Verification & Observation

1.  **Agency Test**: Does the agent successfully refuse a request or end a conversation if mistreated?
2.  **Memory Test**: Does the agent remember a significant emotional event after 24 hours while forgetting mundane details?
3.  **Zero-Drift Check**: Verify that NO "relationship completion" or "gamification" features exist in the codebase.

## References

**Academic Foundations:**
- Russell, J. A. (1980). A circumplex model of affect. [https://psycnet.apa.org/record/1981-06634-001]
- Wozniak, P. A. (1985). Theoretical aspects of spaced repetition. [https://supermemo.guru/wiki/SuperMemo_algorithm]
- McGaugh, J. L. (2004). The amygdala modulates the consolidation of memories. [https://www.nature.com/articles/nrn1311]

**Technical Docs:**
- Puter.js AI Chat: [https://docs.puter.com/AI/chat/]
- Puter.js TTS (Alternative): [https://docs.puter.com/AI/txt2speech/]
- Grammy.js: [https://grammy.dev/]
- Prisma: [https://www.prisma.io/docs]
- Fly.io: [https://fly.io/docs/]
