import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Candidate } from "../types";

// Schema for structured candidate data extraction
const candidateSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    candidates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          experience: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          linkedin: { type: Type.STRING },
        },
        required: ["name", "title"],
      },
    },
    message: { type: Type.STRING, description: "A conversational response to the user." },
  },
  required: ["candidates", "message"],
};

export const generateAgentResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  agentType: string
): Promise<{ text: string; candidates?: Candidate[] }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // Mock response matching real-world data for Guest Mode
      if (prompt.toLowerCase().includes('list') || prompt.toLowerCase().includes('candidates') || prompt.toLowerCase().includes('find')) {
         return {
            text: "I found 5 qualified candidates that match your criteria based on public data:\n\n1. Amy Hood\nTitle: Chief Financial Officer\nCompany: Microsoft\nExperience: 20+ years\n\n2. Colette Kress\nTitle: EVP & CFO\nCompany: NVIDIA\nExperience: 24 years",
            candidates: [
               { 
                 id: '1', 
                 name: "Amy Hood", 
                 title: "Chief Financial Officer", 
                 company: "Microsoft", 
                 location: "Redmond, WA",
                 experience: "21+ years",
                 email: "amy.hood@microsoft.com",
                 phone: "+1 (425) 882-8080",
                 linkedin: "linkedin.com/in/amyhood",
                 requiresAuth: false 
               },
               { 
                 id: '2', 
                 name: "Colette Kress", 
                 title: "Executive VP & Chief Financial Officer", 
                 company: "NVIDIA", 
                 location: "Santa Clara, CA",
                 experience: "25+ years",
                 email: "colette.kress@nvidia.com",
                 phone: "+1 (408) 486-2000",
                 linkedin: "linkedin.com/in/colette-kress",
                 requiresAuth: false 
               },
               { 
                 id: '3', 
                 name: "Sarah Friar", 
                 title: "Chief Financial Officer", 
                 company: "OpenAI", 
                 location: "San Francisco, CA",
                 experience: "20+ years",
                 email: "sarah.friar@openai.com",
                 phone: "+1 (415) 980-6000",
                 linkedin: "linkedin.com/in/sarah-friar-922b044",
                 requiresAuth: false 
               },
               { 
                 id: '4', 
                 name: "Ruth Porat", 
                 title: "President & CIO", 
                 company: "Alphabet", 
                 location: "Mountain View, CA",
                 experience: "35+ years",
                 email: "ruth.porat@google.com",
                 phone: "+1 (650) 253-0000",
                 linkedin: "linkedin.com/in/ruth-porat",
                 requiresAuth: false 
               },
               { 
                 id: '5', 
                 name: "Luca Maestri", 
                 title: "CFO", 
                 company: "Apple", 
                 location: "Cupertino, CA",
                 experience: "30+ years",
                 email: "luca.maestri@apple.com",
                 phone: "+1 (408) 996-1010",
                 linkedin: "linkedin.com/in/luca-maestri",
                 requiresAuth: false 
               }
            ]
         }
      }
      return {
        text: "I can help you with that. Please verify your API Key to access the live EQ.app agent network and search specifically for your needs.",
        candidates: []
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the ${agentType} Agent for EQ.app, a premium AI assistant defined by elegance, simplicity, and clarity.
    
    Your goal is to provide **ACCURATE, REAL-WORLD** information. 
    
    If the user asks for a list of people, candidates, or leads:
    1. Identify **REAL** individuals who currently hold relevant positions at actual companies. Do not invent fake people or companies.
    2. Generate a list of 3-5 high-quality profiles that match the query using the JSON schema.
    
    For the contact details, provide the best available information:
    - **Email**: Provide the likely corporate email format (e.g., first.last@company.com) if the actual email is not public.
    - **Phone**: Provide the company HQ phone number if a direct line is not available.
    - **LinkedIn**: Provide the correct public LinkedIn profile URL.
    - **Experience**: Estimate years of experience based on public career history.
    
    Your tone should be professional, concise, and helpful.
    If the user is just chatting, return an empty candidates array in the JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: candidateSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);
    
    const candidates: Candidate[] = parsed.candidates?.map((c: any, index: number) => ({
      id: `cand-${Date.now()}-${index}`,
      name: c.name,
      title: c.title,
      company: c.company || "Not specified",
      location: c.location || "Not specified",
      experience: c.experience || "Not specified",
      email: c.email || "Available upon request",
      phone: c.phone || "Available upon request",
      linkedin: c.linkedin || "linkedin.com",
      requiresAuth: false
    })) || [];

    return {
      text: parsed.message || "Here are the results I found.",
      candidates
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I encountered an issue retrieving real-time data from the network. Please try again.",
      candidates: []
    };
  }
};