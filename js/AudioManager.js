class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.isInitialized = false;
        
        // No intentar cargar nada en el constructor
        this.soundFiles = {
            coinCollect: 'sounds/coin_collect.wav',
            explosion: 'sounds/explosion.wav',
            backgroundMusic: 'sounds/background_music.mp3',
            superJump: 'sounds/super_jump.wav'
        };
        
        console.log('AudioManager creado');
    }
    
    // Método seguro para cargar un sonido
    loadSound(key, file) {
        try {
            const audio = new Audio(file);
            audio.volume = 0.5;
            audio.preload = 'none';
            
            // Configurar música de fondo para loop
            if (key === 'backgroundMusic') {
                audio.loop = true;
                audio.volume = 0.3;
            }
            
            this.sounds[key] = audio;
            console.log(`Sonido ${key} preparado`);
        } catch (error) {
            console.warn(`Error preparando ${key}:`, error);
            this.sounds[key] = { play: () => {}, pause: () => {} };
        }
    }
    
    // Inicialización lazy - solo cuando se necesite
    ensureSound(key) {
        if (!this.sounds[key] && this.soundFiles[key]) {
            this.loadSound(key, this.soundFiles[key]);
        }
    }
    
    // Reproducir sonido de forma segura
    playSound(key) {
        if (this.isMuted) return;
        
        try {
            this.ensureSound(key);
            const sound = this.sounds[key];
            if (sound && sound.play) {
                sound.currentTime = 0;
                sound.play().catch(() => {
                    // Ignorar errores de autoplay
                });
            }
        } catch (error) {
            // Ignorar completamente errores de audio
        }
    }
    
    playBackgroundMusic() {
        this.playSound('backgroundMusic');
    }
    
    stopBackgroundMusic() {
        try {
            const music = this.sounds.backgroundMusic;
            if (music && music.pause) {
                music.pause();
            }
        } catch (error) {
            // Ignorar errores
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
        
        return this.isMuted;
    }
    
    // Métodos específicos del juego
    playCoinCollectSound() {
        this.playSound('coinCollect');
    }
    
    playExplosionSound() {
        this.playSound('explosion');
    }
    
    playSuperJumpSound() {
        this.playSound('superJump');
    }
    
    // Método dummy para compatibilidad
    async initializeAfterUserGesture() {
        this.isInitialized = true;
        console.log('AudioManager inicializado');
        
        // Iniciar música de fondo automáticamente después de primera interacción
        if (!this.isMuted) {
            this.playBackgroundMusic();
        }
    }
}