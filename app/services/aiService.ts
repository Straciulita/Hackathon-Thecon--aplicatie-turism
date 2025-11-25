import Constants from "expo-constants";

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing from app.config.js");
}

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateVibe(locationName: string, originalDescription: string) {
  const prompt = `Ești un explorator de cafea din Galați. Rescrie creativ descrierea locației '${locationName}' ('${originalDescription}'). Text final: inspirat, 3-4 propoziții, vibe unic.`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY,
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        },
      }),
    });

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.output_text ??
      null;

    if (text) return text.trim();
    return `[Eroare Gemini] ${originalDescription}`;
  } catch (err) {
    console.error(err);
    return `[Eroare Rețea] ${originalDescription}`;
  }
}
