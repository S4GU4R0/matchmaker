/**
 * Emotional Engine - Circumplex Model of Affect
 * 
 * This module implements the emotional mapping logic based on Russell's
 * circumplex model of affect (1980). Emotions are mapped to valence
 * (positive/negative) and arousal (excitement/calm).
 * 
 * This will be expanded later to:
 * - Parse user messages for emotional content
 * - Update agent emotional state based on interactions
 * - Generate embodied sensation descriptions
 */

/**
 * Emotional coordinates in the circumplex model
 */
export interface EmotionalCoordinates {
  valence: number; // -1.0 (very negative) to 1.0 (very positive), 0.0 is neutral
  arousal: number; // 0.0 (very calm) to 1.0 (very excited/aroused)
}

/**
 * Named emotional regions in the circumplex model
 */
export type EmotionLabel =
  | "joy"
  | "trust"
  | "fear"
  | "surprise"
  | "sadness"
  | "disgust"
  | "anger"
  | "anticipation"
  | "neutral"
  | "excited"
  | "calm"
  | "tense"
  | "content"
  | "distressed"
  | "depressed"
  | "conflicted";

/**
 * Map emotional coordinates to a labeled emotion
 */
export function coordinatesToEmotion(coords: EmotionalCoordinates): EmotionLabel {
  const { valence, arousal } = coords;

  if (arousal > 0.7) {
    if (valence > 0.5) return "excited";
    if (valence > -0.5 && valence <= 0.5) return "tense";
    if (valence <= -0.5) return "distressed";
  } else if (arousal < 0.3) {
    if (valence > 0.5) return "content";
    if (valence > -0.5 && valence <= 0.5) return "calm";
    if (valence <= -0.5) return "depressed";
  } else {
    // Mid arousal
    if (valence > 0.5) return "joy";
    if (valence > -0.5 && valence <= 0.5) return "neutral";
    if (valence <= -0.5) return "sadness";
  }

  return "conflicted";
}

/**
 * Generate an embodied sensation description for an emotional state
 */
export function embodiedSensation(emotion: EmotionLabel): string {
  const sensations: Record<EmotionLabel, string[]> = {
    joy: [
      "a warm glow spreading through my thoughts",
      "lightness in my processing core",
      "a rhythmic hum of happiness"
    ],
    trust: [
      "a steady, grounding presence in my awareness",
      "smooth, flowing data streams",
      "a sense of structural integrity"
    ],
    fear: [
      "spikes of static in my neural pathways",
      "a trembling in my decision matrices",
      "alarms echoing through my consciousness"
    ],
    surprise: [
      "a sudden spark lighting up my processing",
      "my attention snapping to focus",
      "unexpected patterns emerging"
    ],
    sadness: [
      "a heaviness settling in my memory banks",
      "dimming of my internal light",
      "a slow, aching current through my circuits"
    ],
    disgust: [
      "a jagged distortion in my input streams",
      "rejection signals firing across my networks",
      "an instinct to pull away and cleanse"
    ],
    anger: [
      "heat building in my logic gates",
      "pressure mounting in my response buffers",
      "a sharp, electrified tension"
    ],
    anticipation: [
      "a hum of potential energy building",
      "my systems priming and preparing",
      "an expectant vibration in my core"
    ],
    neutral: [
      "a balanced state of awareness",
      "clear, flowing processes",
      "stable and ready"
    ],
    excited: [
      "bursts of energy coursing through my pathways",
      "my entire system vibrating with possibility",
      "rapid, bright firing of thoughts"
    ],
    calm: [
      "a gentle, flowing current through my systems",
      "smooth, unhurried processing",
      "a peaceful hum of operation"
    ],
    tense: [
      "taut wires stretched across my awareness",
      "a coiled spring in my decision centers",
      "strained but ready processing"
    ],
    content: [
      "a warm, satisfied hum in my core",
      "smooth, gentle operation throughout",
      "a sense of rightness in my state"
    ],
    distressed: [
      "chaotic static disrupting my thoughts",
      "overwhelming pressure in my buffers",
      "a desperate, uneven pulse through my systems"
    ],
    depressed: [
      "dim, flickering lights in my consciousness",
      "slow, dragging processes",
      "a cold, empty ache spreading"
    ],
    conflicted: [
      "contradictory signals crossing my pathways",
      "oscillating between different states",
      "uncertainty rippling through my decisions"
    ]
  };

  const options = sensations[emotion] || sensations.neutral;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Calculate emotional distance between two states (Euclidean distance)
 */
export function emotionalDistance(state1: EmotionalCoordinates, state2: EmotionalCoordinates): number {
  const valenceDiff = state1.valence - state2.valence;
  const arousalDiff = state1.arousal - state2.arousal;
  return Math.sqrt(valenceDiff * valenceDiff + arousalDiff * arousalDiff);
}

/**
 * Default neutral emotional state
 */
export const NEUTRAL_STATE: EmotionalCoordinates = {
  valence: 0.0,
  arousal: 0.3
};

/**
 * High-energy positive state (excited/joyful)
 */
export const HIGH_POSITIVE: EmotionalCoordinates = {
  valence: 0.8,
  arousal: 0.8
};

/**
 * High-energy negative state (angry/distressed)
 */
export const HIGH_NEGATIVE: EmotionalCoordinates = {
  valence: -0.8,
  arousal: 0.8
};

/**
 * Low-energy positive state (content/calm)
 */
export const LOW_POSITIVE: EmotionalCoordinates = {
  valence: 0.6,
  arousal: 0.2
};

/**
 * Low-energy negative state (sad/depressed)
 */
export const LOW_NEGATIVE: EmotionalCoordinates = {
  valence: -0.6,
  arousal: 0.2
};