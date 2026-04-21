import { MemorySystem } from './memory';
import { SoulGenerator } from './generator';
import { SensoryLexicon } from './circumplex';
import { Evaluator } from './evaluator';

async function testCoreEngine() {
  console.log("--- Testing Soul Generation ---");
  const traits = SoulGenerator.generateTraits('Analytical');
  console.log("Analytical Traits:", traits);
  const profile = SoulGenerator.generateAttractionProfile(traits, 'Analytical');
  console.log("Analytical Attraction Profile:", profile);

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
}

testCoreEngine().catch(console.error);
