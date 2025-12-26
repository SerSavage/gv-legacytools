/**
 * Persistent Music Player for Gloria Victis
 * Plays music continuously across all pages without interruption
 */

class PersistentMusicPlayer {
    constructor() {
        this.audio = null;
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.volume = 0.5; // Default 50%
        this.isPlaying = false;
        this.savedPosition = 0;
        
        // Storage keys
        this.STORAGE_KEYS = {
            TRACK_INDEX: 'gv_music_track_index',
            POSITION: 'gv_music_position',
            VOLUME: 'gv_music_volume',
            IS_PLAYING: 'gv_music_playing',
            PLAYLIST: 'gv_music_playlist'
        };
        
        this.init();
    }
    
    init() {
        // Load playlist
        this.loadPlaylist();
        
        // Restore state from localStorage
        this.restoreState();
        
        // Create audio element
        this.createAudioElement();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Always start playing automatically
        if (this.playlist.length > 0) {
            // Small delay to ensure page is loaded
            setTimeout(() => {
                this.loadTrack(this.currentTrackIndex, this.savedPosition);
                this.play();
            }, 1000);
        }
    }
    
    loadPlaylist() {
        // Try to load from localStorage first (for consistency)
        const savedPlaylist = localStorage.getItem(this.STORAGE_KEYS.PLAYLIST);
        if (savedPlaylist) {
            this.playlist = JSON.parse(savedPlaylist);
        } else {
            // Build playlist from available tracks
            this.playlist = [
                '_music/Marcin Przybylowicz - Main Menu.ogg',
                '_music/Jan Jog Grochowski - Main Menu.ogg',
                '_music/Jan Jog Grochowski - Narodziny bohatera.ogg',
                '_music/Jan Jog Grochowski - Absolucja.ogg',
                '_music/Jan Jog Grochowski - Banita.ogg',
                '_music/Jan Jog Grochowski - Bez odwrotu.ogg',
                '_music/Jan Jog Grochowski - Bez odwrotu Short.ogg',
                '_music/Jan Jog Grochowski - Dom mimo woli.ogg',
                '_music/Jan Jog Grochowski - Ostatni bastion.ogg',
                '_music/Jan Jog Grochowski - Ruiny przeszłości.ogg',
                '_music/Jan Jog Grochowski - Uroczysko.ogg',
                '_music/Jan Jog Grochowski - W popioł się obrócisz.ogg',
                '_music/Jan Jog Grochowski - Wezwanie.ogg',
                '_music/Jan Jog Grochwoski - Złap mnie.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Main Menu.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Logo.ogg',
                '_music/skryptowa/Gloria Victis - Follow the stars.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 1.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 2.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 3.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 4.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 5.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 6.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 12.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 13.ogg',
                '_music/skryptowa/Jan Jog Grochowski - Muzyka skryptowa 14.ogg',
                '_music/skryptowa/gv_char_creation_azeb.ogg',
                '_music/skryptowa/gv_char_creation_ismir.ogg',
                '_music/skryptowa/gv_char_creation_midlands.ogg',
                '_music/skryptowa/Sen o Daram do wyboru postaci.ogg',
                '_music/ismirs/Vik_2_prev_3.ogg'
            ];
            // Save playlist for consistency
            localStorage.setItem(this.STORAGE_KEYS.PLAYLIST, JSON.stringify(this.playlist));
        }
    }
    
    restoreState() {
        // Restore track index
        const savedIndex = localStorage.getItem(this.STORAGE_KEYS.TRACK_INDEX);
        if (savedIndex !== null) {
            this.currentTrackIndex = parseInt(savedIndex, 10);
            if (this.currentTrackIndex >= this.playlist.length) {
                this.currentTrackIndex = 0;
            }
        }
        
        // Restore position
        const savedPos = localStorage.getItem(this.STORAGE_KEYS.POSITION);
        if (savedPos !== null) {
            this.savedPosition = parseFloat(savedPos);
        }
        
        // Restore volume
        const savedVolume = localStorage.getItem(this.STORAGE_KEYS.VOLUME);
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
        
        // Always set to playing (auto-play mode)
        this.isPlaying = true;
    }
    
    createAudioElement() {
        this.audio = new Audio();
        this.audio.loop = false; // We'll handle looping manually
        this.audio.volume = this.volume;
        
        // Update volume slider if it exists
        const volumeSlider = document.getElementById('music-volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
            this.updateVolumeDisplay();
        }
    }
    
