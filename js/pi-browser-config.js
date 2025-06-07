// Configuración específica para Pi Browser - Audio optimizado
console.log('🔧 Cargando configuración optimizada para Pi Browser');

// Detectar Pi Browser con múltiples métodos
const isPiBrowser = (() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Detectores específicos
    const piBrowserSignatures = [
        'pibrowser',
        'pi browser',
        'pinetwork',
        'pi network'
    ];
    
    const piDomainSignatures = [
        'minepi.com',
        'pi.app',
        'sandbox.minepi.com',
        'pinet.com'
    ];
    
    const isUserAgentMatch = piBrowserSignatures.some(signature => 
        userAgent.includes(signature)
    );
    
    const isDomainMatch = piDomainSignatures.some(domain => 
        hostname.includes(domain)
    );
    
    // Detectar características típicas de Pi Browser
    const isMobileWebkit = userAgent.includes('mobile') && userAgent.includes('webkit');
    const hasVirtualKeyboard = 'virtualKeyboard' in navigator;
    
    return isUserAgentMatch || isDomainMatch || (isMobileWebkit && hasVirtualKeyboard);
})();

// Configuración de audio específica para Pi Browser
const PiBrowserAudioConfig = {
    // Configuración para reducir latencia
    audioBufferSize: isPiBrowser ? 512 : 1024,
    preloadStrategy: isPiBrowser ? 'immediate' : 'lazy',
    poolSize: isPiBrowser ? 3 : 1,
    useWebAudio: isPiBrowser && !!(window.AudioContext || window.webkitAudioContext),
    
    // Volúmenes optimizados
    volumes: {
        effects: isPiBrowser ? 0.5 : 0.3,
        music: isPiBrowser ? 0.2 : 0.1,
        coins: isPiBrowser ? 0.4 : 0.3
    },
    
    // Formatos prioritarios
    preferredFormats: isPiBrowser ? ['wav', 'mp3'] : ['mp3', 'wav'],
    
    // Configuración de precarga
    preloadOnInit: isPiBrowser,
    aggressivePreload: isPiBrowser,
    
    // Configuraciones específicas para reducir latencia
    fastPlayback: isPiBrowser,
    immediatePlay: isPiBrowser,
    poolRotation: isPiBrowser
};

// Optimizaciones específicas para Pi Browser
if (isPiBrowser) {
    console.log('🔧 Aplicando optimizaciones para Pi Browser');
    
    // Configurar audio para reproducción inline
    document.addEventListener('DOMContentLoaded', () => {
        // Aplicar configuraciones de audio
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.setAttribute('playsinline', true);
            audio.setAttribute('webkit-playsinline', true);
            audio.setAttribute('x-webkit-airplay', 'deny');
            audio.preload = 'auto';
        });
        
        // Aplicar clase CSS para Pi Browser
        document.body.classList.add('pi-browser-optimized');
        
        // Optimizar viewport
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no';
        }
    });
    
    // Prevenir comportamientos que causan latencia
    document.addEventListener('touchstart', (e) => {
        // Prevenir zoom accidental
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Optimizar para reproducción de audio rápida
    window.addEventListener('load', () => {
        // NO crear AudioContext aquí - lo hace AudioManager tras gesto del usuario
        console.log('🔧 Configuración de audio lista para Pi Browser');
    });
}

// Función para verificar capacidades específicas de audio
function checkAudioCapabilities() {
    const capabilities = {
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        htmlAudio: !!window.Audio,
        formats: {
            wav: (new Audio()).canPlayType('audio/wav') !== '',
            mp3: (new Audio()).canPlayType('audio/mpeg') !== '',
            ogg: (new Audio()).canPlayType('audio/ogg') !== ''
        },
        features: {
            playsinline: 'playsinline' in document.createElement('audio'),
            autoplay: false // Se detectará dinámicamente
        }
    };
    
    // Test de autoplay
    const testAudio = new Audio();
    testAudio.volume = 0.01;
    testAudio.src = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAC';
    testAudio.play().then(() => {
        capabilities.features.autoplay = true;
    }).catch(() => {
        capabilities.features.autoplay = false;
    });
    
    console.log('🔧 Capacidades de audio:', capabilities);
    return capabilities;
}

// Configuración de rendimiento para Pi Browser
const PiBrowserPerformanceConfig = {
    targetFPS: isPiBrowser ? 45 : 60, // FPS ligeramente reducido para estabilidad
    audioLatency: isPiBrowser ? 'low' : 'normal',
    particleOptimization: isPiBrowser,
    memoryManagement: isPiBrowser ? 'aggressive' : 'normal'
};

// Exponer configuraciones globalmente
window.isPiBrowser = isPiBrowser;
window.PiBrowserAudioConfig = PiBrowserAudioConfig;
window.PiBrowserPerformanceConfig = PiBrowserPerformanceConfig;
window.audioCapabilities = checkAudioCapabilities();

// Función de debug para audio
window.debugPiBrowserAudio = () => {
    console.log('🎵 Debug Pi Browser Audio:', {
        isPiBrowser,
        audioConfig: PiBrowserAudioConfig,
        capabilities: window.audioCapabilities,
        globalAudioContext: !!window.globalAudioContext
    });
};

console.log(`🔧 Configuración completada - Pi Browser: ${isPiBrowser ? 'SÍ' : 'NO'}`);
