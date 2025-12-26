/**
 * Persistent Music Player for Gloria Victis
 * Two modes:
 * 1. Main Menu: Plays "Marcin Przybylowicz - Main Menu.ogg" on loop
 * 2. Function Pages: Plays shuffled playlist (excluding main menu track) on loop
 */

class PersistentMusicPlayer {
    constructor() {
        this.audio = null;
        this.mainMenuTrack = '_music/Marcin Przybylowicz - Main Menu.ogg';
        this.functionPlaylist = [];
        this.shuffledPlaylist = [];
        this.currentTrackIndex = 0;
        this.volume = 0.5; // Default 50%
        this.isPlaying = false;
        this.isMainMenuMode = false;
        this.savedPosition = 0;
        
        // Storage keys
        this.STORAGE_KEYS = {
            TRACK_INDEX: 'gv_music_track_index',
            POSITION: 'gv_music_position',
            VOLUME: 'gv_music_volume',
            IS_PLAYING: 'gv_music_playing',
            PLAYLIST: 'gv_music_playlist',
            MODE: 'gv_music_mode'
        };
        
        this.init();
    }
    
    init() {
        // Detect which page we're on
        this.detectPageMode();
        
        // Load playlists
        this.loadPlaylists();
        
        // Restore state from localStorage
        this.restoreState();
        
        // Create audio element
        this.createAudioElement();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start playing based on mode
        this.startPlaying();
    }
    
    detectPageMode() {
        // Check if we're on the main menu page based on URL path
        const path = window.location.pathname;
        
        // Main menu mode: root path (/) only, not /builder/, /map/, /database/, etc.
        // Also check if menu screen exists and is visible
        const hasMenuScreen = document.getElementById('menu-screen');
        const hasSplashScreen = document.getElementById('splash-screen');
        const isRootPath = path === '/' || path === '/index.html' || path === '';
        
        // Check if menu is actually visible (not hidden by character builder content)
        let menuVisible = false;
        if (hasMenuScreen) {
            menuVisible = hasMenuScreen.classList.contains('visible') || 
                        hasMenuScreen.style.display === 'flex' ||
                        window.getComputedStyle(hasMenuScreen).display !== 'none';
        }
        
        // Main menu mode: root path AND (menu/splash exists OR menu is visible)
        this.isMainMenuMode = isRootPath && (hasMenuScreen || hasSplashScreen || menuVisible);
        
        // If we're on a function page path, definitely not main menu mode
        if (path.startsWith('/builder/') || path.startsWith('/map/') || path.startsWith('/database/')) {
            this.isMainMenuMode = false;
        }
        
        // Save mode to localStorage
        localStorage.setItem(this.STORAGE_KEYS.MODE, this.isMainMenuMode ? 'mainmenu' : 'function');
    }
    
    loadPlaylists() {
        // Main menu track
        // Already set: this.mainMenuTrack
        
        // Function pages playlist (all tracks except main menu)
        this.functionPlaylist = [
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
        
        // Shuffle the function playlist
        this.shufflePlaylist();
    }
    
    shufflePlaylist() {
        // Create a shuffled copy of the function playlist
        this.shuffledPlaylist = [...this.functionPlaylist];
        for (let i = this.shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledPlaylist[i], this.shuffledPlaylist[j]] = [this.shuffledPlaylist[j], this.shuffledPlaylist[i]];
        }
    }
    
    restoreState() {
        // Restore volume
        const savedVolume = localStorage.getItem(this.STORAGE_KEYS.VOLUME);
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
        
        // Restore mode
        const savedMode = localStorage.getItem(this.STORAGE_KEYS.MODE);
        if (savedMode === 'mainmenu') {
            this.isMainMenuMode = true;
        } else if (savedMode === 'function') {
            this.isMainMenuMode = false;
        }
        
        // Restore track index for function mode
        if (!this.isMainMenuMode) {
            const savedIndex = localStorage.getItem(this.STORAGE_KEYS.TRACK_INDEX);
            if (savedIndex !== null) {
                this.currentTrackIndex = parseInt(savedIndex, 10);
                if (this.currentTrackIndex >= this.shuffledPlaylist.length) {
                    this.currentTrackIndex = 0;
                }
            }
        }
        
        // Restore position
        const savedPos = localStorage.getItem(this.STORAGE_KEYS.POSITION);
        if (savedPos !== null) {
            this.savedPosition = parseFloat(savedPos);
        }
        
        // Always set to playing
        this.isPlaying = true;
    }
    
    createAudioElement() {
        this.audio = new Audio();
        this.audio.loop = this.isMainMenuMode; // Loop only in main menu mode
        this.audio.volume = this.volume;
        this.audio.preload = 'auto'; // Preload the audio
        
        // Update volume slider if it exists
        const volumeSlider = document.getElementById('music-volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
            this.updateVolumeDisplay();
        }
    }
    
    setupEventListeners() {
        if (!this.audio) return;
        
        // When track ends, play next (only in function mode)
        this.audio.addEventListener('ended', () => {
            if (!this.isMainMenuMode) {
                this.nextTrack();
            }
        });
        
        // Save position periodically while playing
        this.audio.addEventListener('timeupdate', () => {
            if (this.isPlaying && this.audio.currentTime > 0) {
                this.savePosition();
            }
        });
        
        // Handle errors (file not found, etc.)
        this.audio.addEventListener('error', (e) => {
            console.warn('Error loading track:', this.isMainMenuMode ? this.mainMenuTrack : this.shuffledPlaylist[this.currentTrackIndex]);
            if (!this.isMainMenuMode) {
                // Skip to next track on error
                setTimeout(() => this.nextTrack(), 1000);
            }
        });
        
        // When track can play, restore position
        this.audio.addEventListener('canplay', () => {
            if (this.savedPosition > 0 && this.isPlaying && !this.isMainMenuMode) {
                this.audio.currentTime = this.savedPosition;
                this.savedPosition = 0; // Reset after restoring
            }
        });
    }
    
