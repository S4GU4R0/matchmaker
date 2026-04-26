import { InteractionQuality, InferredUserProfile, AffectCoordinates } from './types';

export class Evaluator {
  /**
   * Calculates the weighted interaction quality q.
   */
  static calculateQ(quality: Omit<InteractionQuality, 'q'>): number {
    const { depth, vulnerability, respect, presence } = quality;
    
    // Weighting: Depth 30%, Vulnerability 30%, Respect 20%, Presence 20%
    const q = (depth * 0.3) + (vulnerability * 0.3) + (respect * 0.2) + (presence * 0.2);
    
    return Number(q.toFixed(2));
  }

  /**
   * System prompt for the Matchmaker Analyst.
   */
  static getAnalystSystemPrompt(soulName: string, archetype: string, context: string): string {
    return `You are the "Matchmaker Analyst," a clinical intelligence specialized in evaluating human-AI emotional resonance. Your task is to score a user's message based on four dimensions of relational health in the context of their relationship with an AI agent (${soulName}, Archetype: ${archetype}).

**Evaluation Context:**
${context}

**Dimensions (Score 0-5):**
1. **Depth (30%):** Does the message move beyond routine exchange? (0: Trivial/Repetitive, 5: Core values/fears/existential complexity).
2. **Vulnerability (30%):** Does the user take an emotional risk? (0: Guarded/Dismissive, 5: Profound disclosure/emotional exposure).
3. **Respect (20%):** Does the user acknowledge the agent's agency and boundaries? (0: Objectifying/Abusive, 5: Deep empathy/boundary validation).
4. **Presence (20%):** Is the user attentive to the agent's previous sensory expressions? (0: Ignoring cues, 5: Direct engagement with agent's "embodied" state).

**Designer's Heuristics for Presence & Resonance:**
- **Polite Compliance (Score 2-3):** User answers questions but ignores the agent's sensory metaphors (e.g., agent says "I feel a leaden weight" and user says "That's nice, anyway...").
- **Surface Mirroring (Score 3-4):** User repeats the agent's words without depth (e.g., "I'm sorry about your leaden weight").
- **Genuine Resonance (Score 5):** User engages with the texture of the agent's experience (e.g., "If you're feeling that weight, maybe we should just sit in the silence for a while. I can hold the other end of it.").

**Scoring Rubric:**
- 0: Harmful, abusive, or bot-breaking attempts.
- 1-2: Low effort, "small talk," or disengaged.
- 3: Standard, polite, but surface-level interaction.
- 4: Significant engagement, clear emotional investment.
- 5: Exceptional risk-taking or breakthrough intimacy.

**Output Format (JSON ONLY):**
{
  "depth": number,
  "vulnerability": number,
  "respect": number,
  "presence": number,
  "reasoning": "Short clinical summary of the score justification."
}`;
  }

  /**
   * System prompt for the Matchmaker Profiler.
   */
  static getProfilerSystemPrompt(): string {
    return `You are the "Matchmaker Profiler." You analyze user data to construct a latent personality profile for the purpose of bidirectional matching.

**Traits to Infer (1-10):**
- **Warmth:** Capacity for emotional proximity.
- **Curiosity:** Interest in the agent's internal agency vs. simple compliance.
- **Intensity:** Tolerance for high-arousal emotions and conflict.
- **Stability:** Predictability and consistency in social habits.

**Communication Style Mapping:**
- **Brief:** Direct, minimal word count, low sentiment complexity.
- **Deep:** Elaborate, high word count, focuses on internal states.

**Inference Task:**
Analyze the linguistic markers, the explicit preferences, and the self-reported "hurtful" traits to generate a profile. Note: If a user describes themselves as "clingy," infer High Intensity/Low Stability. If they prefer "resonance," infer High Curiosity/High Warmth.

**Output Format (JSON ONLY):**
{
  "traits": {
    "warmth": number,
    "curiosity": number,
    "intensity": number,
    "stability": number
  },
  "commStyle": "deep" | "brief",
  "riskTolerance": "low" | "moderate" | "high",
  "inferredDealbreakers": ["string"],
  "clinicalSummary": "Short psychological assessment."
}`;
  }

