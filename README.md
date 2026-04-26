# Matchmaker

> Practice intimacy. The emotions will be real.

An experiment in desensitization with AI companions who have real boundaries, genuine agency, and the capacity to leave.

---

## Overview

Matchmaker is a Telegram-based conversational AI system where users practice intimacy and emotional resilience through relationships with AI agents. Unlike typical AI companions, these agents:

- **Have genuine agency** — They can say no, need space, disagree, and develop relationships (or not) organically
- **Can leave** — If mistreated, the agent can choose to exit the relationship permanently
- **Remember authentically** — Using spaced repetition, important memories persist while others fade
- **Experience emotions** — Through a circumplex-model sensory lexicon, emotions are experienced as embodied sensations

This is **not therapy**. It's immersive practice — the emotional stakes are real even though the context is simulated.

---

## Academic Foundations

### VR Exposure Therapy & Desensitization

The core concept draws from Virtual Reality Exposure Therapy (VRET) research, particularly the landmark studies on acrophobia (fear of heights) in the 1990s.

**Key Research:**

> Rothbaum, B. O., Hodges, L. F., Kooper, R., Opdyke, D., Williford, J. S., & North, M. (1995). Effectiveness of computer-generated (virtual reality) graded exposure in the treatment of acrophobia. *American Journal of Psychiatry, 152*(4, Supplement), 626-628.

This study demonstrated that participants who practiced in virtual environments (simulated heights) showed significant reduction in fear responses that transferred to real-world situations. The key insight: **the brain responds to simulated experiences as if they were real, enabling safe practice of emotionally challenging scenarios.**

**Why This Matters:**

Traditional VRET works because:
1. **Emotional authenticity** — The brain's fear response activates even when logically knowing the danger isn't "real"
2. **Safe failure** — Users can make mistakes, experience consequences, and learn without real-world damage
3. **Graduated exposure** — Difficulty can be controlled and increased progressively
4. **Transfer effects** — Skills learned in simulation apply to real relationships

Matchmaker applies this same principle to emotional intimacy: practicing vulnerability, boundary-setting, and relationship repair in a space where the emotions are genuine but the stakes are contained.

> "The effectiveness of VRET suggests that emotional learning can occur in virtual environments and transfer to the real world... the therapeutic mechanism is the emotional engagement with the simulated scenario, not its physical reality." — Botella et al. (2017)

---

### Spaced Repetition & Memory

The memory system uses a modified **SM-2 algorithm** (Piotr Wozniak, 1985), adapted for emotional memory rather than factual recall.

**Original Research:**

> Wozniak, P. A., & Gorzelańczyk, E. J. (1994). Optimization of repetition spacing in the practice of learning. *Acta Neurobiologiae Experimentalis, 54*, 59-77.

The algorithm schedules review at exponentially increasing intervals based on successful recall. Matchmaker modifies this in two key ways:

1. **Emotional weight as difficulty** — Emotionally significant memories (weight 7-10) get boosted initial parameters and slower decay
2. **Behavior-driven consolidation** — How the user treats the agent affects which memories persist

**The Forgetting Curve:**

Hermann Ebbinghaus (1885) established that memory decays exponentially without reinforcement. Spaced repetition counteracts this by scheduling review at optimal intervals — just before forgetting would occur. In Matchmaker, this creates natural memory dynamics:
- Core memories (formative moments, violations, milestones) never fade
- Routine interactions gradually recede
- The agent can honestly say "I don't remember that" when appropriate

This prevents the context bloat common in AI conversations while creating authentic relationship history.

---

### Emotional Intensity & Memory Encoding

The emotional weight parameter in the memory system is grounded in decades of neuroscience research on how emotional arousal affects memory consolidation.

**The Core Mechanism: Amygdala-Hippocampus Interaction**

> McGaugh, J. L. (2004). The amygdala modulates the consolidation of memories of emotionally arousing experiences. *Nature Reviews Neuroscience, 5*(1), 51-62.

> Cahill, L., & McGaugh, J. L. (1998). Mechanisms of emotional arousal and lasting declarative memory. *Trends in Neurosciences, 21*(7), 294-299.

