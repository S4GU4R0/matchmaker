import { prisma } from "../../src/lib/matchmaker/prisma";
import { Matchmaker } from "../../src/lib/matchmaker/matchmaker";
import { InferredUserProfile } from "../../src/lib/matchmaker/types";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

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
      
      // 1. Derive user profile (Heuristic for now, can be LLM later)
      const userProfile = deriveUserProfile(job.user.onboardingData);
      
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

function deriveUserProfile(onboardingDataRaw: string | null): InferredUserProfile {
  const responses = onboardingDataRaw ? JSON.parse(onboardingDataRaw) : {};
  
  // Default values
  const traits = {
    warmth: 5,
    curiosity: 5,
    commStyle: 'deep' as const,
    intensity: 5,
    stability: 5,
  };
  
  const vuln = (responses.vulnerability || "").toLowerCase();
  if (vuln.includes("tool") || vuln.includes("strength") || vuln.includes("open")) {
    traits.warmth += 2;
  } else if (vuln.includes("liability") || vuln.includes("weakness") || vuln.includes("risk")) {
    traits.warmth -= 1;
    traits.stability += 1;
  }
  
  const repair = (responses.repair || "").toLowerCase();
  if (repair.includes("repair") || repair.includes("talk") || repair.includes("fix")) {
    traits.stability += 2;
    traits.warmth += 1;
  } else if (repair.includes("retreat") || repair.includes("leave") || repair.includes("ignore")) {
    traits.stability -= 2;
  }

  // Words analysis (Question 4)
  const mirror = (responses.mirror || "").toLowerCase();
  if (mirror.includes("cold") || mirror.includes("distant")) traits.warmth -= 2;
  if (mirror.includes("anxious") || mirror.includes("unstable")) traits.stability -= 2;
  if (mirror.includes("curious") || mirror.includes("intense")) traits.curiosity += 2;

  // Cap traits
  for (const k in traits) {
      const key = k as keyof typeof traits;
      if (typeof traits[key] === 'number') {
          (traits as any)[key] = Math.max(1, Math.min(10, (traits as any)[key]));
      }
  }

  return {
    traits,
    preferences: {
      preferredSensations: ['Resonance'],
      riskTolerance: 'moderate',
    },
    dealbreakers: [],
  };
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
