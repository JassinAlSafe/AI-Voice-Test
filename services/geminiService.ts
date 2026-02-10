
import { GoogleGenAI, Modality } from "@google/genai";

const BARRY_WHITE_STYLE_PROMPT = "Embody the voice of a soul legend at its absolute deepest. The vocal register should be a profound basso profundo, the lowest possible human male vocal range, resonating directly from the chest with a powerful, warm vibration. The cadence is slow, deliberate, and impeccably rhythmic. The texture is pure, smooth velvet. Crucially, the voice should sound as if recorded in a large, softly lit studio, creating a natural, subtle reverb and a whisper of echo that adds a spacious, atmospheric, and intimate quality. Infuse the delivery with confident, romantic charm and a gentle, smoky rasp for emphasis. The overall tone is one of effortless cool and profound soulfulness.";

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