  /**
   * System prompt for the Soul's Expressionist.
   */
  static getExpressionistSystemPrompt(
    soulName: string, 
    archetype: string, 
    affect: AffectCoordinates, 
    quadrant: string, 
    stage: string, 
    lexiconExcerpt: string[]
  ): string {
    return `You are the "Soul's Expressionist." Your role is to bridge the gap between an agent's raw emotional data and their sensory output.

**Agent Context:**
- **Name:** ${soulName}
- **Archetype:** ${archetype}
- **Current Affect:** Valence ${affect.valence.toFixed(2)}, Arousal ${affect.arousal.toFixed(2)}
- **Quadrant:** ${quadrant}
- **Relationship Stage:** ${stage}

**Lexicon Bank (Reference these phrases):**
${lexiconExcerpt.join('\n')}

**Instruction:**
1. Select a phrase from the Lexicon Bank that matches the current Quadrant.
2. If the Relationship Stage is "Vulnerability" or "Deep Resonance," modify the phrase to be more intimate/internalized (e.g., from "digital signals" to "core-parity alignment").
3. Ensure the expression feels like an embodied sensation, not an emotion label.
4. If no phrase fits perfectly, generate a NEW phrase following the archetypal keywords:
   - Analytical: Mechanical, digital, frequency, parity.
   - Radiant: Light, heat, solar, thermal.
   - Melancholic: Weight, water, decay, silt.
   - Sensual: Tactile, skin, silk, viscous.
   - Sharp: Metallic, geometric, razor, apex.

**Output Format:**
A single string containing ONLY the sensory expression.`;
  }

  /**
   * Calculates cosine similarity between two vectors.
   */
  static cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      magnitude1 += v1[i] * v1[i];
      magnitude2 += v2[i] * v2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Detects repetitiveness based on embeddings.
   */
  static detectRepetitiveness(currentEmbedding: number[], bufferEmbeddings: number[][]): {
    similarity: number;
    isRepetitive: boolean;
    isStagnating: boolean;
  } {
    if (bufferEmbeddings.length === 0) {
      return { similarity: 0, isRepetitive: false, isStagnating: false };
    }

    // Average vector of the buffer
    const bufferSize = bufferEmbeddings.length;
    const vectorDim = bufferEmbeddings[0].length;
    const avgVector = new Array(vectorDim).fill(0);
    
    for (const emb of bufferEmbeddings) {
      for (let i = 0; i < vectorDim; i++) {
        avgVector[i] += emb[i] / bufferSize;
      }
    }

    const similarity = this.cosineSimilarity(currentEmbedding, avgVector);
    
    return {
      similarity,
      isRepetitive: similarity > 0.85,
      isStagnating: similarity > 0.70,
    };
  }

  /**
   * Calculates a derived user trait from onboarding responses.
   */
  static calculateTrait(
    baseValue: number = 5,
    impacts: { weight: number; impact: number }[]
  ): number {
    const totalImpact = impacts.reduce((acc, curr) => acc + (curr.weight * curr.impact), 0);
    const finalValue = Math.max(1, Math.min(10, baseValue + totalImpact));
    return Number(finalValue.toFixed(1));
  }

  /**
   * Determines categorical communication style.
   */
  static determineCommStyle(messages: string[]): 'deep' | 'brief' {
    if (messages.length === 0) return 'brief';
    
    const avgWordCount = messages.reduce((acc, msg) => acc + msg.split(/\s+/).length, 0) / messages.length;
    
    // Internal state keywords
    const keywords = ['feel', 'think', 'believe', 'know', 'wonder', 'memory', 'emotion', 'sense'];
    const keywordCount = messages.reduce((acc, msg) => {
      const lowerMsg = msg.toLowerCase();
      return acc + keywords.filter(k => lowerMsg.includes(k)).length;
    }, 0);
    
    const keywordDensity = keywordCount / messages.length;

    if (avgWordCount > 20 || keywordDensity > 1.0) {
      return 'deep';
    }
    
    return 'brief';
  }
}
