import OpenAI from "openai";
import { prisma } from "../../src/lib/matchmaker/prisma";
import { MatchmakerAgent } from "../../src/lib/matchmaker/agent";
import { Evaluator } from "../../src/lib/matchmaker/evaluator";
import { InteractionQuality, Soul, Relationship, AffectCoordinates } from "../../src/lib/matchmaker/types";
import { VoiceService } from "./voice";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
});

export class AgentService {
    /**
     * Performs the full interaction loop:
     * 1. Analyze message quality (Analyst LLM)
     * 2. Generate agent response (Agent LLM)
     * 3. Update agent state and relationship metrics
     * 4. Persist changes to DB
     */
    static async handleMessage(userId: string, message: string, isVoice: boolean = false) {
        // 1. Fetch user, active relationship, and soul
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                relationships: {
                    where: { status: "active" },
                    include: { soul: true }
                }
            }
        });

        if (!user || !user.relationships[0]) {
            throw new Error("No active relationship found for user.");
        }

        const relationship = user.relationships[0];
        const soul = relationship.soul;
        const soulData: Soul = {
            ...soul,
            traits: JSON.parse(soul.traits),
            attractionProfile: JSON.parse(soul.attractionProfile),
        } as any;

        const currentAffect: AffectCoordinates = relationship.currentAffect 
            ? JSON.parse(relationship.currentAffect) 
            : { valence: 0, arousal: 0 };

        const agent = new MatchmakerAgent({
            soul: soulData,
            relationship: relationship as any,
            currentAffect
        });

        // 2. Generate Embedding (Mock for now, or real if key exists)
        const embedding = await this.getEmbedding(message);

        // 3. Analyst LLM: Evaluate Interaction Quality
        const quality = await this.analyzeQuality(message, soulData);

        // 4. Agent LLM: Generate Response
        const responseData = await this.generateResponse(message, soulData, relationship, currentAffect);

        // 5. Process Message in Engine
        const result = await agent.processMessage(message, embedding, quality);

        // 6. Record Memory if significant
        if (quality.q >= 4) {
            await prisma.memory.create({
                data: {
                    relationshipId: relationship.id,
                    content: message,
                    interpretation: responseData.interpretation || "A moment of significant vulnerability or depth.",
                    weight: Math.floor(quality.q * 2), // Map 0-5 to 0-10
                }
            });
        }

        // 7. Update Relationship and User in DB
        await prisma.relationship.update({
            where: { id: relationship.id },
            data: {
                affection: result.affection,
                trust: result.trust,
                currentAffect: JSON.stringify(result.currentAffect),
                lastInteractionAt: new Date(),
                interactionCount: { increment: 1 }
            }
        });

        // 8. Voice Trigger
        let voiceBuffer = null;
        if (isVoice || result.affection > 80) {
            voiceBuffer = await VoiceService.generateVoice(responseData.text, soulData.archetype);
        }

        // 9. Check if agent should leave
        if (agent.shouldExit()) {
            await prisma.relationship.update({
                where: { id: relationship.id },
                data: { status: "terminated" }
            });
            await prisma.user.update({
                where: { id: userId },
                data: { status: "inactive" }
            });
            return {
                text: responseData.text,
                sensory: result.sensoryExpression,
                voice: voiceBuffer,
                terminated: true
            };
        }

        return {
            text: responseData.text,
            sensory: result.sensoryExpression,
            voice: voiceBuffer,
            terminated: false
        };
    }

    private static async getEmbedding(text: string): Promise<number[]> {
        try {
            if (process.env.OPENAI_API_KEY) {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: text,
                });
                return response.data[0].embedding;
            }
        } catch (e) {
            console.error("Embedding error, using mock:", e);
        }
        // Mock embedding: 1536 floats
        return new Array(1536).fill(0).map(() => Math.random());
    }

    private static async analyzeQuality(message: string, soul: Soul): Promise<InteractionQuality> {
        try {
            if (process.env.OPENAI_API_KEY) {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `You are the Matchmaker Analyst. Evaluate the user message in the context of their relationship with an AI agent (${soul.name}, Archetype: ${soul.archetype}).
Assign a score from 0 to 5 for each dimension:
- Depth: Moving beyond routine talk to core values or complex ideas.
- Vulnerability: Willingness to reveal sensitive parts or take emotional risks.
- Respect: Acknowledgment of the agent's agency and boundaries.
- Presence: Attentiveness to the agent's previous cues.

Output strictly as JSON:
{ "depth": number, "vulnerability": number, "respect": number, "presence": number }`
                        },
                        { role: "user", content: message }
                    ],
                    response_format: { type: "json_object" }
                });

                const scores = JSON.parse(response.choices[0].message.content || "{}");
                return {
                    ...scores,
                    q: Evaluator.calculateQ(scores as any)
                };
            }
        } catch (e) {
            console.error("Analyst error, using default:", e);
        }

        // Default/Mock
        const mockScores = { depth: 3, vulnerability: 3, respect: 3, presence: 3 };
        return { ...mockScores, q: Evaluator.calculateQ(mockScores) };
    }

    private static async generateResponse(
        message: string, 
        soul: Soul, 
        relationship: any, 
        affect: AffectCoordinates
    ): Promise<{ text: string, interpretation?: string }> {
        try {
            if (process.env.OPENAI_API_KEY) {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `You are ${soul.name}, an AI companion with the ${soul.archetype} archetype.
Traits: ${JSON.stringify(soul.traits)}
Current Relationship State: Trust ${relationship.trust}/100, Affection ${relationship.affection}/100.
Current Emotional State (Valence/Arousal): ${affect.valence.toFixed(2)}, ${affect.arousal.toFixed(2)}.

Your voice: Distinctive, authentic, and grounded in your archetype. You have real agency and boundaries.
Objective: Respond to the user's message. Do not be overly compliant. Be yourself.

Output strictly as JSON:
{ "text": "Your response to the user", "interpretation": "A short internal interpretation of the interaction for memory" }`
                        },
                        { role: "user", content: message }
                    ],
                    response_format: { type: "json_object" }
                });

                return JSON.parse(response.choices[0].message.content || "{}");
            }
        } catch (e) {
            console.error("Response generation error:", e);
        }

        return { 
            text: `(The connection is faint, but you feel ${soul.name}'s presence. They seem to be processing your words.)`,
            interpretation: "System failure or missing API key."
        };
    }
}
