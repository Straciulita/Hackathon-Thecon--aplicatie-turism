import Constants from "expo-constants";

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateVibe(locationName: string, originalDescription: string) {
  const prompt = `Ești un explorator de cafea din Galați. Rescrie creativ descrierea locației '${locationName}' ('${originalDescription}'). Text final: inspirat, 3-4 propoziții, vibe unic.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: [{ text: prompt }],
        config: { temperature: 0.8, maxOutputTokens: 300 }
      }),
    });

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.[0]?.text ?? originalDescription;

    return text.trim();
  } catch (err) {
    console.error("Gemini Fetch Error:", err);
    return `[Eroare Rețea] ${originalDescription}`;
  }
}
