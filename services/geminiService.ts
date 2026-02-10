
import { GoogleGenAI, Modality } from "@google/genai";

const BARRY_WHITE_STYLE_PROMPT = "Create a voice of impossible depth and soul. The vocal register is an extreme basso profundo, resonating with a sub-harmonic, chest-vibrating power that feels both immense and intimate. The cadence is slow and magnetic. The texture is flawless, smooth velvet. The recording environment is crucial: imagine speaking in a vast, empty concert hall at midnight. This should create a rich, pronounced reverb and a distinct but gentle echo that envelops every word, giving it an epic, atmospheric quality. The delivery must carry a confident, romantic charm, with a hint of a smoky rasp. The overall effect is the voice of a true soul legend, amplified by a cathedral-like acoustic space.";

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