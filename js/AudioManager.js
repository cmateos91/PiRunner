// AudioManager optimizado para Pi Browser - Baja latencia
class AudioManager {
    constructor() {
        console.log('🎵 AudioManager Pi Browser optimizado iniciado');
        this.isMuted = localStorage.getItem('piRunnerMuted') === 'true';
        this.isInitialized = false;
        this.sounds = {};
        this.audioPool = {}; // Pool de audio para reutilización
        this.preloadedSounds = {};
        this.maxPoolSize = 3; // Máximo 3 instancias por sonido
        
        // Detectar Pi Browser
        this.isPiBrowser = this.detectPiBrowser();
        
        // Configuración específica para Pi Browser
        this.audioConfig = {
            volume: this.isPiBrowser ? 0.4 : 0.3,
            preloadStrategy: this.isPiBrowser ? 'aggressive' : 'lazy',
            poolSize: this.isPiBrowser ? 2 : 1,
            useWebAudio: this.isPiBrowser && this.supportsWebAudio()
        };
        
        this.initializeAudioContext();
        console.log(`🎵 AudioManager configurado para ${this.isPiBrowser ? 'Pi Browser' : 'navegador estándar'}`);
    }
    
    detectPiBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes('pibrowser') || 
               userAgent.includes('pi browser') ||
               (userAgent.includes('mobile') && userAgent.includes('webkit') && 
                window.location.hostname.includes('minepi'));
    }
    
    supportsWebAudio() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
    
    initializeAudioContext() {
        if (this.audioConfig.useWebAudio) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.buffers = {};
                console.log('🎵 Web Audio API inicializado');
            } catch (error) {
                console.warn('⚠️ Web Audio API no disponible, usando HTML Audio');
                this.audioConfig.useWebAudio = false;
            }
        }
    }
    
    async preloadSound(type, src) {
        if (this.audioConfig.useWebAudio) {
            return this.preloadWebAudioSound(type, src);
        } else {
            return this.preloadHTMLAudioSound(type, src);
        }
    }
    
    async preloadWebAudioSound(type, src) {
        try {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers[type] = audioBuffer;
            console.log(`🎵 Sonido Web Audio preloaded: ${type}`);
            return true;
        } catch (error) {
            console.warn(`⚠️ Error preloading Web Audio ${type}:`, error);
            return false;
        }
    }
    
    async preloadHTMLAudioSound(type, src) {
        return new Promise((resolve) => {
            // Crear pool de audio
            this.audioPool[type] = [];
            
            for (let i = 0; i < this.audioConfig.poolSize; i++) {
                const audio = new Audio();
                audio.volume = this.audioConfig.volume;
                audio.preload = 'auto';
                audio.src = src;
                
                // Configuración específica para Pi Browser
                if (this.isPiBrowser) {
                    audio.setAttribute('playsinline', true);
                    audio.setAttribute('webkit-playsinline', true);
                }
                
                // Precargar agresivamente en Pi Browser
                if (this.audioConfig.preloadStrategy === 'aggressive') {
                    audio.load();
                }
                
                this.audioPool[type].push({
                    audio: audio,
                    playing: false,
                    lastUsed: 0
                });
            }
            
            console.log(`🎵 Pool HTML Audio creado para ${type}: ${this.audioConfig.poolSize} instancias`);
            resolve(true);
        });
    }
    
    async initializeSounds() {
        const soundConfig = {
            'coin': 'sounds/coin_collect.wav',
            'explosion': 'sounds/explosion.wav', 
            'jump': 'sounds/super_jump.wav',
            'music': 'sounds/background_music.mp3'
        };
        
        console.log('🎵 Inicializando sonidos...');
        
        for (const [type, src] of Object.entries(soundConfig)) {
            try {
                await this.preloadSound(type, src);
            } catch (error) {
                console.warn(`⚠️ Error preloading ${type}:`, error);
            }
        }
        
        console.log('🎵 Sonidos inicializados');
    }
    
    playWebAudioSound(type) {
        if (!this.audioContext || !this.buffers[type]) return;
        
        try {
            // Resumir contexto si está suspendido
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.buffers[type];
            gainNode.gain.value = this.audioConfig.volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
            
        } catch (error) {
            console.warn(`⚠️ Error playing Web Audio ${type}:`, error);
        }
    }
    
    playHTMLAudioSound(type) {
        if (!this.audioPool[type]) return;
        
        // Encontrar audio disponible en el pool
        const pool = this.audioPool[type];
        let availableAudio = null;
        
        for (const audioObj of pool) {
            if (!audioObj.playing || audioObj.audio.ended) {
                availableAudio = audioObj;
                break;
            }
        }
        
        // Si no hay audio disponible, usar el menos usado recientemente
        if (!availableAudio) {
            availableAudio = pool.reduce((oldest, current) => 
                current.lastUsed < oldest.lastUsed ? current : oldest
            );
        }
        
        try {
            const audio = availableAudio.audio;
            
            // Resetear y reproducir
            audio.currentTime = 0;
            availableAudio.playing = true;
            availableAudio.lastUsed = Date.now();
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Reproducción exitosa
                    })
                    .catch(() => {
                        availableAudio.playing = false;
                    });
            }
            
            // Marcar como no reproduciendo cuando termine
            audio.onended = () => {
                availableAudio.playing = false;
            };
            
        } catch (error) {
            availableAudio.playing = false;
        }
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
        if (this.isMuted || !this.isInitialized) return;
        
        if (this.audioConfig.useWebAudio) {
            this.playWebAudioSound(type);
        } else {
            this.playHTMLAudioSound(type);
        }
    }
    
    playBackgroundMusic() {
        if (this.isMuted) return;
        
        try {
            if (!this.backgroundMusic) {
                this.backgroundMusic = new Audio('sounds/background_music.mp3');
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = this.isPiBrowser ? 0.15 : 0.1;
                
                if (this.isPiBrowser) {
                    this.backgroundMusic.setAttribute('playsinline', true);
                    this.backgroundMusic.setAttribute('webkit-playsinline', true);
                }
            }
            
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().catch(() => {
                // Ignorar errores de autoplay
            });
            
        } catch (error) {
            console.warn('⚠️ Error con música de fondo:', error);
        }
    }
    
    stopBackgroundMusic() {
        try {
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
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
        } else if (this.isInitialized) {
            this.playBackgroundMusic();
        }
        
        return this.isMuted;
    }
    
    async initializeAfterUserGesture() {
        console.log('🎵 Inicializando audio tras gesto del usuario...');
        
        // Resumir contexto de Web Audio si está suspendido
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('🎵 AudioContext resumido');
            } catch (error) {
                console.warn('⚠️ Error resumiendo AudioContext:', error);
            }
        }
        
        // Inicializar sonidos si no se han inicializado
        if (!this.isInitialized) {
            await this.initializeSounds();
            this.isInitialized = true;
        }
        
        // Reproducir música de fondo si no está silenciado
        if (!this.isMuted) {
            setTimeout(() => {
                this.playBackgroundMusic();
            }, 100); // Pequeño delay para asegurar que el contexto esté listo
        }
        
        console.log('🎵 AudioManager completamente inicializado');
    }
    
    // Método para obtener estado actual
    isMuted() {
        return this.isMuted;
    }
    
    // Método para limpiar recursos
    dispose() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Limpiar pools de audio
        for (const pool of Object.values(this.audioPool)) {
            for (const audioObj of pool) {
                audioObj.audio.src = '';
                audioObj.audio.load();
            }
        }
        
        console.log('🎵 AudioManager disposed');
    }
}

console.log('🎵 AudioManager Pi Browser optimizado cargado');
