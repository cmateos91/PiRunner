// AudioManager súper simple - solo para que no falle el juego
class AudioManager {
    constructor() {
        this.isMuted = false;
        console.log('AudioManager simple creado');
    }
    
    playCoinCollectSound() {
        if (!this.isMuted) {
            try {
                const audio = new Audio('sounds/coin_collect.wav');
                audio.volume = 0.5;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    }
    
    playExplosionSound() {
        if (!this.isMuted) {
            try {
                const audio = new Audio('sounds/explosion.wav');
                audio.volume = 0.7;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    }
    
    playBackgroundMusic() {
        if (!this.isMuted) {
            try {
                if (!this.bgMusic) {
                    this.bgMusic = new Audio('sounds/background_music.mp3');
                    this.bgMusic.loop = true;
                    this.bgMusic.volume = 0.3;
                }
                this.bgMusic.play().catch(() => {});
            } catch (e) {}
        }
    }
    
    stopBackgroundMusic() {
        try {
            if (this.bgMusic) {
                this.bgMusic.pause();
            }
        } catch (e) {}
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
    
    initializeAfterUserGesture() {
        // Método dummy para compatibilidad
        console.log('Audio inicializado');
    }
}