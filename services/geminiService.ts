
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIServiceResponse {
  text: string;
  sources?: { uri: string; title: string }[];
}

export const getLessonAssistance = async (lessonTitle: string, lessonContent: string, question: string): Promise<AIServiceResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert academic assistant for MemberHub. 
      The user is studying a lesson titled "${lessonTitle}". 
      Context Content: ${lessonContent.substring(0, 1500)}...
      
      User Question: ${question}
      
      If the lesson content doesn't fully answer the user's question, use Google Search to provide a comprehensive, up-to-date, and educational response.`,
      config: {
        systemInstruction: "Provide concise, helpful, and motivating answers based on the lesson content. If you use external search, mention it gracefully. Be professional and encouraging.",
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "I'm sorry, I couldn't generate a response.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      ?.map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title || chunk.web!.uri })) || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini Assistance Error:", error);
    return { 
      text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." 
    };
  }
};
