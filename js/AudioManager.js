// AudioManager optimizado con Web Audio API y pooling
class AudioManager {
    constructor() {
        this.isMuted = localStorage.getItem('piRunnerMuted') === 'true';
        this.isInitialized = false;
        
        // Web Audio API context (se crea SOLO tras gesto del usuario)
        this.audioContext = null;
        this.audioBuffers = {};
        this.sourcePool = {};
        this.backgroundMusic = null;
        
        // Configuración de sonidos
        this.soundConfig = {
            'coin': { src: 'sounds/coin_collect.wav', poolSize: 3 },
            'explosion': { src: 'sounds/explosion.wav', poolSize: 2 },
            'jump': { src: 'sounds/super_jump.wav', poolSize: 3 },
            'music': { src: 'sounds/background_music.mp3', poolSize: 1 }
        };
        
        // Estado de precarga
        this.loadingPromises = {};
        this.isPreloading = false;
        
        console.log('🎵 AudioManager inicializado (Web Audio API)');
    }
    
    async initializeAfterUserGesture() {
        if (this.isInitialized) return;
        
        console.log('🎵 Inicializando audio tras gesto del usuario...');
        
        try {
            // Crear AudioContext SOLO aquí, tras gesto del usuario
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('🎵 AudioContext creado:', this.audioContext.state);
            }
            
            // Forzar activación del contexto con método más agresivo
            if (this.audioContext.state !== 'running') {
                console.log('🎵 Intentando activar AudioContext...');
                
                // Crear un buffer silencioso y reproducirlo para activar el contexto
                const buffer = this.audioContext.createBuffer(1, 1, 22050);
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext.destination);
                source.start(0);
                
                // Intentar resumir
                if (this.audioContext.resume) {
                    await this.audioContext.resume();
                }
                
                console.log('🎵 Estado del AudioContext después de activación:', this.audioContext.state);
            }
            
            // Solo proceder si el contexto está corriendo
            if (this.audioContext.state === 'running') {
                // Precargar todos los sonidos
                await this.preloadAllSounds();
                
                this.isInitialized = true;
                
                // Iniciar música de fondo si no está muteado
                if (!this.isMuted) {
                    this.playBackgroundMusic();
                }
                
                console.log('✅ AudioManager inicializado completamente');
            } else {
                console.warn('⚠️ AudioContext no se pudo activar, usando fallback');
                this.initializeFallback();
            }
            
        } catch (error) {
            console.warn('⚠️ Error inicializando Web Audio API:', error);
            // Fallback a HTML Audio si falla Web Audio API
            this.initializeFallback();
        }
    }
    
    async preloadAllSounds() {
        this.isPreloading = true;
        const loadPromises = [];
        
        for (const [soundType, config] of Object.entries(this.soundConfig)) {
            if (soundType !== 'music') { // Música se maneja por separado
                loadPromises.push(this.loadSound(soundType, config.src));
            }
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('🎵 Todos los sonidos precargados');
        } catch (error) {
            console.warn('⚠️ Error precargando sonidos:', error);
        }
        
        this.isPreloading = false;
    }
    
    async loadSound(soundType, src) {
        if (this.loadingPromises[soundType]) {
            return this.loadingPromises[soundType];
        }
        
        this.loadingPromises[soundType] = this.fetchAndDecodeAudio(src);
        
        try {
            const buffer = await this.loadingPromises[soundType];
            this.audioBuffers[soundType] = buffer;
            console.log(`🎵 Sonido cargado: ${soundType}`);
            return buffer;
        } catch (error) {
            console.warn(`⚠️ Error cargando ${soundType}:`, error);
            delete this.loadingPromises[soundType];
            throw error;
        }
    }
    
    async fetchAndDecodeAudio(src) {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }
    
    // Reproducir sonido con Web Audio API (sin latencia)
    playSound(soundType) {
        if (this.isMuted || !this.isInitialized || !this.audioContext) return;
        
        const buffer = this.audioBuffers[soundType];
        if (!buffer) {
            console.warn(`⚠️ Buffer no disponible para: ${soundType}`);
            return;
        }
        
        try {
            // Resumir contexto si está suspendido
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Crear nuevo source (no reutilizable)
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            
            // Configurar volumen según tipo de sonido
            switch (soundType) {
                case 'coin':
                    gainNode.gain.value = 0.3;
                    break;
                case 'explosion':
                    gainNode.gain.value = 0.4;
                    break;
                case 'jump':
                    gainNode.gain.value = 0.2;
                    break;
                default:
                    gainNode.gain.value = 0.3;
            }
            
            // Conectar nodos
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Reproducir
            source.start(0);
            
            // Auto cleanup cuando termine
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
            };
            
        } catch (error) {
            console.warn(`⚠️ Error reproduciendo ${soundType}:`, error);
        }
    }
    
    // Métodos específicos de sonidos
    playCoinCollectSound() {
        this.playSound('coin');
    }
    
    playExplosionSound() {
        this.playSound('explosion');
    }
    
    playSuperJumpSound() {
        this.playSound('jump');
    }
    
    // Música de fondo (manejo separado)
    playBackgroundMusic() {
        if (this.isMuted) return;
        
        try {
            if (!this.backgroundMusic) {
                this.backgroundMusic = new Audio('sounds/background_music.mp3');
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = 0.1;
                this.backgroundMusic.preload = 'auto';
            }
            
            this.backgroundMusic.currentTime = 0;
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('⚠️ Error reproduciendo música:', error);
                });
            }
            
        } catch (error) {
            console.warn('⚠️ Error con música de fondo:', error);
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
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
    
    getMutedState() {
        return this.isMuted;
    }
    
    // Fallback para navegadores sin Web Audio API
    initializeFallback() {
        console.log('🎵 Usando HTML Audio fallback');
        this.isInitialized = true;
        
        // Implementación básica con HTML Audio
        this.playSound = (soundType) => {
            if (this.isMuted) return;
            
            try {
                const audio = new Audio();
                const config = this.soundConfig[soundType];
                if (config) {
                    audio.src = config.src;
                    audio.volume = 0.3;
                    audio.play().catch(() => {});
                }
            } catch (error) {
                console.warn(`⚠️ Error en fallback para ${soundType}:`, error);
            }
        };
        
        if (!this.isMuted) {
            this.playBackgroundMusic();
        }
    }
    
    // Cleanup de recursos
    destroy() {
        console.log('🧹 Limpiando AudioManager...');
        
        try {
            // Parar música
            this.stopBackgroundMusic();
            
            // Cerrar AudioContext
            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
            
            // Limpiar referencias
            this.audioBuffers = {};
            this.sourcePool = {};
            this.backgroundMusic = null;
            this.isInitialized = false;
            
        } catch (error) {
            console.warn('⚠️ Error en cleanup de audio:', error);
        }
    }
    
    // Método para verificar estado
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isMuted: this.isMuted,
            contextState: this.audioContext ? this.audioContext.state : 'none',
            buffersLoaded: Object.keys(this.audioBuffers).length,
            isPreloading: this.isPreloading
        };
    }
}

console.log('🎵 AudioManager optimizado cargado');
