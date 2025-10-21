export {};

declare global {
  interface Window {
    playTrack: (index: number) => void;
  }
}
