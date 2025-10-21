import { atom } from 'nanostores';

export interface AudioPlayerState {
  currentTrack: number;
  elapsedTime: number;
  isPlaying: boolean;
  volume: number;
  lastUpdateTimestamp: number;
  position: {
    x: number;
    y: number;
  };
}

const STORAGE_KEY = 'mh-audio-player-state';

const defaultState: AudioPlayerState = {
  currentTrack: 0,
  elapsedTime: 0,
  isPlaying: false,
  volume: 1,
  lastUpdateTimestamp: Date.now(),
  position: { x: 0, y: 0 }
};

// Initialize state from storage or defaults
const getInitialState = (): AudioPlayerState => {
  if (typeof window === 'undefined') return defaultState;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      // Update timestamp and calculate elapsed time if playing
      if (state.isPlaying) {
        const timeDiff = (Date.now() - state.lastUpdateTimestamp) / 1000;
        return {
          ...state,
          elapsedTime: state.elapsedTime + timeDiff,
          lastUpdateTimestamp: Date.now()
        };
      }
      return state;
    }
  } catch (e) {
    console.error('Error loading audio player state:', e);
  }
  return defaultState;
};

export const audioPlayerState = atom<AudioPlayerState>(getInitialState());

// Subscribe to changes and persist to storage
audioPlayerState.subscribe((state) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        lastUpdateTimestamp: Date.now()
      }));
    } catch (e) {
      console.error('Error saving audio player state:', e);
    }
  }
});

// Helper functions for common operations
export const audioPlayerActions = {
  updateTime: (time: number) => {
    const currentState = audioPlayerState.get();
    audioPlayerState.set({
      ...currentState,
      elapsedTime: time,
      lastUpdateTimestamp: Date.now()
    });
  },

  togglePlay: (playing: boolean) => {
    const currentState = audioPlayerState.get();
    audioPlayerState.set({
      ...currentState,
      isPlaying: playing,
      lastUpdateTimestamp: Date.now()
    });
  },

  changeTrack: (track: number) => {
    const currentState = audioPlayerState.get();
    audioPlayerState.set({
      ...currentState,
      currentTrack: track,
      elapsedTime: 0,
      lastUpdateTimestamp: Date.now()
    });
  },

  updateVolume: (volume: number) => {
    const currentState = audioPlayerState.get();
    audioPlayerState.set({
      ...currentState,
      volume,
      lastUpdateTimestamp: Date.now()
    });
  },

  updatePosition: (x: number, y: number) => {
    const currentState = audioPlayerState.get();
    audioPlayerState.set({
      ...currentState,
      position: { x, y }
    });
  }
};
