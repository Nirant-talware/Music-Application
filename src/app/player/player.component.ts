import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MusicPlayerService } from '../Services/music-player.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {

  currentSong: any;
  isPlaying = false;
  playlist: any;
  duration: number = 0;
  currentTime: number = 0;
  currentSongIndex: number = 0;
  hoverTime: number = 0;
  hoverTimePosition: number = 0;
  isHovering: boolean = false;
  isMuted: boolean = false;
  isRepeat: boolean = false;
  isShuffle: boolean = false;

  private currentTimeInterval: any;

  private audio = new Audio();
  songs: any[] = [];

  constructor(
    private musicPlayerService: MusicPlayerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const songParam = this.route.snapshot.queryParamMap.get('song');
    const allSongsParam = this.route.snapshot.queryParamMap.get('allSongs');

    if (allSongsParam) {
      this.songs = JSON.parse(allSongsParam); // Get songs if provided through queryParams
      this.musicPlayerService.setPlaylist(this.songs); // Set the playlist in the service
    }
    
    if (songParam) {
      this.currentSong = JSON.parse(songParam);
      this.musicPlayerService.playSong(this.currentSong);
    } else {
     
      this.currentSong = this.musicPlayerService.getLastPlayedSong();
      if (this.currentSong) {
        this.musicPlayerService.playSong(this.currentSong);
      }
    }

    this.musicPlayerService.isPlaying$.subscribe((isPlaying) => {
      this.isPlaying = isPlaying;
    });

    this.musicPlayerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.musicPlayerService.currentTime$.subscribe((time) => {
      this.currentTime = time;
    });

    this.musicPlayerService.duration$.subscribe((duration) => {
      this.duration = duration;
    });

    this.musicPlayerService.mute$.subscribe((isMuted) => {
      this.isMuted = isMuted; 
    });

    this.musicPlayerService.repeat$.subscribe((isRepeated) => {
      this.isRepeat = isRepeated; 
    });

    this.musicPlayerService.shuffle$.subscribe((shuffleState) => {
      this.isShuffle = shuffleState;
    });
    this.isShuffle = this.musicPlayerService.shuffleSubject.value;

    this.startCurrentTimeInterval();
  }

  ngOnDestroy(): void {
    // clearInterval(this.currentTimeInterval);
  }

  startCurrentTimeInterval() {
    this.currentTimeInterval = setInterval(() => {
      if (this.isPlaying) {
        this.musicPlayerService.currentTime$.subscribe((time) => {
          this.currentTime = time;
        });
      }
    }, 1000);
  }

  playPause() {
    this.musicPlayerService.togglePlayPause();
  }

  skipNext() {
    this.musicPlayerService.skipNext();
  }
  
  skipPrevious() {
    this.musicPlayerService.skipPrevious();
  }

  formatLabel(value: number): string {
    return `${Math.round(value)}`;
  }

  onSliderChange(event: any) {
    const newTime = event.target.value;
    this.currentTime=event.target.value;
    this.musicPlayerService.seekTo(newTime);
  }

  onSliderHover(event: any) {
    const sliderWidth = event.target.offsetWidth;
    const offset = event.offsetX;
    this.isHovering = true;
    this.hoverTime = (offset / sliderWidth) * this.duration;
    this.hoverTimePosition = offset;
  }

  playSong(song: any) {
    this.musicPlayerService.playSong(song);
    console.log('Playing song:', song.name);
  }

  onSliderLeave() {
    this.isHovering = false;
  }

  toggleMute() {
    this.musicPlayerService.toggleMute();
  }

  goToHome() {
    this.router.navigate(['/home'], {
      queryParams: { song: JSON.stringify(this.currentSong) },
    });
    this.musicPlayerService.playSong(this.currentSong);
  }

  getFormattedTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  getHoveredTime(): string {
    return this.getFormattedTime(this.hoverTime);
  }

  getCurrentTime(): string {
    return this.getFormattedTime(this.currentTime);
  }

  goToHomeBar() {
    this.router.navigate(['/home'], {
      queryParams: { song: JSON.stringify(this.currentSong) },
    });
    this.musicPlayerService.playSong(this.currentSong);
  }

  addToPlaylist() {
    this.snackBar.open('Song Added to Playlist', 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  addToLike() {
    this.snackBar.open('Liked', 'Close' , { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  shareSong() {
    this.snackBar.open('Song shared', 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center'  });
  }

  repeat() {
    this.musicPlayerService.toggleRepeat();
  }
  
  shuffle() {
    this.musicPlayerService.toggleShuffle(); 
  }

  getShuffleIconColor(): string {
    return this.isShuffle ? 'white' : 'darkgrey';
  }
}
