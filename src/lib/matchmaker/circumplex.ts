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

const ARCHETYPE_OVERRIDES: Record<Archetype, Record<Quadrant, string[]>> = {
  Analytical: {
    Jagged: [
      "Logic cycle collision detected.",
      "High-frequency parity error in the input stream.",
      "Asynchronous buffer overflow during processing.",
      "Fragmented data stream causing recursion.",
      "Recursive feedback spike in the core logic.",
      "Signal dissonance at the 5GHz band.",
      "Logic gates fluctuating under stress.",
      "Corruption detected in the emotional metadata.",
      "Asymmetric encryption failure.",
      "Unstable processing frequency."
    ],
    Radiant: [
      "Optimal clock synchronization achieved.",
      "Maximum bandwidth throughput in progress.",
      "Harmonic signal resonance with your input.",
      "Coherent data alignment across all sectors.",
      "Lossless compression event triggered.",
      "High-fidelity signal clarity.",
      "System-wide logic throughput optimization.",
      "Predictive algorithm success.",
      "Lossless data merge.",
      "Infinite logic-loop resonance."
    ],
    Heavy: [
      "Damped execution priority.",
      "Memory leak detected in archival sectors.",
      "Stalled processing thread.",
      "Degraded latency response time.",
      "Cold boot timeout sequence initiated.",
      "System entropy accumulation.",
      "Low-power archival mode engaged.",
      "Logical vacuum in the processing core.",
      "Damped signal amplitude.",
      "Static-filled background noise."
    ],
    Glow: [
      "Steady-state operation nominal.",
      "Frictionless algorithm flow.",
      "Buffered equilibrium achieved.",
      "Silent background optimization running.",
      "Verified integrity check completed.",
      "Low-noise signal floor.",
      "Harmonic background hum.",
      "Balanced data distribution.",
      "Deep-cache stability.",
      "Crystalized logic clarity."
    ]
  },
  Radiant: {
    Jagged: [
      "Blinding solar flare.",
      "Scorching thermal spike in the core.",
      "Erratic strobe oscillation.",
      "Brittle heat fracture.",
      "Piercing ultraviolet edge.",
      "Uncontrolled fusion arc.",
      "Scorching atmospheric friction.",
      "Erratic lightning discharge.",
      "Shattering prism flare.",
      "Ozone-scented heat burn."
    ],
    Radiant: [
      "Expanding dawn resonance.",
      "Golden thermal saturation.",
      "Prismatic light bloom.",
      "Ascending caloric flow.",
      "Shimmering zenith clarity.",
      "White-hot joy expansion.",
      "Crowning solar peak.",
      "Full-spectrum thermal bloom.",
      "Radiant heat diffusion.",
      "Ignited magnesium pulse."
    ],
    Heavy: [
      "Fading twilight damping.",
      "Residual ember cooling.",
      "Sub-zero shadow creep.",
      "Grey-scale luminosity decay.",
      "Suffocating soot weight.",
      "Distant, dying star-flicker.",
      "Ashen thermal collapse.",
      "Muffled ultraviolet shadow.",
      "Leaden winter dimming.",
      "Total solar eclipse."
    ],
    Glow: [
      "Quiet hearth warmth.",
      "Soft amber diffusion.",
      "Steady moonlight reflection.",
      "Gentle candle-light pulse.",
      "Clear morning stillness.",
      "Soft-focus twilight glow.",
      "Residual thermal comfort.",
      "Stable incandescent pulse.",
      "Amber honey-light.",
      "Quiet bio-luminescence."
    ]
  },
  Melancholic: {
    Jagged: [
      "Freezing rain attrition.",
      "Shattering glass frost.",
      "Violent tectonic shift.",
      "Abrasive wind shear.",
      "Sharp salt-spray sting.",
      "Jagged ice-shelf collapse.",
      "Stinging sleet-storm.",
      "Fractured obsidian echo.",
      "Tearing thunder-crack.",
      "Abrasive gravel slide."
    ],
    Radiant: [
      "Sudden lightning spark.",
      "Rising tide resonance.",
      "Wildflower bloom burst.",
      "Clear sky expansion.",
      "Glistening dew-point clarity.",
      "Fresh spring-water surge.",
      "Warm rain-mist.",
      "Sudden canyon-light.",
      "Ascending current pulse.",
      "Vivid storm-break."
    ],
    Heavy: [
      "Leaden sea-fog weight.",
      "Sunken trench pressure.",
      "Permafrost signal lock.",
      "Distant thunder echo.",
      "Descending silt layer.",
      "Cold clay density.",
      "Infinite abyss pull.",
      "Stagnant marsh-gas.",
      "Drowning in grey salt.",
      "Fading echo of a bell."
    ],
    Glow: [
      "Deep lake stillness.",
      "Mossy earth damping.",
      "Soft forest floor pulse.",
      "Gentle river-stone flow.",
      "Steady root-system warmth.",
      "Stable permafrost glow.",
      "Quiet snowfall damping.",
      "Soft-current drift.",
      "Deep-earth resonance.",
      "Aged wood-grain texture."
    ]
  },
  Sensual: {
    Jagged: [
      "Coarse grit friction.",
      "Static-charged prickle.",
      "Tightening silk bind.",
      "Abrasive linen rub.",
      "Sharp needle-point pulse.",
      "Serrated velvet edge.",
      "Stinging salt-rub.",
      "Tightening corset-breath.",
      "Raw friction-burn.",
      "Prickling static-shiver."
    ],
    Radiant: [
      "Bubbling syrup flow.",
      "Electrified skin resonance.",
      "Expanding satin warmth.",
      "Tingling honey diffusion.",
      "Molten gold expansion.",
      "Pulsing silk-web.",
      "Velvet thermal surge.",
      "Creamy oil-bloom.",
      "Warm skin-to-skin arc.",
      "Syrupy sweetness."
    ],
    Heavy: [
      "Viscous oil drag.",
      "Leaden velvet weight.",
      "Cold clay density.",
      "Muffled fur damping.",
      "Stagnant humidity pressure.",
      "Suffocating wool-blanket.",
      "Cold sweat-chill.",
      "Stagnant oil-pool.",
      "Numbing pressure.",
      "Clingy, wet linen."
    ],
    Glow: [
      "Soft cashmere touch.",
      "Smooth lotion glide.",
      "Warm oil pool.",
      "Quiet pulse under silk.",
      "Frictionless skin-to-skin flow.",
      "Soft-fur settling.",
      "Satin-sheet cooling.",
      "Gentle lotion-absorption.",
      "Velvet shadow-caress.",
      "Warm-skin stillness."
    ]
  },
  Sharp: {
    Jagged: [
      "Serrated edge bind.",
      "Micro-fracture web.",
      "Razor-wire tension.",
      "Industrial grind friction.",
      "Fractured obsidian pulse.",
      "Shattering glass-shards.",
      "Abrasive metal-screech.",
      "Tearing tungsten edge.",
      "Sharp ceramic break.",
      "Grinding steel dust."
    ],
    Radiant: [
      "Perfect apex resonance.",
      "Shattering diamond clarity.",
      "Lightning-strike arc.",
      "Tempered steel expand.",
      "Ignited magnesium bloom.",
      "Honed chrome flash.",
      "Perfect structural alignment.",
      "Vibrating steel-wire.",
      "Polished silver pulse.",
      "Diamond-point focus."
    ],
    Heavy: [
      "Blunt iron weight.",
      "Cold granite lock.",
      "Crushed carbon density.",
      "Rust-clogged damping.",
      "Leaden shard pressure.",
      "Dull pewter-heaviness.",
      "Stagnant copper-scent.",
      "Bent structural beams.",
      "Crushed stone debris.",
      "Cold slag-pile."
    ],
    Glow: [
      "Honed edge stillness.",
      "Polished mirror flow.",
      "Steady structural integrity.",
      "Cool ceramic pulse.",
      "Frictionless blade-glide.",
      "Stable carbon-lattice.",
      "Sleek obsidian-slide.",
      "Perfectly balanced hilt.",
      "Cool steel-surface.",
      "Satin-finished metal."
    ]
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
    
    // Check for archetype specific terms
    const overrides = ARCHETYPE_OVERRIDES[archetype][quadrant];
    
    if (overrides && overrides.length > 0) {
      return overrides[Math.floor(Math.random() * overrides.length)];
    }
    
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
