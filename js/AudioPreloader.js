// Audio Pre-loader para Pi Browser - Reduce latencia
class AudioPreloader {
    constructor() {
        this.preloadedSounds = {};
        this.isLoading = false;
        this.loadPromises = {};
    }
    
    async preloadAllSounds() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const sounds = [
            { key: 'coin', src: 'sounds/coin_collect.wav', priority: 1 },
            { key: 'jump', src: 'sounds/super_jump.wav', priority: 2 },
            { key: 'explosion', src: 'sounds/explosion.wav', priority: 3 }
        ];
        
        // Precargar sonidos de alta prioridad primero
        sounds.sort((a, b) => a.priority - b.priority);
        
        const loadPromises = sounds.map(sound => this.preloadSound(sound.key, sound.src));
        
        try {
            await Promise.allSettled(loadPromises);
            console.log('🎵 Preload de sonidos completado');
        } catch (error) {
            console.warn('⚠️ Error en preload de sonidos:', error);
        }
        
        this.isLoading = false;
    }
    
    async preloadSound(key, src) {
        if (this.preloadedSounds[key]) return this.preloadedSounds[key];
        
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                this.preloadedSounds[key] = audio;
                resolve(audio);
            }, { once: true });
            
            audio.addEventListener('error', (e) => {
                console.warn(`⚠️ Error loading ${key}:`, e);
                reject(e);
            }, { once: true });
            
            // Configurar para carga inmediata
            audio.preload = 'auto';
            audio.volume = 0.01; // Volumen muy bajo para test
            audio.src = src;
            audio.load();
        });
    }
    
    getPreloadedSound(key) {
        return this.preloadedSounds[key];
    }
    
    isReady(key) {
        return !!this.preloadedSounds[key];
    }
}

// Inicializar preloader globalmente
window.audioPreloader = new AudioPreloader();

// Auto-inicializar después de primer gesto
document.addEventListener('DOMContentLoaded', () => {
    let gestureDetected = false;
    
    const initializeOnGesture = () => {
        if (!gestureDetected) {
            gestureDetected = true;
            setTimeout(() => {
                window.audioPreloader.preloadAllSounds();
            }, 500); // Delay para no interferir con otros eventos
        }
    };
    
    // Escuchar primer gesto
    document.addEventListener('touchstart', initializeOnGesture, { once: true });
    document.addEventListener('click', initializeOnGesture, { once: true });
    document.addEventListener('keydown', initializeOnGesture, { once: true });
});

console.log('🎵 AudioPreloader inicializado');
