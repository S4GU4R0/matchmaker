import { 
  Soul, 
  InferredUserProfile, 
  MatchmakerJob, 
  Archetype, 
  TraitPalette 
} from './types';
import { SoulGenerator } from './generator';

export class Matchmaker {
  /**
   * Calculates User -> Agent Score (Su)
   */
  static calculateSu(soul: Omit<Soul, 'id' | 'createdAt' | 'updatedAt'>, preferredSensation: string): number {
    const requirements: Partial<Record<keyof TraitPalette, number>> = {};
    
    switch (preferredSensation) {
      case 'Resonance':
        requirements.warmth = 7;
        requirements.vulnerability = 7;
        break;
      case 'Friction':
        requirements.agency = 8;
        // For stability <= 4, we'll map it to a "target" of 2 for scoring
        requirements.stability = 2; 
        break;
      case 'Stability':
        requirements.stability = 8;
        requirements.warmth = 5;
        break;
      case 'Intensity':
        requirements.complexity = 8;
        requirements.agency = 7;
        break;
      default:
        return 50; // Neutral
    }

    let totalScore = 0;
    let count = 0;

    for (const [trait, target] of Object.entries(requirements)) {
      const actual = soul.traits[trait as keyof TraitPalette];
      // Simple similarity: 100 - abs(diff) * 10 (capped at 0)
      const score = Math.max(0, 100 - Math.abs(actual - target) * 10);
      totalScore += score;
      count++;
    }

    return count > 0 ? totalScore / count : 50;
  }

  /**
   * Calculates Agent -> User Score (Sa)
   */
  static calculateSa(soul: Omit<Soul, 'id' | 'createdAt' | 'updatedAt'>, userProfile: InferredUserProfile): number {
    const profile = soul.attractionProfile;
    
    // Check dealbreakers
    for (const db of profile.dealbreakers) {
      if (userProfile.dealbreakers.includes(db)) return 0;
    }

    let weightedScore = 0;
    let totalImportance = 0;

    for (const [trait, pref] of Object.entries(profile.traitPreferences)) {
      const userValue = userProfile.traits[trait as keyof InferredUserProfile['traits']] as number;
      if (userValue === undefined) continue;

      const [min, max] = pref.idealRange;
      let score = 0;

      if (userValue >= min && userValue <= max) {
        score = 100;
      } else {
        const diff = Math.min(Math.abs(userValue - min), Math.abs(userValue - max));
        score = Math.max(0, 100 - (diff * 15));
      }

      weightedScore += score * pref.importance;
      totalImportance += pref.importance;
    }

    return totalImportance > 0 ? weightedScore / totalImportance : 50;
  }

  /**
   * Calculates Mutual Compatibility Score (Sm)
   */
  static calculateSm(su: number, sa: number): number {
    return (su * 0.45) + (sa * 0.55);
  }

  /**
   * Runs the candidate generation loop.
   */
  static async findMatches(
    userProfile: InferredUserProfile, 
    iterations: number = 20
  ): Promise<Omit<Soul, 'id' | 'createdAt' | 'updatedAt'>[]> {
    const matches: { soul: any; sm: number }[] = [];
    const preferredSensation = userProfile.preferences.preferredSensations[0] || 'Resonance';

    let currentSmThreshold = 55;

    for (let i = 0; i < iterations; i++) {
      // Every 8 iterations, slightly relax the SM threshold if we haven't found enough matches
      if (i > 0 && i % 8 === 0 && matches.length < 3) {
        currentSmThreshold = Math.max(45, currentSmThreshold - 5);
      }

      const candidate = SoulGenerator.generateCandidate();
      const su = this.calculateSu(candidate, preferredSensation);
      const sa = this.calculateSa(candidate, userProfile);
      const sm = this.calculateSm(su, sa);

      // Never relax Sa (agent interest) or dealbreakers (Sa becomes 0)
      if (sm >= currentSmThreshold && sa >= 50) {
        matches.push({ soul: candidate, sm });
      }

      if (matches.length >= 3) break;
    }

    // Sort by Sm descending
    return matches.sort((a, b) => b.sm - a.sm).map(m => m.soul);
  }

  /**
   * Calculates the current phase and estimated time for a job.
   */
  static getJobStatus(createdAt: Date): { phase: string, progress: number, timeRemaining: string } {
    const elapsedMs = Date.now() - createdAt.getTime();
    const totalMs = 24 * 60 * 60 * 1000;
    const progress = Math.min(100, (elapsedMs / totalMs) * 100);

    const hoursElapsed = elapsedMs / (1000 * 60 * 60);

    let phase = 'reviewing';
    if (hoursElapsed >= 20) phase = 'finalizing';
    else if (hoursElapsed >= 12) phase = 'refining';
    else if (hoursElapsed >= 4) phase = 'searching';

    const remainingMs = Math.max(0, totalMs - elapsedMs);
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      phase,
      progress,
      timeRemaining: `${hours}h ${minutes}m`
    };
  }
}
