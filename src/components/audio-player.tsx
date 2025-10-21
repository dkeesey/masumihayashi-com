import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2 } from 'lucide-react';

interface AudioFile {
  url: string;
  title: string;
  excerpt: string;
  interviewee?: string;
  timestamp?: string;
  transcript?: string;
  context?: string;
}

type PlayerVariant = 'compact' | 'horizontal' | 'vertical' | 'inline' | 'timeline';

interface AudioPlayerProps {
  audioFiles: AudioFile[];
  variant?: PlayerVariant;
  className?: string;
  showTranscript?: boolean;
  showTrackList?: boolean;
  isGlobal?: boolean;
  onTrackSelect?: (index: number) => void;
  initialTrack?: number;
  currentTime?: number;
  isPlaying?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onTimeUpdate?: (time: number) => void;
  onPlayPause?: (playing: boolean) => void;
  onTrackChange?: (track: number) => void;
  context?: string;
}

export default function AudioPlayer({ 
  audioFiles,
  variant = 'compact',
  className = '',
  showTranscript = false,
  showTrackList = false,
  isGlobal = false,
  onTrackSelect,
  initialTrack = 0,
  currentTime: externalCurrentTime,
  isPlaying: externalIsPlaying = false,
  volume: externalVolume = 1,
  onVolumeChange,
  onTimeUpdate,
  onPlayPause,
  onTrackChange,
  context,
}: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(externalIsPlaying);
  const [currentTime, setCurrentTime] = useState(externalCurrentTime || 0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(externalVolume);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasAudioFiles = Array.isArray(audioFiles) && audioFiles.length > 0;

  useEffect(() => {
    if (externalCurrentTime !== undefined && Math.abs(externalCurrentTime - currentTime) > 1) {
      setCurrentTime(externalCurrentTime);
      if (audioRef.current) {
        audioRef.current.currentTime = externalCurrentTime;
      }
    }
  }, [externalCurrentTime]);

  useEffect(() => {
    if (externalIsPlaying !== undefined && externalIsPlaying !== isPlaying) {
      setIsPlaying(externalIsPlaying);
      if (audioRef.current) {
        if (externalIsPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Playback prevented:", error);
              setIsPlaying(false);
              onPlayPause?.(false);
            });
          }
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [externalIsPlaying]);

  useEffect(() => {
    if (externalVolume !== undefined && externalVolume !== volume) {
      setVolume(externalVolume);
      if (audioRef.current) {
        audioRef.current.volume = externalVolume;
      }
    }
  }, [externalVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Start playing on mount if isPlaying is true
  useEffect(() => {
    let mounted = true;

    if (audioRef.current && externalIsPlaying) {
      audioRef.current.currentTime = externalCurrentTime || 0;
      if (mounted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (mounted) {
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
              onPlayPause?.(false);
            }
          });
        }
      }
    }

    return () => {
      mounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Audio event handlers
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    setCurrentTime(audio.currentTime);
    onTimeUpdate?.(audio.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    setDuration(audio.duration);
  };

  const handleEnded = () => {
    if (currentTrack < audioFiles.length - 1) {
      handleTrackChange('next');
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    onVolumeChange?.(newVolume);
  };

  // Common player controls
  const PlayerControls = () => (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full hover:bg-gray-400/60 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
      {audioFiles.length > 1 && (
        <>
          <button
            onClick={() => handleTrackChange('prev')}
            className="p-2 rounded-full hover:bg-gray-400/60 transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleTrackChange('next')}
            className="p-2 rounded-full hover:bg-gray-400/60 transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </>
      )}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-2 rounded-full hover:bg-gray-400/60 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      <div className="relative">
        <label htmlFor="audio-volume" className="sr-only">
          Volume control
        </label>
        <input
          id="audio-volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          aria-label="Volume control"
          onChange={handleVolumeChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          title="Volume control"
        />
        <div
          className={`absolute h-full bg-primary rounded-full ${volume === 0 ? 'w-0' : `w-[${volume * 100}%]`}`}
        />
      </div>
    </div>
  );

  // Progress bar component
  const ProgressBar = () => {
    const progressWidth = `w-[${Math.floor((currentTime / duration) * 100)}%]`;
    const progressPercent = Math.floor((currentTime / duration) * 100);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (progressRef.current) {
        progressRef.current.setAttribute('aria-valuemin', '0');
        progressRef.current.setAttribute('aria-valuemax', '100');
        progressRef.current.setAttribute('aria-valuenow', progressPercent.toString());
      }
    }, [progressPercent]);
    
    return (
      <div className="relative h-1 bg-gray-200 rounded-full flex-grow">
        <div
          ref={progressRef}
          className={`absolute h-full bg-primary rounded-full ${progressWidth}`}
          role="progressbar"
          aria-label="Audio progress"
        />
        <label htmlFor="audio-progress" className="sr-only">
          Audio time slider
        </label>
        <input
          id="audio-progress"
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleTimeChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          title={`Time slider: ${formatTime(currentTime)} of ${formatTime(duration)}`}
          aria-label="Audio time slider"
        />
      </div>
    );
  };

  // Timeline variant specific component
  const TimelineView = () => (
    <div className="relative">
      <div className="absolute left-1/2 w-px h-full bg-gray-200" />
      <div className="space-y-8">
        {/* Removed timelineEvents */}
      </div>
    </div>
  );

  // Inline variant specific component
  const InlineView = () => (
    <div className="border rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <PlayerControls />
        <div className="flex-grow">
          <div className="mb-2">
            <h4 className="font-medium">{currentAudioFile.title}</h4>
            {currentAudioFile.interviewee && (
              <p className="text-sm text-gray-600">
                Interview with {currentAudioFile.interviewee}
              </p>
            )}
          </div>
          <ProgressBar />
          {showTranscript && currentAudioFile.transcript && (
            <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
              {currentAudioFile.transcript}
            </div>
          )}
        </div>
      </div>
      {context && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-4">
          <p>{context}</p>
        </div>
      )}
    </div>
  );

  // Global player specific component
  const GlobalPlayer = () => (
    <div className={`fixed z-50 ${isMinimized ? 'bottom-4 right-4' : 'top-[72px] right-4'}`}>
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Internee Interviews</h3>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label={isMinimized ? "Maximize player" : "Minimize player"}
              title={isMinimized ? "Maximize player" : "Minimize player"}
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
          {!isMinimized && (
            <>
              <PlayerControls />
              <ProgressBar />
              {showTrackList && (
                <div className="mt-4 space-y-2">
                  {audioFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrackClick(index)}
                      className={`w-full text-left p-2 rounded-md text-sm hover:bg-gray-100
                        ${currentTrack === index ? 'bg-primary text-white' : ''}`}
                    >
                      <div className="font-medium">{file.excerpt}</div>
                      {file.interviewee && (
                        <div className="text-xs opacity-75">
                          Interview with {file.interviewee}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Compact variant specific component
  const CompactView = () => (
    <div className="border-b border-gray-400/60">
      <div className="border-b border-gray-400/60 pb-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground/80">Internee Interviews</h3>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-sm font-medium line-clamp-2">
          {currentAudioFile.excerpt}
        </div>
        <div className="flex items-center space-x-4">
          <PlayerControls />
          <div className="flex-grow">
            <ProgressBar />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile variant specific component
  const MobileView = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Semi-transparent overlay background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative">
        {/* Label */}
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 border-b border-white/20">
          <h3 className="text-sm font-medium text-white/90">Internee Interviews</h3>
        </div>

        {/* Controls */}
        <div className="bg-black/40 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center space-x-3 max-w-screen-lg mx-auto">
            <PlayerControls />
            <div className="flex-grow min-w-0">
              <div className="text-sm font-medium truncate mb-1 text-white">
                {currentAudioFile.excerpt}
              </div>
              <ProgressBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Event handlers
  const handleTrackChange = (direction: 'prev' | 'next') => {
    const newTrack = direction === 'prev'
      ? (currentTrack - 1 + audioFiles.length) % audioFiles.length
      : (currentTrack + 1) % audioFiles.length;
    handleTrackClick(newTrack);
  };

  const handleTrackClick = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    onTrackSelect?.(index);
    onTrackChange?.(index);
  };

  const handlePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    onPlayPause?.(newIsPlaying);
    if (audioRef.current) {
      if (newIsPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Playback prevented:", error);
            setIsPlaying(false);
            onPlayPause?.(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Utility function to format time
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Effect hooks
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < audioFiles.length - 1) {
        handleTrackChange('next');
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  if (!hasAudioFiles) return null;

  const currentAudioFile = audioFiles[currentTrack];

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileView />
      </div>

      {/* Desktop View */}
      <div className={className}>
        <audio
          ref={audioRef}
          src={currentAudioFile.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          aria-label="Internee Interviews audio player"
        />
        
        {variant === 'compact' && <CompactView />}
        {variant === 'horizontal' && <div>Horizontal View</div>}
        {variant === 'vertical' && <div>Vertical View</div>}
        {variant === 'inline' && <InlineView />}
        {variant === 'timeline' && <TimelineView />}
        {isGlobal && <GlobalPlayer />}
      </div>
    </>
  );
}