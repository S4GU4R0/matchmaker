import { prisma } from "../../src/lib/matchmaker/prisma";
import { Matchmaker } from "../../src/lib/matchmaker/matchmaker";
import { InferredUserProfile } from "../../src/lib/matchmaker/types";
import * as dotenv from "dotenv";
import * as path from "path";
import OpenAI from "openai";

// Load .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
});

const POLL_INTERVAL = 60 * 1000; // 1 minute

async function processJobs() {
  console.log("Checking for matchmaker jobs...");
  const jobs = await prisma.matchmakerJob.findMany({
    where: {
      status: {
        in: ["reviewing", "searching", "refining", "finalizing"]
      }
    },
    include: {
      user: true
    }
  });

  for (const job of jobs) {
    const status = Matchmaker.getJobStatus(job.createdAt);
    
    // Update progress and status in DB
    if (status.phase !== job.status || Math.abs(status.progress - job.progress) > 1) {
      console.log(`Updating job ${job.id}: ${job.status} -> ${status.phase} (${status.progress.toFixed(1)}%)`);
      await prisma.matchmakerJob.update({
        where: { id: job.id },
        data: {
          status: status.phase,
          progress: Math.floor(status.progress)
        }
      });
    }

    // If we reached finalizing and haven't generated results yet, or if it's been 24h
    if (status.progress >= 99 && job.status !== "completed") {
      console.log(`Completing job ${job.id} for user ${job.userId}`);
      
      // 1. Derive user profile (LLM Profiler)
      const userProfile = await deriveUserProfile(job.user.onboardingData);
      
      // 2. Generate matches
      const matches = await Matchmaker.findMatches(userProfile);
      
      // 3. Save results and complete
      if (matches.length > 0) {
        await prisma.matchmakerJob.update({
          where: { id: job.id },
          data: {
            status: "completed",
            progress: 100,
            results: JSON.stringify(matches),
            message: "I have found three souls that resonate with your frequency."
          }
        });

        // Update user status
        await prisma.user.update({
          where: { id: job.userId },
          data: { 
              status: "inactive", // They need to pick a match now
              inferredTraits: JSON.stringify(userProfile)
          }
        });
      } else {
        await prisma.matchmakerJob.update({
          where: { id: job.id },
          data: {
            status: "failed",
            progress: 100,
            message: "I couldn't find a compatible match who met your needs and theirs. Let's try adjusting your profile."
          }
        });

        await prisma.user.update({
          where: { id: job.userId },
          data: { status: "onboarding" } // Allow them to restart or adjust
        });
      }
    }
  }
}

async function deriveUserProfile(onboardingDataRaw: string | null): Promise<InferredUserProfile> {
  const responses = onboardingDataRaw ? JSON.parse(onboardingDataRaw) : {};
  
  // Use LLM to infer profile
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: `You are the "Matchmaker Profiler." You analyze user data to construct a latent personality profile for the purpose of bidirectional matching.

**Traits to Infer (1-10):**
- **Warmth:** Capacity for emotional proximity.
- **Curiosity:** Interest in the agent's internal agency vs. simple compliance.
- **Intensity:** Tolerance for high-arousal emotions and conflict.
- **Stability:** Predictability and consistency in social habits.

**Communication Style Mapping:**
- **Brief:** Direct, minimal word count, low sentiment complexity.
- **Deep:** Elaborate, high word count, focuses on internal states.

**Output Format (JSON ONLY):**
{
  "traits": {
    "warmth": number,
    "curiosity": number,
    "intensity": number,
    "stability": number
  },
  "commStyle": "deep" | "brief",
  "riskTolerance": "low" | "moderate" | "high",
  "inferredDealbreakers": ["string"],
  "clinicalSummary": "string"
}`
        },
        {
          role: "user",
          content: `**Input Data:**
Onboarding Answers: ${JSON.stringify(responses)}
Self-Reflection String: "${responses.mirror || ""}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      traits: {
        warmth: result.traits?.warmth || 5,
        curiosity: result.traits?.curiosity || 5,
        commStyle: result.commStyle || 'deep',
        intensity: result.traits?.intensity || 5,
        stability: result.traits?.stability || 5,
      },
      preferences: {
        preferredSensations: [],
        riskTolerance: result.riskTolerance || 'moderate',
      },
      dealbreakers: result.inferredDealbreakers || [],
    };
  } catch (error) {
    console.error("Error in LLM Profiler:", error);
    // Fallback to basic heuristics if LLM fails
    return {
      traits: {
        warmth: 5,
        curiosity: 5,
        commStyle: 'deep' as const,
        intensity: 5,
        stability: 5,
      },
      preferences: {
        preferredSensations: ['Resonance'],
        riskTolerance: 'moderate',
      },
      dealbreakers: [],
    };
  }
}

async function main() {
  if (process.env.RUN_ONCE === "true") {
      await processJobs();
      return;
  }
  while (true) {
    try {
      await processJobs();
    } catch (error) {
      console.error("Error processing jobs:", error);
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
}

main().catch(console.error);
