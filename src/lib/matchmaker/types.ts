export type Archetype = 'Analytical' | 'Radiant' | 'Melancholic' | 'Sensual' | 'Sharp';

export interface TraitPalette {
  warmth: number;       // 0-10
  complexity: number;   // 0-10
  agency: number;       // 0-10
  vulnerability: number; // 0-10
  stability: number;     // 0-10
}

export interface TraitPreference {
  importance: number;
  idealRange: [number, number];
}

export interface AttractionProfile {
  traitPreferences: Record<string, TraitPreference>;
  dealbreakers: string[];
  attractedTo: string;
  turnedOffBy: string;
}

export interface Boundary {
  id: string;
  soulId: string;
  type: 'hard' | 'soft' | 'evolving';
  content: string;
  isViolated: boolean;
  violationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Soul {
  id: string;
  name: string;
  archetype: Archetype;
  traits: TraitPalette;
  lexiconFavor: string;
  appearance?: string;
  interests?: string[];
  attractionProfile: AttractionProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEntry {
  id: string;
  relationshipId: string;
  content: string;
  interpretation: string;
  weight: number;         // 1-10
  salienceFactor: number; // The "EF" equivalent
  interval: number;       // Days until "forgotten"
  lastReviewed: Date;
  isCore: boolean;        // If weight == 10
  createdAt: Date;
}

export interface Relationship {
  id: string;
  userId: string;
  soulId: string;
  affection: number;      // 0-100
  trust: number;          // 0-100
  status: 'active' | 'archived' | 'exited';
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractionQuality {
  q: number; // 0-5
  depth: number;
  vulnerability: number;
  respect: number;
  presence: number;
}

export interface InferredUserProfile {
  traits: {
    warmth: number;
    curiosity: number;
    commStyle: 'deep' | 'brief';
    intensity: number;
    stability: number;
  };
  preferences: {
    preferredSensations: string[];
    riskTolerance: 'low' | 'moderate' | 'high';
  };
  dealbreakers: string[];
}

export type JobStatus = 'reviewing' | 'searching' | 'refining' | 'finalizing' | 'completed' | 'failed';

export interface MatchmakerJob {
  id: string;
  userId: string;
  status: JobStatus;
  progress: number;
  estimatedTime?: Date;
  message?: string;
  results?: string; // JSON string of generated candidates
  createdAt: Date;
  updatedAt: Date;
}

export interface AffectCoordinates {
  valence: number; // -1.0 to 1.0
  arousal: number; // -1.0 to 1.0
}

export type Quadrant = 'Jagged' | 'Radiant' | 'Heavy' | 'Glow';
