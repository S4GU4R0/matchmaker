# Specification: Storage Backend Integration (Notion/Google Drive)

## Overview
This specification defines the technical requirements for integrating Matchmaker with external storage backends (Notion and Google Drive). These backends serve as the "Long-Term Memory" and "Archive" for the system, ensuring data persistence beyond the active database and providing users with a tangible record of their emotional practice.

---

## 1. Notion Integration

Matchmaker uses Notion as a structured, user-accessible database for relationship history.

### 1.1 'Memory Archive' Database
When a memory is transitioned to the **Pruned** state (as defined in `health-and-archiving.md`), it is moved from the primary database to this Notion database.

**Schema:**
| Property Name | Type | Description |
|---------------|------|-------------|
| **Memory Title** | Title | A short summary of the memory content. |
| **Timestamp** | Date | When the original interaction occurred. |
| **Soul ID** | Text | UUID of the agent. |
| **Soul Name** | Text | Display name of the agent. |
| **Content** | Text | Raw summary of the interaction. |
| **Interpretation** | Text | The agent's subjective narrative/feeling about the event. |
| **Weight** | Number | Emotional weight (1-10). |
| **Salience Factor** | Number | Final SF at time of pruning. |
| **Interaction Quality** | Number | Average $q$ for this memory. |
| **Archived At** | Date | When the pruning occurred. |

### 1.2 'Relationship Log' Database
This database tracks the high-level evolution of a relationship. It is updated during every **24-Hour Health Check**.

**Schema:**
| Property Name | Type | Description |
|---------------|------|-------------|
| **Relationship** | Title | Format: "{User} x {Soul Name}" |
| **Status** | Select | active, archived, exited. |
| **Affection** | Number | Current Affection score (0-100). |
| **Trust** | Number | Current Trust score (0-100). |
| **Health Aggregate** | Number | Composite $H$ score. |
| **Intimacy Stage** | Select | Acquaintance, Emergent Trust, Vulnerability, Deep Resonance. |
| **Last Interaction** | Date | Timestamp of the last user message. |
| **Total Memories** | Number | Count of active + receded memories. |

---

## 2. Google Drive Integration

Google Drive is used for storing unstructured data and "embodied" artifacts like agent journals.

### 2.1 File Structure
Files are organized hierarchically to allow for easy navigation and multi-user support.

```
/Matchmaker/
  /Users/
    /{UserId}/
      /Relationships/
        /{SoulId}/
          journal.md
          interaction_traces.jsonl
          soul_profile.json
```

### 2.2 File Formats
- **journal.md (Markdown):**
    - Contains the agent's "private" reflections (Diary entries).
    - Appended when the agent moves to **Stage 3 (Vulnerability)** or higher.
    - Format: `## YYYY-MM-DD\n\n{Internal Thought/Reflections}\n\n---`
- **interaction_traces.jsonl (JSONL):**
    - A technical log of every interaction turn.
    - Each line is a JSON object containing: `{timestamp, role, content, metrics: {q, valence, arousal}}`.
- **soul_profile.json (JSON):**
    - A snapshot of the agent's soul file (traits, archetype, attraction profile) at the time of relationship creation or termination.

---

## 3. Sync & Integration Logic

### 3.1 Sync Triggers
1.  **Daily Health Check:** Triggers an update to the Notion 'Relationship Log' and appends interaction traces for the day.
2.  **Memory Pruning:** Triggers an insert into the Notion 'Memory Archive' and deletes the record from the primary database.
3.  **Exit Protocol (Termination):** Triggers a final sync of all data, marks the Notion status as 'exited', and generates a final `soul_profile.json` snapshot.
4.  **Onboarding:** Creates the initial folder structure in Google Drive and adds the `soul_profile.json`.

### 3.2 Conflict Handling & Reliability
- **Source of Truth:** The Matchmaker primary database (Prisma/SQLite) is the source of truth for all **Active** and **Receded** data.
- **Append-Only:** External backends are treated as append-only. Existing entries in Notion or Google Drive should not be modified by the sync process (with the exception of the 'Relationship Log' status/metrics).
- **Retry Logic:** If an API call to Notion or Google Drive fails, the task should be queued for retry in the next 24-hour cycle. Pruning should not proceed (deletion from primary DB) until the external write is confirmed.

### 3.3 Privacy & Access
- All external storage must be provisioned under a system-controlled service account.
- If the user provides their own API keys (for Notion or Drive), the system should validate permissions before initiating the first sync.
