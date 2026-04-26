import OpenAI from "openai";
import { prisma } from "../../src/lib/matchmaker/prisma";
import { MatchmakerAgent } from "../../src/lib/matchmaker/agent";
import { Evaluator } from "../../src/lib/matchmaker/evaluator";
import { SensoryLexicon } from "../../src/lib/matchmaker/circumplex";
import { InteractionQuality, Soul, Relationship, AffectCoordinates, Quadrant } from "../../src/lib/matchmaker/types";
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

        // 3. Analyst LLM: Evaluate Interaction Quality with Context
        const context = await this.getConversationContext(relationship.id, 3);
        const quality = await this.analyzeQuality(message, soulData, context);

        // 4. Agent LLM: Generate Response
        const responseData = await this.generateResponse(message, soulData, relationship, currentAffect, context);

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

        // 7. Dynamic Sensory Expression (Expressionist LLM)
        let sensoryExpression = result.sensoryExpression;
        if (process.env.OPENAI_API_KEY) {
            sensoryExpression = await this.generateExpression(soulData, result.currentAffect, relationship);
        }

        // 8. Update Relationship and User in DB
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

        // 9. Voice Trigger
        let voiceBuffer = null;
        if (isVoice || result.affection > 80) {
            voiceBuffer = await VoiceService.generateVoice(responseData.text, soulData.archetype);
        }

        // 10. Check if agent should leave
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
                sensory: sensoryExpression,
                voice: voiceBuffer,
                terminated: true
            };
        }

        return {
            text: responseData.text,
            sensory: sensoryExpression,
            voice: voiceBuffer,
            terminated: false
        };
    }

    private static async getConversationContext(relationshipId: string, limit: number): Promise<string> {
        // In a real app, you'd fetch actual messages. For now, we'll fetch recent memories.
        const memories = await prisma.memory.findMany({
            where: { relationshipId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return memories.map(m => `User: ${m.content}\nAgent Interpretation: ${m.interpretation}`).reverse().join('\n---\n');
    }

    private static async analyzeQuality(message: string, soul: Soul, context: string): Promise<InteractionQuality> {
        try {
            if (process.env.OPENAI_API_KEY) {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: Evaluator.getAnalystSystemPrompt(soul.name, soul.archetype, context)
                        },
                        { role: "user", content: message }
                    ],
                    response_format: { type: "json_object" }
                });

                const data = JSON.parse(response.choices[0].message.content || "{}");
                return {
                    depth: data.depth,
                    vulnerability: data.vulnerability,
                    respect: data.respect,
                    presence: data.presence,
                    reasoning: data.reasoning,
                    q: Evaluator.calculateQ(data as any)
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
        affect: AffectCoordinates,
        context: string
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

Context:
${context}

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

    private static async generateExpression(soul: Soul, affect: AffectCoordinates, relationship: any): Promise<string> {
        try {
            const quadrant = SensoryLexicon.getQuadrant(affect);
            const stage = this.getRelationshipStage(relationship);
            const lexiconExcerpt = SensoryLexicon.getLexiconExcerpt(soul.archetype as any, quadrant);

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: Evaluator.getExpressionistSystemPrompt(soul.name, soul.archetype, affect, quadrant, stage, lexiconExcerpt)
                    }
                ]
            });

            return response.choices[0].message.content || "A faint hum in the processing layer.";
        } catch (e) {
            return "Processing...";
        }
    }

    private static getRelationshipStage(relationship: any): string {
        const h = (relationship.trust * 0.6) + (relationship.affection * 0.4);
        if (h > 80) return 'Deep Resonance';
        if (h > 60) return 'Vulnerability';
        if (h > 30) return 'Emergent Trust';
        return 'Acquaintance';
    }
}