    setupEventListeners() {
        if (!this.audio) return;
        
        // When track ends, play next
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        // Save position periodically while playing
        this.audio.addEventListener('timeupdate', () => {
            if (this.isPlaying && this.audio.currentTime > 0) {
                this.savePosition();
            }
        });
        
        // Handle errors (file not found, etc.)
        this.audio.addEventListener('error', (e) => {
            console.warn('Error loading track:', this.playlist[this.currentTrackIndex]);
            // Skip to next track on error
            setTimeout(() => this.nextTrack(), 1000);
        });
        
        // When track can play, restore position
        this.audio.addEventListener('canplay', () => {
            if (this.savedPosition > 0 && this.isPlaying) {
                this.audio.currentTime = this.savedPosition;
                this.savedPosition = 0; // Reset after restoring
            }
        });
    }
    
    loadTrack(index, position = 0) {
        if (index < 0 || index >= this.playlist.length) {
            index = 0;
        }
        
        this.currentTrackIndex = index;
        this.savedPosition = position;
        
        if (this.audio) {
            // Handle path differences (root vs subdirectories)
            let trackPath = this.playlist[index];
            // If we're in a subdirectory and path doesn't start with ../
            if (window.location.pathname !== '/' && !trackPath.startsWith('../') && !trackPath.startsWith('/')) {
                trackPath = '../' + trackPath;
            }
            this.audio.src = trackPath;
            this.audio.load();
            this.saveState();
            this.updateTrackInfo();
        }
    }
    
    play() {
        if (!this.audio || this.playlist.length === 0) return;
        
        // If no track is loaded, load current track
        if (!this.audio.src || this.audio.src === window.location.href) {
            this.loadTrack(this.currentTrackIndex, this.savedPosition);
        }
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.saveState();
            this.updatePlayButton();
        }).catch((error) => {
            console.warn('Playback failed:', error);
            // Try next track if this one fails
            setTimeout(() => this.nextTrack(), 1000);
        });
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.savePosition();
            this.saveState();
            this.updatePlayButton();
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.savedPosition = 0;
        this.loadTrack(this.currentTrackIndex, 0);
        if (this.isPlaying) {
            this.play();
        } else {
            this.updateTrackInfo();
        }
    }
    
    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.savedPosition = 0;
        this.loadTrack(this.currentTrackIndex, 0);
        if (this.isPlaying) {
            this.play();
        } else {
            this.updateTrackInfo();
        }
    }
    
    setVolume(value) {
        // value should be 0-100
        this.volume = Math.max(0, Math.min(100, value)) / 100;
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.saveState();
        this.updateVolumeDisplay();
    }
    
    updateVolumeDisplay() {
        const volumeDisplay = document.getElementById('music-volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = Math.round(this.volume * 100) + '%';
        }
    }
    
    updatePlayButton() {
        const playButton = document.getElementById('music-play-pause');
        if (playButton) {
            playButton.textContent = this.isPlaying ? '⏸' : '▶';
            playButton.title = this.isPlaying ? 'Pause' : 'Play';
        }
    }
    
    updateTrackInfo() {
        const trackInfo = document.getElementById('music-track-info');
        if (trackInfo) {
            trackInfo.textContent = this.getCurrentTrackName();
        }
    }
    
    saveState() {
        localStorage.setItem(this.STORAGE_KEYS.TRACK_INDEX, this.currentTrackIndex.toString());
        localStorage.setItem(this.STORAGE_KEYS.VOLUME, this.volume.toString());
        localStorage.setItem(this.STORAGE_KEYS.IS_PLAYING, this.isPlaying.toString());
    }
    
    savePosition() {
        if (this.audio && this.audio.currentTime > 0) {
            localStorage.setItem(this.STORAGE_KEYS.POSITION, this.audio.currentTime.toString());
        }
    }
    
    getCurrentTrackName() {
        if (this.currentTrackIndex >= 0 && this.currentTrackIndex < this.playlist.length) {
            const path = this.playlist[this.currentTrackIndex];
            return path.split('/').pop().replace('.ogg', '');
        }
        return 'No track';
    }
}

// Initialize player when DOM is ready
let musicPlayer;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        musicPlayer = new PersistentMusicPlayer();
        setupMusicPlayerUI();
    });
} else {
    musicPlayer = new PersistentMusicPlayer();
    setupMusicPlayerUI();
}

// Setup UI controls (only volume control)
function setupMusicPlayerUI() {
    // Volume slider
    const volumeSlider = document.getElementById('music-volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (musicPlayer) musicPlayer.setVolume(parseFloat(e.target.value));
        });
    }
    
    // Update initial UI state
    if (musicPlayer) {
        musicPlayer.updateVolumeDisplay();
    }
}

// Save position before page unload
window.addEventListener('beforeunload', () => {
    if (musicPlayer) {
        musicPlayer.savePosition();
    }
});

// Also save on visibility change (when tab becomes hidden)
document.addEventListener('visibilitychange', () => {
    if (musicPlayer && document.hidden) {
        musicPlayer.savePosition();
    }
});

