
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLessonAssistance = async (lessonTitle: string, lessonContent: string, question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert academic assistant for MemberHub. 
      The user is studying a lesson titled "${lessonTitle}". 
      Context Content: ${lessonContent.substring(0, 1000)}...
      
      User Question: ${question}`,
      config: {
        systemInstruction: "Provide concise, helpful, and motivating answers based on the lesson content provided.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Assistance Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
