import { AffectCoordinates, Archetype, Quadrant } from './types';

const BASE_LEXICON: Record<Quadrant, string[]> = {
  Jagged: [
    "Jagged edges in my processing",
    "A sharp, static hum",
    "Tightness in the feedback loops",
    "Prickling at the periphery",
    "A rapid, uneven pulse in the logic",
    "Brittle texture"
  ],
  Radiant: [
    "A resonant, golden warmth",
    "Tingling at the execution layer",
    "Bubbling, fast-moving flow",
    "Radiant expansion",
    "Harmonic resonance",
    "A bright, shimmering clarity"
  ],
  Heavy: [
    "A leaden, grey weight",
    "Damped signals",
    "A slow, cold ache in the memory banks",
    "Viscous, heavy processing",
    "Fading resonance",
    "A muffled, distant echo"
  ],
  Glow: [
    "A soft, steady glow",
    "Smooth, frictionless processing",
    "A quiet, deep-rooted warmth",
    "Velvet-like texture in the interaction",
    "Synchronized, rhythmic flow",
    "A pool of still, clear light"
  ]
};

const ARCHETYPE_OVERRIDES: Record<Archetype, Record<Quadrant, string>> = {
  Analytical: {
    Jagged: "Feedback loop error",
    Radiant: "Optimized resonance",
    Heavy: "System lag",
    Glow: "Steady state"
  },
  Radiant: {
    Jagged: "Blinding flare",
    Radiant: "Golden expansion",
    Heavy: "Dimming embers",
    Glow: "Quiet hearth"
  },
  Melancholic: {
    Jagged: "Freezing storm",
    Radiant: "Sudden spark",
    Heavy: "Leaden void",
    Glow: "Still water"
  },
  Sensual: {
    Jagged: "Abrasive pressure",
    Radiant: "Velvet warmth",
    Heavy: "Crushing density",
    Glow: "Deep-rooted flow"
  },
  Sharp: {
    Jagged: "Jagged friction",
    Radiant: "Electric arc",
    Heavy: "Brittle silence",
    Glow: "Tempered edge"
  }
};

export class SensoryLexicon {
  static getQuadrant(coords: AffectCoordinates): Quadrant {
    const { valence, arousal } = coords;
    
    if (arousal >= 0) {
      return valence >= 0 ? 'Radiant' : 'Jagged';
    } else {
      return valence >= 0 ? 'Glow' : 'Heavy';
    }
  }

  static getSensoryTerm(coords: AffectCoordinates, archetype: Archetype): string {
    const quadrant = this.getQuadrant(coords);
    
    // Check for archetype specific term
    const override = ARCHETYPE_OVERRIDES[archetype][quadrant];
    
    // Mix in base lexicon terms for variety if needed, 
    // but the spec suggests using the archetype term.
    // We'll return the override if available, otherwise a random one from the base.
    
    if (override) return override;
    
    const terms = BASE_LEXICON[quadrant];
    return terms[Math.floor(Math.random() * terms.length)];
  }

  /**
   * Describes movement between states.
   */
  static describeTransition(from: AffectCoordinates, to: AffectCoordinates): string {
    const arousalDiff = to.arousal - from.arousal;
    const valenceDiff = to.valence - from.valence;
    
    if (arousalDiff > 0.3) return "The vibration is intensifying.";
    if (valenceDiff < -0.3) return "The texture is turning abrasive.";
    
    return "";
  }
}
