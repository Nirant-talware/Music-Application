declare module 'ryan-music-player' {
    export class AudioManager {
      constructor();
      load(url: string): void;
      play(): void;
      pause(): void;
      isPlaying(): boolean;
      stop(): void;
      next(): void;
      prev(): void;
    }
    export default AudioManager;
  }
  