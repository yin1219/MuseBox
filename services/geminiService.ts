import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIInspirations = async (
  topic: string,
  description: string,
  count: number = 5
): Promise<string[]> => {
  try {
    const prompt = `
      Create ${count} short, actionable, and creative inspiration cards (ideas) for a collection box titled "${topic}".
      Context/Description of the box: "${description}".
      
      The output must be specific, punchy, and ready to use as a writing prompt or idea starter.
      Language: Traditional Chinese (繁體中文).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    // Parse the JSON array of strings
    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
