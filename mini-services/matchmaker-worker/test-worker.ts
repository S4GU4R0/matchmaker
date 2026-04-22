import { prisma } from "../../src/lib/matchmaker/prisma";
import { Matchmaker } from "../../src/lib/matchmaker/matchmaker";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function testWorker() {
    console.log("--- Testing Worker Logic ---");
    
    // 1. Create a user
    const testUserId = "test_user_" + Date.now();
    await prisma.user.create({
        data: {
            id: testUserId,
            status: "matching",
            onboardingData: JSON.stringify({
                vulnerability: "It is a tool for connection.",
                repair: "I always seek to repair.",
                shutdown: "Dishonesty.",
                mirror: "Cold, Anxious, Curious"
            })
        }
    });
    console.log("Created test user:", testUserId);

    // 2. Create a job that is already "old" (to simulate 24h passed)
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
    const job = await prisma.matchmakerJob.create({
        data: {
            userId: testUserId,
            status: "reviewing",
            progress: 0,
            createdAt: yesterday
        }
    });
    console.log("Created test job:", job.id);

    // 3. Import and run processJobs (I'll just copy the logic here or import it)
    // For simplicity, I'll just run a snippet of the worker logic
    
    const status = Matchmaker.getJobStatus(job.createdAt);
    console.log("Calculated status:", status);

    if (status.progress >= 99) {
        console.log("Job should be completed.");
        // Normally the worker would do this
    }
}

testWorker().catch(console.error);
