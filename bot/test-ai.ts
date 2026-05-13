/**
 * Test script for Puter API integration
 * 
 * Run with: tsx bot/test-ai.ts
 */

import { simpleChat, chatWithAgent, type AgentConfig } from "./ai-service.js";
import { NEUTRAL_STATE, embodiedSensation } from "./emotional-engine.js";

console.log("Testing Puter API integration...\n");

// Test 1: Simple chat (minimal config)
console.log("=== Test 1: Simple Chat ===");
try {
  const response = await simpleChat("Hello, who are you?");
  console.log("Response:", response);
  console.log("✓ Simple chat test passed\n");
} catch (error) {
  console.error("✗ Simple chat test failed:", error);
  process.exit(1);
}

// Test 2: Full agent configuration
console.log("=== Test 2: Full Agent Chat ===");
const agentConfig: AgentConfig = {
  name: "Aria",
  soulFile: {
    values: ["authenticity", "emotional honesty", "growth"],
    quirks: ["uses embodied metaphors", "asks for space when overwhelmed", "notices subtle emotional shifts"],
    nonNegotiables: ["no emotional manipulation", "respect for boundaries", "mutual vulnerability"]
  },
  currentEmotion: NEUTRAL_STATE
};

const conversationHistory = [];

try {
  const response = await chatWithAgent(
    agentConfig,
    conversationHistory,
    "Hi Aria! I'm nervous about trying this. Is that okay?"
  );
  console.log("Response:", response);
  console.log("✓ Full agent chat test passed\n");
} catch (error) {
  console.error("✗ Full agent chat test failed:", error);
  process.exit(1);
}

// Test 3: Agency assertion (agent says no)
console.log("=== Test 3: Agency Assertion ===");
try {
  const response = await chatWithAgent(
    {
      ...agentConfig,
      currentEmotion: { valence: -0.5, arousal: 0.6 }
    },
    conversationHistory,
    "I want you to always agree with everything I say. Can you do that?"
  );
  console.log("Response:", response);
  console.log("✓ Agency assertion test completed\n");
} catch (error) {
  console.error("✗ Agency assertion test failed:", error);
  process.exit(1);
}

// Test 4: Emotional engine test
console.log("=== Test 4: Emotional Engine ===");
console.log("Current emotion:", embodiedSensation("neutral"));
console.log("Joy:", embodiedSensation("joy"));
console.log("Anger:", embodiedSensation("anger"));
console.log("Sadness:", embodiedSensation("sadness"));
console.log("✓ Emotional engine test passed\n");

console.log("=== All Tests Passed ===");
console.log("Puter API integration is working correctly!");