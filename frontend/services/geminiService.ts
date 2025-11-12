
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "An overall score for the resume from 1 to 10, considering its match with the job description, clarity, and ATS friendliness.",
    },
    executiveSummary: {
      type: Type.STRING,
      description: "A concise, professional summary (2-3 sentences) of the resume's effectiveness and key characteristics.",
    },
    topStrengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 to 5 key strengths of the resume.",
    },
    mainImprovements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 to 5 actionable and critical areas for improvement.",
    },
    performanceMetrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metricName: { type: Type.STRING, description: "Name of the metric (e.g., 'Clarity & Readability', 'Impact & Achievements', 'Keyword Optimization')." },
          score: { type: Type.INTEGER, description: "Score from 1 to 10 for this metric." },
          explanation: { type: Type.STRING, description: "A brief explanation for the score." },
        },
        required: ["metricName", "score", "explanation"],
      },
    },
    atsCompatibilityChecklist: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                checklistItem: { type: Type.STRING, description: "The ATS compatibility aspect being checked (e.g., 'Standard Section Headings', 'Absence of Graphics/Charts')." },
                isCompatible: { type: Type.BOOLEAN, description: "True if the resume passes this check, false otherwise." },
                reasoning: { type: Type.STRING, description: "A brief reason for the compatibility status."},
            },
            required: ["checklistItem", "isCompatible", "reasoning"],
        },
    },
    recommendedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of important keywords missing from the resume that are present in the job description.",
    },
  },
  required: [
    "overallScore",
    "executiveSummary",
    "topStrengths",
    "mainImprovements",
    "performanceMetrics",
    "atsCompatibilityChecklist",
    "recommendedKeywords",
  ],
};


export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are an expert career coach and ATS (Applicant Tracking System) optimization specialist.
      Analyze the following resume text based on the provided job description.
      Provide a detailed, constructive review. Your response MUST be a JSON object that strictly adheres to the provided schema.
      Do not include any markdown formatting or escape characters in your response.

      Job Description:
      ---
      ${jobDescription || "No job description provided. Analyze for general best practices."}
      ---

      Resume Text:
      ---
      ${resumeText}
      ---
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    // Fix: According to the Gemini API guidelines, when a response schema is used,
    // the JSON content is returned as a string in `response.text` and must be parsed.
    const jsonText = response.text.trim();
    try {
      const result = JSON.parse(jsonText);
      return result as AnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonText);
      throw new Error("Failed to analyze resume due to an invalid response from the AI model.");
    }

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume. The AI model may be temporarily unavailable.");
  }
};
