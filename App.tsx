
import React, { useState, useCallback } from 'react';
import { generateBarryWhiteVoice } from './services/geminiService';
import { createAudioUrl } from './utils/audioUtils';
import Instructions from './components/Instructions';
import AudioPlayer from './components/AudioPlayer';
import MusicNoteIcon from './components/icons/MusicNoteIcon';
import LoadingSpinner from './components/icons/LoadingSpinner';

const DEFAULT_PROMPT_TEXT = `[deep laugh] Oh, baby... [pause=1s] You know, when it comes to high-fidelity AI... [pause=0.5s] it's all about that soul. [whispering] Smooth. [pause=1s] Let's take this conversation to a deeper level.`;

const App: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_PROMPT_TEXT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const audioData = await generateBarryWhiteVoice(text);
      if (audioData) {
        const url = await createAudioUrl(audioData);
        setAudioUrl(url);
      } else {
        throw new Error("The API did not return any audio data. Please try again.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate audio: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [text, isLoading]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-300 font-serif">
            Velvet Maestro AI
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Channel the legendary Barry White with Gemini's Iapetus voice.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-white/10 p-6 sm:p-8 space-y-8">
          <Instructions />

          <div className="space-y-4">
            <label htmlFor="prompt-textarea" className="block text-lg font-medium text-amber-200">
              Your Text
            </label>
            <textarea
              id="prompt-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-48 p-4 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-shadow duration-200 resize-y text-slate-100 placeholder-slate-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !text.trim()}
              className="w-full sm:w-auto flex items-center justify-center px-12 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold text-lg rounded-full shadow-lg hover:shadow-amber-400/30 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-3">Generating Soul...</span>
                </>
              ) : (
                <>
                  <MusicNoteIcon />
                  <span className="ml-3">Generate Velvet Voice</span>
                </>
              )}
            </button>

            {error && (
              <div className="text-center p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {audioUrl && !isLoading && <AudioPlayer src={audioUrl} />}
          </div>
        </main>
        
        <footer className="text-center py-8 text-slate-500 text-sm">
            <p>Powered by Google Gemini. Crafted with soul.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;