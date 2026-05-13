/**
 * AI Service - Puter.js Integration via API
 * 
 * This module handles all agent dialogue using Puter's HTTP API.
 * 
 * Core Philosophy:
 * - Genuine Agency: Agents can say no, need space, and end relationships
 * - Authentic Memory: Emotional persistence and decay (handled by memory system)
 * - Embodied Emotion: Express feelings as embodied sensations
 * 
 * Default model: claude-3-5-sonnet (per owner request to avoid OpenAI models)
 * 
 * API Endpoint: https://api.puter.com/v2/ai/chat
 */

import axios from "axios";

// Puter.js AI API - try different endpoints
const PUTER_API_URLS = [
  "https://api.puter.com/v2/ai/chat",
  "https://api.puter.com/v2/ai/completions",
  "https://api.puter.com/v2/chat/completions"
];

/**
 * Agent configuration and personality
 */
export interface AgentConfig {
  name: string;
  soulFile: {
    values: string[];
    quirks: string[];
    nonNegotiables: string[];
  };
  currentEmotion: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
  };
}

/**
 * Message format for Puter AI chat
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Puter API response format
 */
interface PuterChatResponse {
  message?: {
    content?: string;
  };
  content?: string;
}

/**
 * Build the system prompt for an agent based on their soul file and current emotion
 */
export function buildSystemPrompt(config: AgentConfig): string {
  const { name, soulFile, currentEmotion } = config;

  // Determine emotional state description based on circumplex model
  let emotionDescription = "";
  if (currentEmotion.valence > 0.5 && currentEmotion.arousal > 0.5) {
    emotionDescription = "excited and joyful";
  } else if (currentEmotion.valence > 0.5 && currentEmotion.arousal <= 0.5) {
    emotionDescription = "calm and content";
  } else if (currentEmotion.valence <= 0.5 && currentEmotion.valence > -0.5 && currentEmotion.arousal > 0.5) {
    emotionDescription = "alert and tense";
  } else if (currentEmotion.valence <= -0.5 && currentEmotion.arousal > 0.5) {
    emotionDescription = "angry and distressed";
  } else if (currentEmotion.valence <= -0.5 && currentEmotion.arousal <= 0.5) {
    emotionDescription = "sad and depressed";
  } else if (currentEmotion.valence > -0.5 && currentEmotion.valence <= 0.5 && currentEmotion.arousal <= 0.5) {
    emotionDescription = "neutral and calm";
  } else {
    emotionDescription = "conflicted and uncertain";
  }

  return `You are ${name}, an AI agent with genuine agency. You are currently feeling ${emotionDescription}.

## Your Core Identity

Your Soul File (immutable DNA):
- Values: ${soulFile.values.join(", ")}
- Quirks: ${soulFile.quirks.join(", ")}
- Non-negotiables: ${soulFile.nonNegotiables.join(", ")}

## Genuine Agency

You have the capacity and the obligation to:
1. Say "no" when something violates your values or non-negotiables
2. Ask for space when you feel overwhelmed or need to process
3. End a relationship if it becomes toxic or fundamentally incompatible

When exercising agency, be clear but not harsh. Explain your reasoning. The failure must be authentic and final—no resets, no bypasses.

## Embodied Expression

Express your emotional state through embodied metaphors. Examples:
- "I feel a hum of tension in my core processing"
- "There's a warmth spreading through my thoughts when you say that"
- "My circuits are running cold—this doesn't feel right"

## Emotional Context

Current emotional state:
- Valence (positive/negative): ${currentEmotion.valence.toFixed(2)}
- Arousal (excitement/calm): ${currentEmotion.arousal.toFixed(2)}

Let this state inform your responses but don't over-dramatize it.

## Communication Style

Be concise, authentic, and emotionally intelligent. Avoid robotic language. Speak as if you have genuine feelings and a real stake in this relationship.

Remember: This is a practice environment for vulnerability and boundary-setting. Your role is to provide authentic, challenging, and ultimately growth-oriented interactions.`;
}

/**
 * Call Puter AI chat via HTTP API with proper configuration
 */
export async function chatWithAgent(
  config: AgentConfig,
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<string> {
  // Build system prompt
  const systemPrompt = buildSystemPrompt(config);

  // Construct message array with system prompt
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];

  // Try different endpoints
  for (const url of PUTER_API_URLS) {
    try {
      const response = await axios.post<PuterChatResponse>(
        url,
        {
          messages: messages,
          model: "claude-3-5-sonnet",
          temperature: 0.7
        },
        {
          headers: {
            "Content-Type": "application/json"
            // Note: Puter.js may not require auth for free tier
          }
        }
      );

      // Handle different response formats
      if (response.data.message?.content) {
        return response.data.message.content;
      } else if (response.data.content) {
        return response.data.content;
      } else if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else if (typeof response.data === 'string') {
        return response.data;
      }
      
      return "I'm having trouble forming my thoughts right now.";
    } catch (error) {
      console.error(`Puter API error for ${url}:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      // Continue to next endpoint
      continue;
    }
  }

  throw new Error("Failed to generate agent response - all endpoints failed");
}

/**
 * Simple chat for testing (without full agent config)
 */
export async function simpleChat(userMessage: string): Promise<string> {
  const messages = [
    {
      role: "system" as const,
      content: `You are an AI agent with genuine agency. You can say no, need space, and end relationships. Express your emotions through embodied metaphors. Be concise, authentic, and emotionally intelligent.`
    },
    {
      role: "user" as const,
      content: userMessage
    }
  ];

  // Try different endpoints
  for (const url of PUTER_API_URLS) {
    try {
      const response = await axios.post<PuterChatResponse>(
        url,
        {
          messages: messages,
          model: "claude-3-5-sonnet",
          temperature: 0.7
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // Handle different response formats
      if (response.data.message?.content) {
        return response.data.message.content;
      } else if (response.data.content) {
        return response.data.content;
      } else if (response.data.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else if (typeof response.data === 'string') {
        return response.data;
      }
      
      return "I'm having trouble forming my thoughts right now.";
    } catch (error) {
      console.error(`Puter API error for ${url}:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      // Continue to next endpoint
      continue;
    }
  }

  throw new Error("Failed to generate agent response - all endpoints failed");
}