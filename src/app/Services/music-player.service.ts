import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  public audio = new Audio();
  private playlist: any[] = [];  
  private allSongs: any[] = [];
  private currentSongIndex: number = -1;
  public lastPlayedSong: any;
  private isAudioReady = false;

  currentSongSubject = new Subject<any>();
  currentSong$ = this.currentSongSubject.asObservable();

  private isPlayingSubject = new Subject<boolean>();
  isPlaying$ = this.isPlayingSubject.asObservable();
  

  private currentTimeSubject = new Subject<number>();
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new Subject<number>(); 
  duration$ = this.durationSubject.asObservable(); 

  private muteSubject = new BehaviorSubject<boolean>(false);
  mute$ = this.muteSubject.asObservable();

  private repeatSubject = new BehaviorSubject<boolean>(false);
  repeat$ = this.repeatSubject.asObservable();


  public shuffleSubject = new BehaviorSubject<boolean>(false);
  shuffle$ = this.shuffleSubject.asObservable();
  

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatSubject.value) {
        // Repeat the current song when the repeat option is enabled
        this.playSong(this.lastPlayedSong);
      } else {
      this.skipNext();
      }
    });
   }

   setPlaylist(playlist: any[]) {
    this.playlist = playlist;
    this.allSongs = [...this.playlist];  // Add playlist songs to the allSongs list
    this.currentSongIndex = 0;  
  }

  setHomeSongs(songs: any[]) {
    this.allSongs = songs;  // If home songs are being used separately
    this.currentSongIndex = 0;  
  }

  playSong(song: any) {
    if (this.audio.src !== song.url) {
    this.audio.pause();
    this.audio.src = song.url;
    this.audio.load();  
    }
    this.audio.play().then(() => {
      this.currentSongIndex = this.allSongs.findIndex(s => s.url === song.url);
      this.currentSongSubject.next(song);
      this.isPlayingSubject.next(true);
      this.lastPlayedSong = song;

    }).catch((error) => {
      console.error('Error playing the audio: ', error);
    });
  }
  
  pauseSong() {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  
  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  toggleMute() {
    const muteState = !this.muteSubject.value;
    this.muteSubject.next(muteState);
    this.audio.muted = muteState;  
  }

  toggleRepeat() {
    const repeat = !this.repeatSubject.value;
    this.repeatSubject.next(repeat);
  }

  toggleShuffle() {
    this.shuffleSubject.next(!this.shuffleSubject.value);
  }

  get shuffleState(): boolean {
    return this.shuffleSubject.value;
  }
  
  skipNext() {
    if (this.shuffleSubject.value) {
      // When shuffle is on, pick a random song
      const randomIndex = Math.floor(Math.random() * this.allSongs.length);
      this.currentSongIndex = randomIndex;
    } else {
    if (this.currentSongIndex < this.allSongs.length - 1) {
      this.currentSongIndex++;
    } else {
      this.currentSongIndex = 0;
    }
    }
    const nextSong = this.allSongs[this.currentSongIndex];
    this.playSong(nextSong); 
    this.currentSongSubject.next(nextSong);
  }
  
  skipPrevious() {
    if (this.currentSongIndex > 0) {
      this.currentSongIndex--;
    } else {
      this.currentSongIndex = this.allSongs.length - 1;
    }
    const previousSong = this.allSongs[this.currentSongIndex];
    this.playSong(previousSong); 
    this.currentSongSubject.next(previousSong);
  }

  getLastPlayedSong() {
    return this.lastPlayedSong;
  }

  seekTo(time: number) {
    this.audio.currentTime = time;
    this.currentTimeSubject.next(this.audio.currentTime);
  }
  
}