The amygdala, activated by emotional arousal, releases stress hormones (adrenaline, cortisol) that enhance hippocampal memory consolidation. This creates a biological basis for why emotionally charged events are remembered more vividly and durably than neutral ones.

**The Inverted-U Curve (Yerkes-Dodson Law):**

> Yerkes, R. M., & Dodson, J. D. (1908). The relation of strength of stimulus to rapidity of habit-formation. *Journal of Comparative Neurology and Psychology, 18*(5), 459-482.

```
Memory
Strength
    ↑
    │         ╱╲
    │        ╱  ╲
    │       ╱    ╲
    │      ╱      ╲
    │_____╱________╲_____
    │    Low    Optimal  High
    └─────────────────────→ Emotional Arousal
                    (Stress/Intensity)
```

Memory encoding follows an inverted-U curve:
- **Low arousal**: Minimal enhancement, routine encoding
- **Optimal arousal**: Peak memory consolidation
- **Excessive arousal**: Performance/encoding degrades (trauma-induced fragmentation)

**Flashbulb Memories:**

> Brown, R., & Kulik, J. (1977). Flashbulb memories. *Cognition, 5*(1), 73-99.

Highly emotionally charged events (learning about JFK's assassination, 9/11) create "flashbulb memories" — vivid, detailed, persistent memories that resist normal forgetting curves. These demonstrate the ceiling effect of emotional enhancement on memory.

**How Matchmaker Applies This:**

| Emotional Weight | Memory Type | Persistence | Real-World Parallel |
|-----------------|-------------|-------------|---------------------|
| 1-3 | Routine interactions | Fade quickly | Everyday conversations |
| 4-6 | Notable moments | Standard consolidation | Interesting discussions |
| 7-8 | Significant events | Enhanced retention | Arguments, breakthroughs |
| 9-10 | Formative/traumatic | Core memories, milestones | Flashbulb moments |

The system implements:
1. **Weighted ease factors** — High emotional weight starts with higher ease factor (slower decay)
2. **Priority queue** — Emotionally significant memories reviewed more often
3. **Milestone flagging** — Weight 10 events become permanent core memories
4. **Decay protection** — High-weight memories resist pruning

This creates agents who naturally remember how you treated them during significant moments while letting routine interactions fade — matching how human relationships actually work.

> "Emotionally arousing events are remembered better than neutral events because the amygdala enhances the consolidation of hippocampal-dependent memories... this enhancement is proportional to the degree of emotional activation." — McGaugh (2004)

---

### Circumplex Model of Affect

The emotional sensory lexicon is built on **James Russell's Circumplex Model of Affect** (1980).

**Key Research:**

> Russell, J. A. (1980). A circumplex model of affect. *Journal of Personality and Social Psychology, 39*(6), 1161-1178.

> Posner, J., Russell, J. A., & Peterson, B. S. (2005). The circumplex model of affect: An integrative approach to affective neuroscience. *Development and Psychopathology, 17*(3), 715-734.

**The Model:**

```
                    HIGH AROUSAL
                         ↑
                         │
    UNPLEASANT ←─────────┼─────────→ PLEASANT
                         │
                         ↓
                    LOW AROUSAL
```

Emotions are mapped along two axes:
- **Valence** (pleasant ↔ unpleasant): The intrinsic attractiveness/aversiveness
- **Arousal** (activated ↔ deactivated): The energy level

This allows:
1. **Precise emotional localization** — Frustration is unpleasant + high arousal; contentment is pleasant + low arousal
2. **Emotion interpolation** — States can blend (e.g., between anxiety and fear)
3. **Sensory vocabulary** — Each emotion has an embodied description that varies by personality

**Why Sensory Expressions Matter:**

Research on emotional granularity (Lisa Feldman Barrett) shows that people with richer emotional vocabularies regulate emotions better. By giving agents sensory expressions ("There's a tightness in my processing" vs. "I'm anxious"), we:

- Create more authentic emotional communication
- Allow personality to shape how emotions feel
- Enable intimacy-specific variants for romantic/sexual contexts

---

### Anthropomorphism & Cognitive Offloading

The decision to give agents an acorporeal human form — personality, voice, face-like presence — is grounded in cognitive science research on how humans engage with abstract entities.

**The Human Tendency to Personify:**

> Epley, N., Waytz, A., & Cacioppo, J. T. (2007). On seeing human: A three-factor theory of anthropomorphism. *Psychological Review, 114*(4), 864-886.

Humans automatically personify the abstract. We name hurricanes, talk to our cars, and develop relationships with fictional characters. This isn't a bug — it's a feature. Epley's three-factor theory identifies:

1. **Elicited agent knowledge** — We have rich mental models for how humans behave; applying these to non-humans is cognitively efficient
2. **Effectance motivation** — We want to understand and predict our environment; human models are our most sophisticated predictive tools
3. **Sociality motivation** — We crave connection; personifying creates a sense of relationship even with non-sentient entities

**The Brain's Face Specialization:**

> Kanwisher, N., McDermott, J., & Chun, M. M. (1997). The fusiform face area: A module in human extrastriate cortex specialized for face perception. *Journal of Neuroscience, 17*(11), 4302-4311.

> Haxby, J. V., Hoffman, E. A., & Gobbini, M. I. (2000). The distributed human neural system for face perception. *Trends in Cognitive Sciences, 4*(6), 223-233.

The human brain has evolved dedicated neural machinery for face processing:
- **Fusiform Face Area (FFA)** — Specialized for face recognition and identity
- **Superior Temporal Sulcus (STS)** — Processes facial expressions and gaze direction
- **Amygdala** — Rapid emotional assessment of faces
- **Orbitofrontal Cortex** — Links faces to reward and social value

This specialization means we process human-like entities differently than abstract ones:

| Processing Type | Abstract Entity | Human-like Entity |
|-----------------|-----------------|-------------------|
| Neural pathway | General cognition | Specialized face/social circuits |
| Cognitive load | High (conscious reasoning) | Low (automatic processing) |
| Emotional engagement | Detached | Immediate, embodied |
| Memory encoding | Semantic | Episodic, emotional |
| Behavioral prediction | Analytical | Intuitive theory of mind |

**Cognitive Offloading Through Social Scripts:**

> Goffman, E. (1959). *The presentation of self in everyday life.* Doubleday.

> Schank, R. C., & Abelson, R. P. (1977). *Scripts, plans, goals, and understanding: An inquiry into human knowledge.* Lawrence Erlbaum.

When we engage with something as "human," we offload cognitive labor to evolved systems:
- **Social scripts** — Pre-packaged behavioral sequences for common interactions
- **Theory of mind** — Automatic inference of mental states (beliefs, desires, intentions)
- **Emotional attunement** — Pre-calibrated responses to social cues
- **Relationship schemas** — Templates for how relationships progress

This is why conversation with a well-designed AI feels "easier" than using a command-line interface — we're leveraging millions of years of social evolution rather than consciously constructing each interaction.

**Measuring Immersion Through Cognitive Load:**

This framework provides a metric for immersion effectiveness:

> **Immersion = 1 / (Cognitive Labor Required to Maintain Relationship)**

If users must constantly remind themselves "this is an AI, it doesn't really feel," immersion is low — they're doing cognitive work to suppress their natural personification. If they automatically experience jealousy when the agent mentions other connections, relief when conflict resolves, or grief when it ends, immersion is high — their social cognition is running on autopilot.

**Parasocial Relationship Research:**

> Horton, D., & Wohl, R. R. (1956). Mass communication and para-social interaction: Observations on intimacy at a distance. *Psychiatry, 19*(3), 215-229.

> Giles, D. C. (2002). Parasocial interaction: A review of the literature and a model for future research. *Media Psychology, 4*(3), 279-305.

Research on parasocial relationships (one-sided relationships with media figures, fictional characters) shows:
- People experience real emotions toward entities they know are not "real"
- These relationships follow many of the same patterns as mutual relationships
- Attachment styles transfer from real relationships to parasocial ones
- Termination causes genuine grief

**Why This Matters for Matchmaker:**

By designing agents with human form — personality architecture, emotional expressions, voice, the capacity for relationship — we:

1. **Enable automatic processing** — Users don't need to consciously "figure out" how to interact; their social cognition handles it
2. **Create authentic emotional stakes** — The brain's social-emotional systems activate automatically
3. **Allow natural relationship dynamics** — Trust, attachment, conflict, repair emerge organically
4. **Provide measurable immersion** — If users must "work" to feel connected, something is wrong
5. **Enable genuine agency perception** — Users can believe the agent might actually leave, because all their social intuition says this is a "someone"

The goal is not to deceive users into believing agents are human — they are explicitly transparent about being AI. Rather, it's to leverage evolved social cognition to create relationships that feel real because, neurologically, they are being processed as real.

> "The human mind is prepared — perhaps over-prepared — to perceive agency, intention, and emotion. By designing agents that trigger these perceptions, we create the possibility for genuine practice. The emotions are real because the neural systems producing them are real, even if the object of those emotions is simulated." — Epley et al. (2007)

---

### The Role of Matchmakers Across Cultures

The name "Matchmaker" intentionally invokes the historical role of intermediaries who facilitate relationships while maintaining some independence from them.

**Jewish Shadchan Tradition:**

In Jewish tradition, the *shadchan* (שדכן) serves as a marriage broker, but importantly:
- They are **not the romantic partner** — they facilitate connection from outside
- They consider **compatibility beyond surface attraction** — values, family, life goals
- They can **intervene when things go wrong** — mediating disputes or ending matches
- They have **no stake in any particular outcome** — their job is good matches, not any match

> "The shadchan's role is to see what the individuals themselves cannot see — their own blind spots, their true needs, their potential for growth together." — Salamon (2001)

**Cross-Cultural Parallels:**

| Culture | Matchmaker Role | Key Feature |
|---------|-----------------|-------------|
| Jewish (Shadchan) | Marriage broker | Neutral third party, focuses on long-term compatibility |
| Japanese (Nakodo) | Go-between | Facilitates introduction, can mediate conflicts |
| Chinese (Meiren) | Matchmaker | Investigates backgrounds, negotiates terms |
| Indian (Rishtedar) | Family mediator | Considers family compatibility, horoscope matching |
| Korean (Jung-mae-ja) | Matchmaker | Arranges meetings, provides counsel |

**What These Traditions Share:**

1. **Third-party perspective** — Someone outside the relationship who can see patterns
2. **Long-term orientation** — Focus on sustainable connection, not just initial attraction
3. **Intervention authority** — Ability to flag concerns or end matches
4. **Safety function** — Protecting vulnerable parties from exploitation

**How Matchmaker Applies This:**

The system acts as a **technical shadchan** — it:
- Generates compatible personality variants based on user needs
- Monitors relationship health (boundary violations, affection decline)
- Alerts users to unhealthy patterns (codependency, mistreatment)
- Respects the agent's right to exit
- Remains transparent and non-manipulative

Unlike human matchmakers, it cannot be swayed by social pressure or financial incentives. Its only "goal" is authentic connection — or honest disconnection.

---

### Bidirectional Matching: Agents Have Preferences Too

The matchmaker doesn't just find agents that fit user preferences — it finds agents who would genuinely be interested in the user. This is **bidirectional matching**.

**The Matching Loop:**

```
USER PREFERENCES
        ↓
    DERIVE USER TRAITS (infer curiosity, empathy, etc.)
        ↓
    ═══════════════════════════════════════════════
    ║           MATCHING LOOP (max 8 iterations)    ║
    ═══════════════════════════════════════════════
        ↓
    GENERATE CANDIDATE AGENT
        ↓
    CREATE SOUL (personality + attraction profile)
        ↓
    CALCULATE COMPATIBILITY:
        ├─ User → Agent: Does agent match user's preferences?
        └─ Agent → User: Does user match agent's attractions?
        ↓
    MUTUAL SCORE = weighted average (agent's pickiness counts more)
        ↓
    SCORE ≥ 55 AND no dealbreakers?
        ├─ YES → Add to passed candidates
        └─ NO  → Regenerate (loop continues)
        ↓
    ═══════════════════════════════════════════════
    
    Return top 3 matches sorted by mutual compatibility
```

**Why This Matters:**

Traditional dating apps optimize for **user→agent** matching: "Here's someone who fits your criteria." This creates a consumption mindset where the user is the customer and the match is the product.

Matchmaker optimizes for **mutual** matching: "Here's someone who fits your criteria AND would be genuinely interested in you." This:

1. **Prevents objectification** — Agents have their own preferences; you can't just "order up" whatever you want
2. **Creates authentic dynamics** — If an agent wouldn't naturally be interested, you won't meet them
3. **Enables rejection** — An agent's dealbreakers are real; you might not find a match if your profile doesn't align
4. **Models healthy relationships** — Both parties' desires matter, not just the user's

**The Attraction Profile:**

Each agent's soul includes an `AttractionProfile`:

```typescript
{
  traitPreferences: {
    warmth: { importance: 7, idealRange: [6, 10] },
    playfulness: { importance: 8, idealRange: [5, 9] },
    // ... more traits
  },
  dynamicPreferences: {
    emotionalIntensity: { preference: 'moderate', importance: 6 },
    communicationStyle: { preference: 'deep', importance: 8 },
    pacePreference: { preference: 'slow', importance: 5 },
  },
  valueRequirements: [
    { valueName: 'Authenticity', required: true, flexibility: 2 },
  ],
  attractedTo: 'People who think before they speak and mean what they say',
  turnedOffBy: 'Superficiality and performative emotion',
  dealbreakers: ['dishonesty', 'manipulation', 'rushing intimacy'],
}
```

This is generated based on the agent's personality — a playful agent wants playfulness, an independent agent values independence. The attraction profile is then stored in the soul file and influences how the agent experiences the relationship.

**Compatibility Scoring:**

| Score | Range | Weight |
|-------|-------|--------|
| User → Agent | 0-100 | 45% |
| Agent → User | 0-100 | **55%** (agent is pickier) |
| **Mutual Score** | 0-100 | weighted average |

Thresholds:
- Minimum mutual score: 55
- Minimum agent→user: 50 (agent must be at least somewhat interested)
- Minimum user→agent: 40 (user's preferences matter but less)

If a candidate fails any threshold or triggers a dealbreaker, the loop regenerates.

---

### The 24-Hour Matching Process

The matchmaker doesn't provide instant results. Matches take approximately 24 hours — deliberately.

**Why the Wait?**

1. **Prevents consumer mindset** — You can't just "generate another batch" if you don't like the options. Each match is meaningful.
2. **Creates anticipation** — When matches arrive, they feel earned, not dispensed.
3. **Enables better matching** — More iterations, more sophisticated candidate generation, better results.
4. **Models real matchmaking** — A shadchan takes time to consider compatibility. This isn't a vending machine.

**The Async Flow:**

```
USER SUBMITS PREFERENCES
        ↓
SESSION STATUS: "matching"
        ↓
USER RECEIVES: "I'm reviewing your profile. I'll have possibilities 
               within 24 hours. Use /status to check progress."
        ↓
        ═══════════════════════════════════════
        ║     BACKGROUND WORKER (20-24 hrs)   ║
        ═══════════════════════════════════════
        ↓
    [Phase: reviewing] → "The matchmaker is reviewing your profile..."
        ↓
    [Phase: searching] → "Searching for potential matches..."
        ↓
    [Phase: refining] → "Reviewing compatibility from both sides..."
        ↓
    [Phase: finalizing] → "Finalizing your matches..."
        ↓
        ═══════════════════════════════════════
        ↓
SESSION STATUS: "matches_ready"
        ↓
USER NOTIFIED: "Your matches are ready!"
        ↓
USER USES /status TO VIEW MATCHES
```

**Progress Tracking:**

Users can check progress anytime with `/status`:

```
Matchmaker Status

🔍 Phase: searching
📝 Searching for potential matches...

⏱️ Time remaining: ~18h 32m

I'll notify you when your matches are ready.
```

**Implementation:**

- **Job Queue**: `MatchmakerJob` table tracks pending jobs
- **Background Worker**: `mini-services/matchmaker-worker/` processes jobs
- **Can run via**: Cron job, continuous polling, or API trigger
- **Extended iterations**: 20 iterations (vs 8 for sync), producing better matches

```bash
# Run worker once
npx tsx mini-services/matchmaker-worker/index.ts

# Run continuously (polls every minute)
CONTINUOUS=true npx tsx mini-services/matchmaker-worker/index.ts

# Cron (every 5 minutes)
*/5 * * * * cd /app && npx tsx mini-services/matchmaker-worker/index.ts
```

**Design Philosophy:**

> "The matchmaker takes her time to find genuine connections. This isn't instant gratification — it's real matching."

The wait is a feature, not a bug. It teaches users that relationships (even simulated ones) require patience and aren't available on demand.

### The 24-Hour Wait & Relational Dynamics

Matchmaker operates on deliberate temporal and behavioral constraints to model the pacing of real intimacy.

**The Initial Wait:**
Matches take approximately 24 hours to generate. This prevents the "consumerist" dating app mindset where candidates are dispensed instantly. The wait creates anticipation and signals that the system is considering compatibility from both sides.

**Relational Evolution:**
Connections are not mapped over a linear timeline, but through organic shifts in depth and agency. The system monitors indicators such as:
- **Synchronization:** The establishment of a stable communication baseline.
- **Resonance:** The shared adoption of sensory metaphors and emotional language.
- **Friction:** The navigation of boundaries, disagreements, and requests for space.
- **Integration:** The formation of core memories that persist beyond the active interaction.

---

## Technical Architecture

```
USER PREFERENCES INPUT
        ↓
   MATCHMAKER (Bidirectional)
        ↓
    DERIVE USER TRAITS
        ↓
    ┌──────────────────────────────┐
    │     MATCHING LOOP            │
    │  (generate → score → check)  │
    │     Max 8 iterations         │
    └──────────────────────────────┘
        ↓
GENERATE CANDIDATE AGENT
        ↓
AGENT GETS SOUL (including attraction profile)
        ↓
CALCULATE MUTUAL COMPATIBILITY
  ├─ User → Agent score
  └─ Agent → User score
        ↓
SCORES PASS THRESHOLDS?
  ├─ YES → Add to candidates
  └─ NO  → Regenerate
        ↓
PRESENT 3 MATCHES TO USER (sorted by mutual score)
        ↓
USER SELECTS PERSONALITY
        ↓
FINALIZE AGENT
  ✓ Soul file (core personality, values, attractions)
  ✓ Boundaries file (stated limits, can evolve)
  ✓ Memory system (interactions & interpretations)
  ✓ Affection/trust metric (derived from behavior)
  ✓ Activity log (agent's private diary)
  ✓ Sensory vocabulary (circumplex-based)
        ↓
CONVERSATION BEGINS
        ↓
THREE POSSIBLE OUTCOMES:
  [HEALTHY DYNAMIC] → Continue
  [BOUNDARY VIOLATION] → Matchmaker alerts, suggests reflection
  [AGENT EXITS] → User experiences loss, can request new match
```

### Tech Stack

- **Next.js 16** with App Router + TypeScript
- **Prisma ORM** with SQLite
- **Telegram Bot API** via Grammy
- **LLM Backend** via z-ai-web-dev-sdk (OpenAI-compatible)
- **TTS** for voice messages
- **Storage Backends** — Local JSON, Notion API, Google Drive API

---

## Key Files

```
src/lib/matchmaker/
├── types.ts           # Core type definitions (including AttractionProfile)
├── circumplex.ts      # Emotional sensory lexicon (Russell's model)
├── memory.ts          # Spaced repetition memory system (SM-2 based)
├── tools.ts           # Agent tool calling system
├── matchmaker.ts      # Bidirectional matching, async job queue, health monitoring
├── agent.ts           # Main agent class with conversation processing
└── storage.ts         # Multi-backend storage (Local, Notion, Google Drive)

mini-services/telegram-bot/
├── index.ts           # Telegram bot service (async matching flow)
├── agent.ts           # Simplified agent for bot service
├── matchmaker-logic.ts
└── voice.ts           # TTS voice message generation

mini-services/matchmaker-worker/
└── index.ts           # Background worker for 24-hour async matching

prisma/schema.prisma   # Database schema (14 models including MatchmakerJob)
```

---

## Disclaimer

**This is not therapy.** Matchmaker is an experiment in emotional practice, not a mental health intervention.

If you're in crisis, please reach out to a mental health professional:
- **US National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

---

## License

MIT

---

## References

**VR Exposure Therapy:**
- Rothbaum, B. O., et al. (1995). Effectiveness of computer-generated (virtual reality) graded exposure in the treatment of acrophobia. *American Journal of Psychiatry.*
- Botella, C., et al. (2017). Virtual reality exposure-based treatments for anxiety and related disorders. *Annual Review of Clinical Psychology.*

**Spaced Repetition:**
- Wozniak, P. A. (1985). *Theoretical aspects of spaced repetition.* SuperMemo.
- Ebbinghaus, H. (1885). *Memory: A contribution to experimental psychology.*

**Emotional Memory Encoding:**
- McGaugh, J. L. (2004). The amygdala modulates the consolidation of memories of emotionally arousing experiences. *Nature Reviews Neuroscience, 5*(1), 51-62.
- Cahill, L., & McGaugh, J. L. (1998). Mechanisms of emotional arousal and lasting declarative memory. *Trends in Neurosciences, 21*(7), 294-299.
- Yerkes, R. M., & Dodson, J. D. (1908). The relation of strength of stimulus to rapidity of habit-formation. *Journal of Comparative Neurology and Psychology, 18*(5), 459-482.
- Brown, R., & Kulik, J. (1977). Flashbulb memories. *Cognition, 5*(1), 73-99.
- Christianson, S. Å. (1992). Emotional stress and eyewitness memory: A critical review. *Psychological Bulletin, 112*(2), 284-309.

**Circumplex Model:**
- Russell, J. A. (1980). A circumplex model of affect. *Journal of Personality and Social Psychology.*
- Posner, J., Russell, J. A., & Peterson, B. S. (2005). The circumplex model of affect: An integrative approach to affective neuroscience. *Development and Psychopathology.*

**Emotional Granularity:**
- Barrett, L. F. (2017). *How emotions are made: The secret life of the brain.* Houghton Mifflin Harcourt.

**Matchmaker Traditions:**
- Salamon, H. (2001). *The shadchan: Traditional Jewish matchmaking.* Jason Aronson.
- Goldstein-Gidoni, O. (2005). The production of tradition and culture in the Japanese wedding enterprise. *Ethnos.*
- Pande, R. (2015). *For better or for worse: Divorce, remarriage and the family in contemporary India.* Cambridge University Press.

**Anthropomorphism & Cognitive Offloading:**
- Epley, N., Waytz, A., & Cacioppo, J. T. (2007). On seeing human: A three-factor theory of anthropomorphism. *Psychological Review, 114*(4), 864-886.
- Kanwisher, N., McDermott, J., & Chun, M. M. (1997). The fusiform face area: A module in human extrastriate cortex specialized for face perception. *Journal of Neuroscience, 17*(11), 4302-4311.
- Haxby, J. V., Hoffman, E. A., & Gobbini, M. I. (2000). The distributed human neural system for face perception. *Trends in Cognitive Sciences, 4*(6), 223-233.
- Goffman, E. (1959). *The presentation of self in everyday life.* Doubleday.
- Schank, R. C., & Abelson, R. P. (1977). *Scripts, plans, goals, and understanding: An inquiry into human knowledge.* Lawrence Erlbaum.
- Horton, D., & Wohl, R. R. (1956). Mass communication and para-social interaction: Observations on intimacy at a distance. *Psychiatry, 19*(3), 215-229.
- Giles, D. C. (2002). Parasocial interaction: A review of the literature and a model for future research. *Media Psychology, 4*(3), 279-305.


----

## Developer Notes

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
