// AudioManager simplificado y estable
class AudioManager {
    constructor() {
        console.log('🎵 AudioManager constructor iniciado');
        this.isMuted = localStorage.getItem('piRunnerMuted') === 'true';
        this.isInitialized = false;
        this.sounds = {};
        console.log('🎵 AudioManager iniciado correctamente');
    }
    
    playCoinCollectSound() {
        this.playSound('coin');
    }
    
    playExplosionSound() {
        this.playSound('explosion');
    }
    
    playSuperJumpSound() {
        this.playSound('jump');
    }
    
    playSound(type) {
        if (this.isMuted) return;
        
        try {
            // Versión muy simple por ahora
            console.log(`🎵 Playing sound: ${type}`);
            
            if (!this.sounds[type]) {
                const audio = new Audio();
                audio.volume = 0.3;
                
                switch(type) {
                    case 'coin':
                        audio.src = 'sounds/coin_collect.wav';
                        break;
                    case 'explosion':
                        audio.src = 'sounds/explosion.wav';
                        break;
                    case 'jump':
                        audio.src = 'sounds/super_jump.wav';
                        break;
                    case 'music':
                        audio.src = 'sounds/background_music.mp3';
                        audio.loop = true;
                        audio.volume = 0.1;
                        break;
                }
                
                this.sounds[type] = audio;
            }
            
            const audio = this.sounds[type];
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignorar errores de autoplay
            });
            
        } catch (error) {
            // Ignorar errores de audio completamente
        }
    }
    
    playBackgroundMusic() {
        this.playSound('music');
    }
    
    stopBackgroundMusic() {
        try {
            if (this.sounds.music) {
                this.sounds.music.pause();
            }
        } catch (error) {
            // Ignorar errores
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('piRunnerMuted', this.isMuted);
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
        
        console.log(`🎵 Audio ${this.isMuted ? 'silenciado' : 'activado'}`);
        return this.isMuted;
    }
    
    initializeAfterUserGesture() {
        this.isInitialized = true;
        console.log('🎵 AudioManager inicializado tras gesto del usuario');
        
        if (!this.isMuted) {
            this.playBackgroundMusic();
        }
    }
    
    // Método dummy para compatibilidad
    adjustPerformanceMode() {
        // No hace nada por ahora
    }
}

console.log('🎵 AudioManager class definida correctamente');
