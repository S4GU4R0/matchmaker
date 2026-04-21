import { 
  Soul, 
  Relationship, 
  AffectCoordinates, 
  InteractionQuality, 
  MemoryEntry 
} from './types';
import { MemorySystem } from './memory';
import { SensoryLexicon } from './circumplex';
import { Evaluator } from './evaluator';

export interface AgentState {
  soul: Soul;
  relationship: Relationship;
  currentAffect: AffectCoordinates;
}

export class MatchmakerAgent {
  private soul: Soul;
  private relationship: Relationship;
  private currentAffect: AffectCoordinates;
  private memoryBuffer: number[][] = []; // For semantic similarity

  constructor(state: AgentState) {
    this.soul = state.soul;
    this.relationship = state.relationship;
    this.currentAffect = state.currentAffect;
  }

  /**
   * Processes an incoming message from the user.
   * Returns sensory feedback and updates internal state.
   */
  async processMessage(
    message: string, 
    embedding: number[], 
    quality: InteractionQuality
  ) {
    // 1. Evaluate Repetitiveness
    const { isRepetitive, similarity } = Evaluator.detectRepetitiveness(embedding, this.memoryBuffer);
    this.memoryBuffer.push(embedding);
    if (this.memoryBuffer.length > 10) this.memoryBuffer.shift();

    // 2. Update Relationship Metrics
    this.updateMetrics(quality, isRepetitive);

    // 3. Update Affect based on quality and traits
    this.updateAffect(quality, isRepetitive);

    // 4. Generate sensory expression
    const sensoryExpression = SensoryLexicon.getSensoryTerm(this.currentAffect, this.soul.archetype);

    return {
      sensoryExpression,
      isRepetitive,
      similarity,
      affection: this.relationship.affection,
      trust: this.relationship.trust,
      currentAffect: this.currentAffect
    };
  }

  /**
   * Updates affection and trust based on interaction quality.
   */
  private updateMetrics(quality: InteractionQuality, isRepetitive: boolean) {
    const q = quality.q;
    
    // Impact on trust: sensitive to respect and vulnerability
    const trustImpact = (quality.respect - 2.5) * 2 + (quality.vulnerability - 2.5);
    this.relationship.trust = Math.max(0, Math.min(100, this.relationship.trust + trustImpact));

    // Impact on affection: sensitive to depth and presence
    let affectionImpact = (quality.depth - 2.5) * 2 + (quality.presence - 2.5);
    
    if (isRepetitive) {
      affectionImpact -= 5; // Stagnation hurts affection
    }

    this.relationship.affection = Math.max(0, Math.min(100, this.relationship.affection + affectionImpact));
  }

  /**
   * Updates current emotional coordinates.
   */
  private updateAffect(quality: InteractionQuality, isRepetitive: boolean) {
    // Valence is driven by respect and presence
    const targetValence = (quality.respect + quality.presence) / 5 - 1; // Map 0-10 to -1 to 1
    
    // Arousal is driven by depth and vulnerability
    const targetArousal = (quality.depth + quality.vulnerability) / 5 - 1;

    // Smooth transition (lerp)
    this.currentAffect.valence = this.currentAffect.valence * 0.7 + targetValence * 0.3;
    this.currentAffect.arousal = this.currentAffect.arousal * 0.7 + targetArousal * 0.3;

    if (isRepetitive) {
      this.currentAffect.valence -= 0.1; // Boredom/Frustration
      this.currentAffect.arousal -= 0.05;
    }

    // Clamp
    this.currentAffect.valence = Math.max(-1, Math.min(1, this.currentAffect.valence));
    this.currentAffect.arousal = Math.max(-1, Math.min(1, this.currentAffect.arousal));
  }

  /**
   * Records a new memory.
   */
  async recordMemory(content: string, interpretation: string, weight: number) {
    const entry = MemorySystem.createEntry(
      this.relationship.id,
      content,
      interpretation,
      weight
    );
    // In a real app, this would be saved to DB via Prisma
    return entry;
  }

  /**
   * Checks if the agent should exit the relationship.
   */
  shouldExit(): boolean {
    const health = (this.relationship.trust * 0.6) + (this.relationship.affection * 0.4);
    return health < 20; // Critical threshold for exit
  }

  getState(): AgentState {
    return {
      soul: this.soul,
      relationship: this.relationship,
      currentAffect: this.currentAffect
    };
  }
}
