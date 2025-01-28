import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import { MusicPlayerService } from '../Services/music-player.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  filteredSongs: any[] = [];
  filteredPlaylists: any[] = [];

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
  currentSongIndex: number = 0;

  sidenavOpened: boolean = false;
  isMenuOpen: boolean = false;  
  clickOutsideListener: any;

  @ViewChild('playlistSection') playlistSection: ElementRef | undefined;

  playlists = [
    {
      name: 'New & Trending',
      imageUrl: 'assets/images/playlist1.avif',
    },
    {
      name: 'POP Hits',
      imageUrl: 'assets/images/playlist2.jpg',
    },
    {
      name: 'Indian & Bollywood',
      imageUrl: 'assets/images/playlist3.jpg',
    },
    {
      name: 'Chill Vibes',
      imageUrl: 'assets/images/playlist4.jpg',
    },
  ];
  
  songs = [
    {
      imageUrl: 'assets/images/newtrending5.jpg', name: 'Millionaire', artist: 'Yo Yo Honey Singh', year: 'Song•2024', url: 'assets/music/Millionaire.mp3',
    },
    {
      imageUrl: 'assets/images/newtrending1.jpg', name: 'Blinding Lights', artist: 'The Weeknd', year: 'Song•2019', url: 'assets/music/Blinding Lights.mp3',
    },
    {
      imageUrl: 'assets/images/newtrending2.jpg', name: 'Levitating', artist: 'Dua Lipa DaBaby', year: 'Song•2020', url: 'assets/music/Levitating.mp3',
    },
    {
      imageUrl: 'assets/images/newtrending3.jpg', name: 'Let Me Love You (feat. Justin Bieber)', artist: 'DJ Snake Justin Bieber', year: 'Song•2016', url: 'assets/music/Let Me Love You.mp3',
    },
    {
      imageUrl: 'assets/images/newtrending4.jpg', name: 'Starboy (feat. Daft Punk)', artist: 'The Weeknd', year: 'Song•2016', url: 'assets/music/Starboy.mp3',
    },
    {
      imageUrl: 'assets/images/pophits1.jpg', name: 'Shape of You', artist: 'Ed Sheeran', year: 'Song•2017', url: 'assets/music/Shape of You.mp3',
    },
    {
      imageUrl: 'assets/images/pophits2.jpg', name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', year: 'Song•2015', url: 'assets/music/Uptown Funk.mp3',
    },
    {
      imageUrl: 'assets/images/pophits3.jpg', name: 'Rolling in the Deep', artist: 'Adele', year: 'Song•2010', url: 'assets/music/Rolling in the Deep.mp3',
    },
    {
      imageUrl: 'assets/images/bollywood1.jpg', name: 'Apna Bana Le (From "Bhediya")', artist: 'Arijit Singh', year: 'Song•2022', url: 'assets/music/Apna Bana Le.mp3',
    },
    {
      imageUrl: 'assets/images/bollywood2.jpg', name: 'Tu Hain Toh (From "Mr. And Mrs. Mahi")', artist: 'Hunny Bunny', year: 'Song•2024', url: 'assets/music/Tu Hain Toh.mp3',
    },
    {
      imageUrl: 'assets/images/bollywood3.jpg', name: 'Soulmate', artist: 'Badshah X Arijit Singh', year: 'Song•2024', url: 'assets/music/Soulmate.mp3',
    },
    {
      imageUrl: 'assets/images/bollywood4.jpg', name: 'Ranjhan', artist: 'Parampara Tandon', year: 'Song•2024', url: 'assets/music/Raanjhan.mp3',
    },
    {
      imageUrl: 'assets/images/chillvibes1.jpg', name: 'Sunflower', artist: 'Post Malone/Swae Lee', year: 'Song•2018', url: 'assets/music/Sunflower.mp3',
    },
    {
      imageUrl: 'assets/images/chillvibes2.jpg', name: 'Stay', artist: 'The Kid LAROI Justin Bieber', year: 'Song•2021', url: 'assets/music/STAY.mp3',
    },
    {
      imageUrl: 'assets/images/chillvibes3.jpg', name: 'Dandelions', artist: 'Ruth B.', year: 'Song•2017', url: 'assets/music/Dandelions.mp3',
    },
    
  ];
  

  constructor(
    private musicPlayerService: MusicPlayerService,
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    this.musicPlayerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
      this.currentSongIndex = this.songs.findIndex((s) => s.name === song.name)
  });
}

  ngOnInit(): void {
    this.filteredSongs = [...this.songs];
    this.filteredPlaylists = [...this.playlists];
    this.musicPlayerService.setHomeSongs(this.songs);

    this.musicPlayerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
      this.currentSongIndex = this.songs.findIndex((s) => s.url === song.url);  // Ensure this is based on `url` or another unique identifier.
    });
    

    this.musicPlayerService.isPlaying$.subscribe((isPlaying) => {
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

    this.renderer.listen(this.elRef.nativeElement, 'click', (event) => {
      if (!event.target.closest('.sidebar') && !event.target.closest('.listmenu')) {
        this.isMenuOpen = false; 
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToPlaylist() {
    if (this.playlistSection) {
      this.playlistSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.isMenuOpen = false;  
    }
  }


  searchProducts() {
    const lowercasedSearchTerm = this.searchTerm.toLowerCase();

    this.filteredSongs = this.songs.filter((song) =>
      song.name.toLowerCase().includes(lowercasedSearchTerm)
    );

    this.filteredPlaylists = this.playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }

  playSong(song: any) {
    this.musicPlayerService.playSong(song);
    console.log('Playing song:', song.name);
  }

  selectPlaylist(playlist: any) {
    console.log('Selected Playlist:', playlist);
    console.log('Image URL:', playlist.imageUrl);
    this.musicPlayerService.setPlaylist(playlist.songs);
    this.musicPlayerService.playSong(playlist.songs[0]);
  }

  getLastPlayedSong() {
    return this.musicPlayerService.lastPlayedSong;
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

  playPause() {
    this.musicPlayerService.togglePlayPause();
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
    this.isPlaying = false;
  }

  goToPlayer(event: any) {
    this.router.navigate(['/player'], {
      queryParams: { song: JSON.stringify(this.currentSong) },
    });
    this.musicPlayerService.playSong(this.currentSong);
    this.currentTime=event.target.value;
  }

  goToPlayerWithSong(song: any) {
    this.router.navigate(['/player'], { queryParams: { song: JSON.stringify(song) } });
  }
}
