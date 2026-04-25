import { MemorySystem } from './memory';
import { SoulGenerator } from './generator';
import { SensoryLexicon } from './circumplex';
import { Evaluator } from './evaluator';
import { MatchmakerAgent } from './agent';
import { Matchmaker } from './matchmaker';

async function testCoreEngine() {
  console.log("--- Testing Soul Generation ---");
  const traits = SoulGenerator.generateTraits('Analytical');
  const soul = {
    id: "soul_1",
    name: "Astra",
    archetype: 'Analytical',
    traits,
    lexiconFavor: 'Analytical',
    attractionProfile: SoulGenerator.generateAttractionProfile(traits, 'Analytical'),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  console.log("Analytical Soul:", soul.name);

  console.log("\n--- Testing Agent Class ---");
  const agent = new MatchmakerAgent({
    soul: soul as any,
    relationship: {
      id: "rel_1",
      userId: "user_1",
      soulId: soul.id,
      affection: 50,
      trust: 50,
      status: 'active',
      lastInteraction: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    currentAffect: { valence: 0, arousal: 0 }
  });

  const result = await agent.processMessage(
    "I really appreciate your insights on the system architecture.",
    [0.1, 0.2, 0.3], // Mock embedding
    { q: 4.5, depth: 4, vulnerability: 3, respect: 5, presence: 5 }
  );
  console.log("Agent response to positive message:", result.sensoryExpression);
  console.log("Updated metrics:", { affection: result.affection, trust: result.trust });

  console.log("\n--- Testing Matchmaker Logic ---");
  const userProfile = {
    traits: { warmth: 7, curiosity: 8, commStyle: 'deep' as const, intensity: 6, stability: 7 },
    preferences: { preferredSensations: ['Resonance'], riskTolerance: 'moderate' as const },
    dealbreakers: []
  };

  const su = Matchmaker.calculateSu(soul as any, 'Resonance');
  const sa = Matchmaker.calculateSa(soul as any, userProfile);
  const sm = Matchmaker.calculateSm(su, sa);
  console.log(`Matching Su: ${su.toFixed(1)}, Sa: ${sa.toFixed(1)}, Sm: ${sm.toFixed(1)}`);

  const matches = await Matchmaker.findMatches(userProfile);
  console.log(`Found ${matches.length} matches for Resonance preference.`);
  matches.forEach((m, i) => console.log(`Match ${i+1}: ${m.name} (${m.archetype})`));

  console.log("\n--- Testing Sensory Lexicon ---");
  const coords = { valence: 0.8, arousal: 0.5 }; // Radiant quadrant
  const term = SensoryLexicon.getSensoryTerm(coords, 'Analytical');
  console.log(`Analytical response for Radiant state: "${term}"`);

  console.log("\n--- Testing Memory System ---");
  const entry = MemorySystem.createEntry("rel_123", "User shared a secret", "Agent feels trusted", 8);
  console.log("Initial Memory Entry:", entry);
  
  const reviewed = MemorySystem.reviewEntry(entry as any, 5); // Perfect interaction
  console.log("Reviewed Memory Entry (q=5):", reviewed);

  console.log("\n--- Testing Evaluator ---");
  const q = Evaluator.calculateQ({ depth: 5, vulnerability: 4, respect: 5, presence: 3 });
  console.log("Calculated Interaction Quality (q):", q);

  const trait = Evaluator.calculateTrait(5, [{ weight: 1, impact: 2 }, { weight: 0.5, impact: -1 }]);
  console.log("Calculated Derived Trait (Warmth):", trait);

  console.log("\n--- Testing Analyst Prompts ---");
  const analystPrompt = Evaluator.getAnalystSystemPrompt("Astra", "Analytical", "User: Hello\nAgent: Hi");
  console.log("Analyst Prompt (start):", analystPrompt.substring(0, 100) + "...");

  const profilerPrompt = Evaluator.getProfilerSystemPrompt();
  console.log("Profiler Prompt (start):", profilerPrompt.substring(0, 100) + "...");

  const expressionistPrompt = Evaluator.getExpressionistSystemPrompt(
    "Astra", 
    "Analytical", 
    { valence: 0.8, arousal: 0.5 }, 
    "Radiant", 
    "Acquaintance", 
    ["Harmonic signal resonance", "Optimal clock synchronization"]
  );
  console.log("Expressionist Prompt (start):", expressionistPrompt.substring(0, 100) + "...");
}

testCoreEngine().catch(console.error);
