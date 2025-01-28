import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MusicPlayerService } from '../Services/music-player.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { filter } from 'rxjs';


@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlist: any;
  currentSong: any;
  isPlaying: boolean = false;
  showInfoBar: boolean = true;
  isMuted: boolean = false;

  currentTime: number = 0;  
  duration: number = 0;    
  isHovering: boolean = false;
  hoverTimePosition: number = 0; 
  hoverTime: number = 0;
  private currentTimeInterval: any;

  
  
  playlists = [
    { 
      name: 'New & Trending',  
      imageUrl: 'assets/images/playlist1.avif',
      songs: [
        { imageUrl: 'assets/images/newtrending5.jpg', name: 'Millionaire', artist: 'Yo Yo Honey Singh', year: 'Song•2024', url: 'assets/music/Millionaire.mp3'},
        { imageUrl:'assets/images/newtrending1.jpg', name: 'Blinding Lights', artist: 'The Weeknd', year: 'Song•2019', url: 'assets/music/Blinding Lights.mp3' },
        { imageUrl:'assets/images/newtrending2.jpg', name: 'Levitating', artist: 'Dua Lipa DaBaby', year: 'Song•2020', url: 'assets/music/Levitating.mp3' },
        { imageUrl:'assets/images/newtrending3.jpg', name: 'Let Me Love You (feat. Justin Bieber)', artist: 'DJ Snake Justin Bieber', year: 'Song•2016', url: 'assets/music/Let Me Love You.mp3' },
        { imageUrl: 'assets/images/newtrending4.jpg', name: 'Starboy (feat. Daft Punk)', artist: 'The Weeknd', year: 'Song•2016', url: 'assets/music/Starboy.mp3'},
      ] 
    },
    { 
      name: 'POP Hits', 
      imageUrl: 'assets/images/playlist2.jpg',
      songs: [
        { imageUrl:'assets/images/pophits1.jpg', name: 'Shape of You', artist: 'Ed Sheeran', year: 'Song•2017', url: 'assets/music/Shape of You.mp3' },
        { imageUrl:'assets/images/pophits2.jpg', name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', year: 'Song•2015', url: 'assets/music/Uptown Funk.mp3' },
        { imageUrl:'assets/images/pophits3.jpg', name: 'Rolling in the Deep', artist: 'Adele', year: 'Song•2010', url: 'assets/music/Rolling in the Deep.mp3' }
      ] 
    },
    { 
      name: 'Indian & Bollywood', 
      imageUrl: 'assets/images/playlist3.jpg',
      songs: [
        { imageUrl:'assets/images/bollywood1.jpg', name: 'Apna Bana Le (From "Bhediya")', artist: 'Arijit Singh', year: 'Song•2022', url: 'assets/music/Apna Bana Le.mp3' },
        { imageUrl:'assets/images/bollywood2.jpg', name: 'Tu Hain Toh (From "Mr. And Mrs. Mahi")', artist: 'Hunny Bunny', year: 'Song•2024', url: 'assets/music/Tu Hain Toh.mp3' },
        { imageUrl:'assets/images/bollywood3.jpg', name: 'Soulmate', artist: 'Badshah X Arijit Singh', year: 'Song•2024' , url: 'assets/music/Soulmate.mp3' },
        { imageUrl:'assets/images/bollywood4.jpg', name: 'Ranjhan', artist: 'Parampara Tandon', year: 'Song•2024', url: 'assets/music/Raanjhan.mp3' }
      ] 
    },
    { 
      name: 'Chill Vibes', 
      imageUrl: 'assets/images/playlist4.jpg',
      songs: [
        { imageUrl:'assets/images/chillvibes1.jpg', name: 'Sunflower', artist: 'Post Malone/Swae Lee', year: 'Song•2018', url: 'assets/music/Sunflower.mp3' },
        { imageUrl:'assets/images/chillvibes2.jpg', name: 'Stay', artist: 'The Kid LAROI Justin Bieber', year: 'Song•2021', url: 'assets/music/STAY.mp3' },
        { imageUrl:'assets/images/chillvibes3.jpg', name: 'Dandelions', artist: 'Ruth B.', year: 'Song•2017', url: 'assets/music/Dandelions.mp3' }
      ] 
    }
  ];

  constructor(private route: ActivatedRoute, private musicPlayerService: MusicPlayerService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const playlistName = this.route.snapshot.paramMap.get('name');
    this.playlist = this.playlists.find(p => p.name === playlistName);
    this.musicPlayerService.setPlaylist(this.playlist.songs);

    this.musicPlayerService.currentSong$.subscribe(song => {
      this.currentSong = song;
    });

    this.musicPlayerService.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying;
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

    this.startCurrentTimeInterval();
    this.ScrollToTop();
  }

  // ngOnDestroy(): void {
  //   clearInterval(this.currentTimeInterval);
  // }

  startCurrentTimeInterval() {
    this.currentTimeInterval = setInterval(() => {
      if (this.isPlaying) {
        this.musicPlayerService.currentTime$.subscribe((time) => {
          this.currentTime = time;
        });
      }
    }, 1000);
  }

  saveForLater() {
    this.snackBar.open('Save this for later', 'Close', {
      duration: 3000,  
      verticalPosition: 'top',  
      horizontalPosition: 'center', 
    });
  }

  playSong(song: any) {
    this.musicPlayerService.playSong(song);
    console.log('Playing song:', song.name);
  }

  playAllSongs() {
    this.musicPlayerService.playSong(this.playlist.songs[0]);  

    this.musicPlayerService.audio.addEventListener('ended', () => {
      this.musicPlayerService.skipNext(); 
    });
  }

  playPause() {
    if (this.isPlaying) {
      this.musicPlayerService.pauseSong();
    } else {
      if (this.currentSong) {
        this.musicPlayerService.playSong(this.currentSong);
      } else {
        this.musicPlayerService.playSong(this.playlist.songs[0]);
      }
    }
  }

  playNextSong() {
    this.musicPlayerService.skipNext();
    this.snackBar.open('Song added to play next', 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  saveToPlaylist() {
    this.snackBar.open('Playlist saved to Library', 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  shareSong() {
    this.snackBar.open('Song shared', 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center'  });
  }
  

  onSliderChange(event: any) {
    const newTime = event.target.value;
    this.musicPlayerService.seekTo(newTime);
  }

  onSliderHover(event: any) {
    const sliderWidth = event.target.offsetWidth;
    const offset = event.offsetX;
    this.isHovering = true;
    this.hoverTime = (offset / sliderWidth) * this.duration;
    this.hoverTimePosition = offset;
  }

  onSliderLeave() {
    this.isHovering = false;
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

  skipNext() {
    this.musicPlayerService.skipNext();
  }

  skipPrevious() {
    this.musicPlayerService.skipPrevious();
  }

  toggleMute() {
    this.musicPlayerService.toggleMute();
  }

  formatLabel(value: number): string {
    return `${Math.round(value)}`;
  }

  closeInfoBar() {
    this.musicPlayerService.pauseSong();
    this.currentSong = null; 
    this.isPlaying = false
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToPlayer() {
    this.router.navigate(['/player'], { queryParams: { song: JSON.stringify(this.currentSong) } });
    this.musicPlayerService.playSong(this.currentSong);
  }

  goToPlayerWithSong(song: any) {
    this.router.navigate(['/player'], { queryParams: { song: JSON.stringify(song) } });
  }

  ScrollToTop() {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Scroll to the top after route change
        window.scrollTo(0, 0);
      });
    }
  }
