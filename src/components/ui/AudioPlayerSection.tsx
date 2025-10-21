import { useStore } from '@nanostores/react';
import AudioPlayer from "@components/audio-player";
import { interviewAudioFiles } from '@data/interview-audio';
import { audioPlayerState, audioPlayerActions } from '@stores/audioPlayerStore';
import { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

interface AudioPlayerSectionProps {
  className?: string;
}

export function AudioPlayerSection({ className = '' }: AudioPlayerSectionProps) {
  const state = useStore(audioPlayerState);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleTimeUpdate = (time: number) => {
    if (mountedRef.current) {
      audioPlayerActions.updateTime(time);
    }
  };

  const handleTrackChange = (track: number) => {
    if (mountedRef.current) {
      audioPlayerActions.changeTrack(track);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    if (mountedRef.current) {
      audioPlayerActions.togglePlay(playing);
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (mountedRef.current) {
      audioPlayerActions.updateVolume(volume);
    }
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    if (mountedRef.current) {
      audioPlayerActions.updatePosition(data.x, data.y);
    }
  };

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={state.position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="w-[400px] backdrop-blur-sm bg-gray-900/70 shadow-lg transition-all duration-200 rounded-lg">
          <div className="text-xs text-gray-400 text-center pt-2">
            Oral History Project Interviews
          </div>
          <div className="drag-handle h-8 cursor-grab active:cursor-grabbing hover:bg-gray-800/50 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-16 h-1 rounded-full bg-gray-400"></div>
              <div className="w-16 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
          <AudioPlayer
            audioFiles={interviewAudioFiles}
            variant="compact"
            className="bg-transparent text-white p-4"
            initialTrack={state.currentTrack}
            currentTime={state.elapsedTime}
            isPlaying={state.isPlaying}
            volume={state.volume}
            onTimeUpdate={handleTimeUpdate}
            onTrackChange={handleTrackChange}
            onPlayPause={handlePlayPause}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </Draggable>
  );
}