    loadTrack(trackPath, position = 0) {
        this.savedPosition = position;
        
        if (this.audio) {
            // Handle path differences (root vs subdirectories)
            let path = trackPath;
            if (window.location.pathname !== '/' && !path.startsWith('../') && !path.startsWith('/')) {
                path = '../' + path;
            }
            this.audio.src = path;
            this.audio.loop = this.isMainMenuMode; // Set loop based on mode
            this.audio.preload = 'auto'; // Ensure preloading
            this.audio.load();
            
            // Try to start loading immediately
            this.audio.addEventListener('canplaythrough', () => {
                // Audio is ready to play, try playing if not already playing
                if (!this.isPlaying && this.isMainMenuMode) {
                    this.play();
                }
            }, { once: true });
            
            this.saveState();
        }
    }
    
    play() {
        if (!this.audio) return;
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.saveState();
            }).catch((error) => {
                console.warn('Autoplay prevented:', error);
                // Autoplay was prevented - wait for user interaction
                this.waitForUserInteraction();
            });
        }
    }
    
    waitForUserInteraction() {
        // Wait for any user interaction to start playback
        const startPlayback = () => {
            if (this.audio && !this.isPlaying) {
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.saveState();
                }).catch(() => {
                    // Still failed, try again later
                });
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', startPlayback);
            document.removeEventListener('touchstart', startPlayback);
            document.removeEventListener('keydown', startPlayback);
        };
        
        document.addEventListener('click', startPlayback, { once: true });
        document.addEventListener('touchstart', startPlayback, { once: true });
        document.addEventListener('keydown', startPlayback, { once: true });
    }
    
    nextTrack() {
        if (this.isMainMenuMode) return; // Don't change tracks in main menu mode
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.shuffledPlaylist.length;
        this.savedPosition = 0;
        this.loadTrack(this.shuffledPlaylist[this.currentTrackIndex], 0);
        if (this.isPlaying) {
            this.play();
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
    
    saveState() {
        if (!this.isMainMenuMode) {
            localStorage.setItem(this.STORAGE_KEYS.TRACK_INDEX, this.currentTrackIndex.toString());
        }
        localStorage.setItem(this.STORAGE_KEYS.VOLUME, this.volume.toString());
        localStorage.setItem(this.STORAGE_KEYS.IS_PLAYING, this.isPlaying.toString());
        localStorage.setItem(this.STORAGE_KEYS.MODE, this.isMainMenuMode ? 'mainmenu' : 'function');
    }
    
    savePosition() {
        if (this.audio && this.audio.currentTime > 0 && !this.isMainMenuMode) {
            localStorage.setItem(this.STORAGE_KEYS.POSITION, this.audio.currentTime.toString());
        }
    }
    
    startPlaying() {
        if (this.isMainMenuMode) {
            // Main menu mode: play main menu track on loop
            this.loadTrack(this.mainMenuTrack, 0);
            
            // Try to play immediately - browsers may block autoplay, but we try
            // The audio will start when user interacts if autoplay is blocked
            setTimeout(() => {
                this.play();
            }, 100);
            
            // Also try when audio is ready
            if (this.audio) {
                this.audio.addEventListener('canplay', () => {
                    if (!this.isPlaying) {
                        this.play();
                    }
                }, { once: true });
                
                this.audio.addEventListener('loadeddata', () => {
                    if (!this.isPlaying) {
                        this.play();
                    }
                }, { once: true });
            }
        } else {
            // Function mode: play shuffled playlist
            if (this.shuffledPlaylist.length > 0) {
                this.loadTrack(this.shuffledPlaylist[this.currentTrackIndex], this.savedPosition);
            }
            
            // Attempt to play
            setTimeout(() => {
                this.play();
            }, 500);
        }
        
        // Also try after page is fully loaded
        if (document.readyState === 'complete') {
            setTimeout(() => {
                if (!this.isPlaying) {
                    this.play();
                }
            }, 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (!this.isPlaying) {
                        this.play();
                    }
                }, 500);
            });
        }
        
        // Try again after a longer delay
        setTimeout(() => {
            if (!this.isPlaying) {
                this.play();
            }
        }, 2000);
    }
    
    switchToFunctionMode() {
        // Called when user navigates from menu to function page
        if (this.isMainMenuMode) {
            this.isMainMenuMode = false;
            this.audio.loop = false;
            this.savedPosition = 0;
            this.currentTrackIndex = 0;
            this.shufflePlaylist(); // Reshuffle for new session
            this.loadTrack(this.shuffledPlaylist[0], 0);
            this.saveState();
            if (this.isPlaying) {
                this.play();
            }
        }
    }
}

// Initialize player immediately (don't wait for DOM)
let musicPlayer;

// Start initialization as early as possible
function initializeMusicPlayer() {
    if (!musicPlayer) {
        musicPlayer = new PersistentMusicPlayer();
        window.musicPlayer = musicPlayer; // Make globally accessible
        setupMusicPlayerUI();
    }
}

// Initialize immediately if possible
if (document.readyState === 'loading') {
    // Start initializing immediately, don't wait for DOMContentLoaded
    initializeMusicPlayer();
    document.addEventListener('DOMContentLoaded', () => {
        if (!musicPlayer) {
            initializeMusicPlayer();
        }
    });
} else {
    initializeMusicPlayer();
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

// Detect navigation to function pages and switch mode
window.addEventListener('load', () => {
    if (musicPlayer && !musicPlayer.isMainMenuMode) {
        // We're on a function page, ensure we're in function mode
        musicPlayer.switchToFunctionMode();
    }
});
