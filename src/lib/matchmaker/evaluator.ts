import { InteractionQuality, InferredUserProfile } from './types';

export class Evaluator {
  /**
   * Calculates the weighted interaction quality q.
   */
  static calculateQ(quality: Omit<InteractionQuality, 'q'>): number {
    const { depth, vulnerability, respect, presence } = quality;
    
    // Weighting: Depth 30%, Vulnerability 30%, Respect 20%, Presence 20%
    const q = (depth * 0.3) + (vulnerability * 0.3) + (respect * 0.2) + (presence * 0.2);
    
    return Number(q.toFixed(2));
  }

  /**
   * Calculates cosine similarity between two vectors.
   */
  static cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      magnitude1 += v1[i] * v1[i];
      magnitude2 += v2[i] * v2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Detects repetitiveness based on embeddings.
   */
  static detectRepetitiveness(currentEmbedding: number[], bufferEmbeddings: number[][]): {
    similarity: number;
    isRepetitive: boolean;
    isStagnating: boolean;
  } {
    if (bufferEmbeddings.length === 0) {
      return { similarity: 0, isRepetitive: false, isStagnating: false };
    }

    // Average vector of the buffer
    const bufferSize = bufferEmbeddings.length;
    const vectorDim = bufferEmbeddings[0].length;
    const avgVector = new Array(vectorDim).fill(0);
    
    for (const emb of bufferEmbeddings) {
      for (let i = 0; i < vectorDim; i++) {
        avgVector[i] += emb[i] / bufferSize;
      }
    }

    const similarity = this.cosineSimilarity(currentEmbedding, avgVector);
    
    return {
      similarity,
      isRepetitive: similarity > 0.85,
      isStagnating: similarity > 0.70,
    };
  }

  /**
   * Calculates a derived user trait from onboarding responses.
   */
  static calculateTrait(
    baseValue: number = 5,
    impacts: { weight: number; impact: number }[]
  ): number {
    const totalImpact = impacts.reduce((acc, curr) => acc + (curr.weight * curr.impact), 0);
    const finalValue = Math.max(1, Math.min(10, baseValue + totalImpact));
    return Number(finalValue.toFixed(1));
  }

  /**
   * Determines categorical communication style.
   */
  static determineCommStyle(messages: string[]): 'deep' | 'brief' {
    if (messages.length === 0) return 'brief';
    
    const avgWordCount = messages.reduce((acc, msg) => acc + msg.split(/\s+/).length, 0) / messages.length;
    
    // Internal state keywords
    const keywords = ['feel', 'think', 'believe', 'know', 'wonder', 'memory', 'emotion', 'sense'];
    const keywordCount = messages.reduce((acc, msg) => {
      const lowerMsg = msg.toLowerCase();
      return acc + keywords.filter(k => lowerMsg.includes(k)).length;
    }, 0);
    
    const keywordDensity = keywordCount / messages.length;

    if (avgWordCount > 20 || keywordDensity > 1.0) {
      return 'deep';
    }
    
    return 'brief';
  }
}
