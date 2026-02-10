
import { GoogleGenAI, Modality } from "@google/genai";

const BARRY_WHITE_STYLE_PROMPT = "Embody the iconic voice of a soul legend. Speak from the chest, producing an extremely deep, resonant bass-baritone that rumbles with warmth and authority. The cadence must be slow, deliberate, and impeccably rhythmic, making every word feel important. The texture of the voice should be pure velvet—smooth, rich, and intimate. Infuse the delivery with a confident, romantic charm. Introduce a gentle, smoky rasp on certain words for emphasis, creating a seductive, late-night feel. The overall tone is one of effortless cool and profound soulfulness.";

/**
 * Generates audio from text using Gemini, styled after Barry White.
 * @param userText The text to be converted to speech.
 * @returns A base64 encoded string of the audio data, or null if an error occurs.
 */
export async function generateBarryWhiteVoice(userText: string): Promise<string | null> {
  // It is recommended to create a new client for each request
  // to ensure the latest API key from the environment is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepend the style prompt to the user's text to instruct the TTS model.
  const fullPrompt = `${BARRY_WHITE_STYLE_PROMPT}: ${userText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Iapetus is selected for its deep, resonant tone, suitable for the Barry White style.
            prebuiltVoiceConfig: { voiceName: 'Iapetus' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
        console.error("No audio data in API response:", JSON.stringify(response, null, 2));
        return null;
    }
    
    return audioData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}