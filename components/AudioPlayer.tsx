
import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <div className="w-full max-w-md mt-4">
      <audio controls autoPlay src={src} className="w-full rounded-full bg-slate-700">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
