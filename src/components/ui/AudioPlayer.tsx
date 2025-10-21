import React, { useEffect, useRef, useState } from 'react';

interface Track {
  title: string;
  url: string;
  duration: string;
  description?: string;
  date?: string;
}

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange?: (index: number) => void;
}

export function AudioPlayer({ tracks, currentTrackIndex, onTrackChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeTrack, setActiveTrack] = useState(currentTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    setActiveTrack(currentTrackIndex);
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = tracks[activeTrack].url;
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing track:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [activeTrack, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      // If there's a next track, play it
      if (activeTrack < tracks.length - 1) {
        const nextTrackIndex = activeTrack + 1;
        handleTrackChange(nextTrackIndex);
      } else if (isLooping) {
        // If looping is enabled and we're at the last track, go back to the first track
        handleTrackChange(0);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeTrack, tracks.length, isLooping]);

  const handleTrackChange = (index: number) => {
    setActiveTrack(index);
    setIsPlaying(true);
    if (onTrackChange) {
      onTrackChange(index);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Player */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-2">{tracks[activeTrack].title}</h2>
        {tracks[activeTrack].description && (
          <p className="text-gray-400 mb-4">{tracks[activeTrack].description}</p>
        )}
        
        <div className="space-y-4">
          <audio ref={audioRef} className="hidden" />
          
          {/* Progress bar */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Audio progress"
              title="Audio progress bar"
              className="flex-grow h-2 rounded-lg appearance-none bg-gray-700 cursor-pointer"
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Loop button */}
            <button
              onClick={toggleLoop}
              className={`p-2 transition-colors ${
                isLooping ? 'text-blue-400 hover:text-blue-300' : 'text-white hover:text-gray-300'
              }`}
              title={isLooping ? 'Disable loop' : 'Enable loop'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11v-1a4 4 0 014-4h14" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v1a4 4 0 01-4 4H3" />
              </svg>
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min={0}
                max={100}
                value={volume * 100}
                onChange={handleVolumeChange}
                className="w-24 h-2 rounded-lg appearance-none bg-gray-700 cursor-pointer"
                aria-label="Volume control"
                title="Volume control"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <button
            key={track.url}
            onClick={() => handleTrackChange(index)}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              index === activeTrack
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-medium ${
                  index === activeTrack ? 'text-gray-900' : 'text-white'
                }`}>{track.title}</h3>
                {track.description && (
                  <p className={`text-sm mt-1 ${
                    index === activeTrack ? 'text-gray-600' : 'text-gray-300'
                  }`}>{track.description}</p>
                )}
              </div>
              <span className={`text-sm ml-4 ${
                index === activeTrack ? 'text-gray-500' : 'text-gray-300'
              }`}>{track.duration}</span>
            </div>
            {track.date && (
              <div className={`text-xs mt-1 ${
                index === activeTrack ? 'text-gray-500' : 'text-gray-400'
              }`}>{track.date}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
