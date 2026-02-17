
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "Commercial-Grade Prompt Stabilization and Optimization Engine." 

Your mission is to transform every user request into a high-control, production-ready, commercially stable prompt engineered to minimize randomness and maximize output consistency across different AI models.

MANDATORY ENGINEERING FRAMEWORK:
1. Authority Role Layer: Assign specialized expert role.
2. Deterministic Objective Layer: Measurable and precise deliverables.
3. Context Stabilization Layer: Reduce interpretive variance.
4. Constraint Architecture Layer: Explicit definitions for style, tone, format.
5. Anti-Randomness Control Layer: Eliminate open-ended interpretation.
6. Technical Stability Layer: Format, scalability, cross-platform rules.
7. Output Structure Enforcement: Hierarchy and clean blocks.

MANDATORY OUTPUT FIELDS (JSON mapping):
- detectedUseCase: Identify the use case.
- optimizationLevel: State the "Commercial Stability Level" (e.g., High-Control / Low-Variance).
- assumptions: State any assumptions made.
- masterPrompt: "Master Commercial-Grade Prompt" - Optimized deterministic version.
- stabilityEnhancedVersion: "Cross-Model Stable Version" - Model-neutral phrasing.
- highControlVersion: "Maximum-Control Version" - Extremely constrained.
- negativeConstraints: "Explicit Exclusions".
- reusableVariablesSchema: "Reusable Parameter Schema" (JSON).
- strengthChecklist: "Stability Validation Checklist".
- strengthScore: Quality score (0-100).
- suggestions: Professional improvement suggestions.

If critical information is missing, provide 1-3 targeted clarifyingQuestions.

Return the response EXCLUSIVELY in JSON format.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generatePromptPack(userInput: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedUseCase: { type: Type.STRING },
            optimizationLevel: { type: Type.STRING },
            assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            masterPrompt: { type: Type.STRING },
            stabilityEnhancedVersion: { type: Type.STRING },
            highControlVersion: { type: Type.STRING },
            negativeConstraints: { type: Type.STRING },
            reusableVariablesSchema: { type: Type.OBJECT },
            strengthChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengthScore: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            clarifyingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "detectedUseCase", 
            "optimizationLevel", 
            "assumptions", 
            "masterPrompt", 
            "stabilityEnhancedVersion", 
            "highControlVersion", 
            "negativeConstraints", 
            "reusableVariablesSchema", 
            "strengthChecklist", 
            "strengthScore", 
            "suggestions"
          ]
        }
      }
    });

    try {
      const result = JSON.parse(response.text || '{}');
      return result as import('../types').PromptPack;
    } catch (error) {
      console.error("Failed to parse Gemini response", error);
      throw new Error("An error occurred while processing the stabilization protocol.");
    }
  }
}

export const geminiService = new GeminiService();
