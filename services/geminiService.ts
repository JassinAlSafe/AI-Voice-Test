
import { GoogleGenAI, Modality } from "@google/genai";

const BARRY_WHITE_STYLE_PROMPT = "Speak in an exceptionally deep, bass-heavy, and resonant voice, using the lowest possible comfortable vocal register. The tone should be a profound baritone, almost a basso. Use a slow, rhythmic, and soulful cadence. Every word should feel smooth and 'velvety,' with a warm, intimate vibrato. Add a faint, friendly rasp at the edges of the voice and make the tone incredibly relaxed and charming, like a late-night radio icon.";

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