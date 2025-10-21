import React, { useRef, useState } from 'react';
import type { InterviewAudio } from '../../data/interview-audio';

interface AudioPlayerProps {
  audioFiles: InterviewAudio[];
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export default function AudioPlayerComponent({ 
  audioFiles, 
  variant = 'horizontal',
  className = ''
}: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = audioFiles[currentTrackIndex];

  // Make this function available globally for the play buttons
  React.useEffect(() => {
    (window as any).playTrack = (index: number) => {
      setCurrentTrackIndex(index);
      if (audioRef.current) {
        audioRef.current.play();
      }
    };

    return () => {
      delete (window as any).playTrack;
    };
  }, []);

  return (
    <div className={`${className} ${variant === 'vertical' ? 'space-y-6' : ''}`}>
      <div className={`bg-gray-300 p-6 rounded-lg shadow-lg ${
        variant === 'horizontal' ? 'flex items-center gap-6' : ''
      }`}>
        <div className={variant === 'horizontal' ? 'flex-1' : ''}>
          <h2 className="text-xl font-semibold text-white mb-2">{currentTrack.title}</h2>
          <p className="text-gray-400 mb-4">{currentTrack.excerpt}</p>
        </div>
        
        <div className={variant === 'horizontal' ? 'flex-1' : ''}>
          <audio
            ref={audioRef}
            src={currentTrack.url}
            controls
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
