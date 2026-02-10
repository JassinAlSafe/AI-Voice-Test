
import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 font-serif mb-3">How to Channel the Maestro</h2>
        <p>
          To get that legendary "Velvet Maestro" energy, you need to guide the AI. The text you write is crucial for the performance. Use bracket tags for mannerisms and punctuation for pacing.
        </p>
      </div>

      <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-amber-200 mb-2">Pro Tips for the "Barry" Effect:</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>
            <strong>Use Bracket Tags:</strong> Trigger specific mannerisms like{' '}
            <code className="bg-slate-700 text-amber-300 px-1 py-0.5 rounded text-sm">
              [deep laugh]
            </code>,{' '}
            <code className="bg-slate-700 text-amber-300 px-1 py-0.5 rounded text-sm">
              [whispering]
            </code>, or{' '}
            <code className="bg-slate-700 text-amber-300 px-1 py-0.5 rounded text-sm">
              [pause=1s]
            </code>.
          </li>
          <li>
            <strong>Punctuation is Pacing:</strong> Use ellipses (...) and extra commas to force the AI to "breathe" and drag out vowels, which is key to that soulful sound.
          </li>
           <li>
            <strong>The Iapetus Voice:</strong> This experience uses the 'Iapetus' voice model, which provides a deep, resonant tone suitable for handling the bass instructions without distortion.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-amber-200 mb-2">Example Text:</h3>
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg border border-slate-700 text-sm whitespace-pre-wrap">
          <code>
            [deep laugh] Oh, baby... [pause=1s] You know, when it comes to high-fidelity AI... [pause=0.5s] it's all about that soul. [whispering] Smooth. [pause=1s] Let's take this conversation to a deeper level.
          </code>
        </pre>
      </div>
    </div>
  );
};

export default Instructions;
