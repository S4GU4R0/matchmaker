import { MemoryEntry, InteractionQuality } from './types';

export class MemorySystem {
  /**
   * Calculates the initial parameters for a new memory entry.
   */
  static createEntry(
    relationshipId: string,
    content: string,
    interpretation: string,
    weight: number
  ): Omit<MemoryEntry, 'id' | 'createdAt'> {
    const isCore = weight === 10;
    const m = weight / 5;
    const salienceFactor = 2.5 + m;
    
    // Initial interval n=1
    const interval = Math.ceil(1 * m);

    return {
      relationshipId,
      content,
      interpretation,
      weight,
      salienceFactor,
      interval,
      lastReviewed: new Date(),
      isCore,
    };
  }

  /**
   * Updates a memory entry after a review/interaction.
   * Based on modified SM-2 algorithm.
   */
  static reviewEntry(
    entry: MemoryEntry,
    quality: number, // Interaction Quality q (0-5)
    positiveReinforcement: boolean = false
  ): MemoryEntry {
    if (entry.isCore) {
      return { ...entry, lastReviewed: new Date() };
    }

    let { salienceFactor, interval, weight } = entry;

    // 1. Adjust Salience Factor
    // SFn = SFn-1 + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const q = Math.max(0, Math.min(5, quality));
    const sfAdjustment = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    salienceFactor += sfAdjustment;

    if (positiveReinforcement) {
      salienceFactor += 0.2;
    }

    // SF should not fall below a reasonable minimum (e.g., 1.3 as in original SM-2)
    salienceFactor = Math.max(1.3, salienceFactor);

    // 2. Calculate next interval
    // For simplicity, we track 'n' implicitly via intervals or we could store it.
    // Spec says:
    // n=1: I(1) = 1 * m
    // n=2: I(2) = 6 * m
    // n>2: I(n) = I(n-1) * SF
    
    const m = weight / 5;
    
    // We'll estimate 'n' based on current interval
    if (interval <= Math.ceil(1 * m)) {
      // Transition to n=2
      interval = 6 * m;
    } else {
      // n > 2
      interval = interval * salienceFactor;
    }

    return {
      ...entry,
      salienceFactor,
      interval,
      lastReviewed: new Date(),
    };
  }

  /**
   * Handles a boundary violation by boosting memory weight.
   */
  static handleViolation(entry: MemoryEntry): MemoryEntry {
    const newWeight = Math.min(10, entry.weight + 2);
    const isCore = newWeight === 10;
    
    return {
      ...entry,
      weight: newWeight,
      isCore,
      // If it became core or much more significant, we should probably reset/boost SF
      salienceFactor: Math.max(entry.salienceFactor, 2.5 + (newWeight / 5)),
    };
  }

  /**
   * Determines if a memory should be pruned.
   * Memories with w < 5 not referenced within 3 intervals are pruned.
   */
  static shouldPrune(entry: MemoryEntry, currentInteractionCount: number, lastInteractionCount: number): boolean {
    if (entry.isCore || entry.weight >= 5) return false;
    
    // Spec: "Memories with w < 5 that are not referenced within 3 intervals are pruned"
    // This implies we need to track if it WAS referenced.
    // For the sake of the engine, we return a boolean based on time/interval.
    const daysSinceLastReview = (Date.now() - entry.lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastReview > entry.interval * 3) {
      return true;
    }
    
    return false;
  }
}
