// Configuración simplificada para Pi Browser - versión debug
console.log('🥧 Cargando configuración de Pi Browser...');

try {
    // Configuración básica
    window.PI_BROWSER_CONFIG = {
        audio: {
            poolSizes: {
                critical: 1,
                frequent: 2,
                occasional: 1
            },
            volumes: {
                master: 0.7,
                effects: 0.4,
                music: 0.15,
                coins: 0.3
            }
        },
        performance: {
            targetFPS: 30,
            particles: {
                max: 15,
                coinEffect: 3,
                jumpEffect: 2,
                superJump: 4
            }
        }
    };
    
    console.log('🥧 Configuración base creada');
    
    // Función de detección simplificada
    window.isPiBrowser = function() {
        try {
            const userAgent = navigator.userAgent.toLowerCase();
            const hostname = window.location.hostname.toLowerCase();
            
            const isPi = userAgent.includes('pi browser') || 
                        userAgent.includes('pinetwork') ||
                        hostname.includes('pinet.com') ||
                        hostname.includes('sandbox.minepi.com');
            
            console.log('🥧 Detección Pi Browser:', { userAgent: userAgent.substring(0, 50), hostname, isPi });
            return isPi;
        } catch (error) {
            console.error('❌ Error detectando Pi Browser:', error);
            return false;
        }
    };
    
    // Aplicar configuraciones si es Pi Browser
    if (window.isPiBrowser()) {
        console.log('🥧 Pi Browser detectado - aplicando optimizaciones');
        window.IS_PI_BROWSER = true;
        window.AUDIO_CONFIG = window.PI_BROWSER_CONFIG.audio;
        window.PERFORMANCE_CONFIG = window.PI_BROWSER_CONFIG.performance;
        
        // Agregar clase CSS para optimizaciones específicas
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('pi-browser');
            console.log('🥧 Clase CSS pi-browser aplicada');
        });
        
    } else {
        console.log('🌐 Navegador estándar detectado');
        window.IS_PI_BROWSER = false;
    }
    
    // Función de debug simplificada
    window.debugAudio = function() {
        try {
            console.log('🎵 Debug de Audio:', {
                isPiBrowser: window.IS_PI_BROWSER,
                audioConfig: window.AUDIO_CONFIG,
                gameExists: !!window.game,
                audioManagerExists: !!(window.game && window.game.audioManager)
            });
            
            if (window.game && window.game.audioManager) {
                const am = window.game.audioManager;
                console.log('🎵 Estado AudioManager:', {
                    isMuted: am.isMuted,
                    isLowPerformance: am.isLowPerformanceMode,
                    isInitialized: am.isInitialized
                });
            }
        } catch (error) {
            console.error('❌ Error en debugAudio:', error);
        }
    };
    
    console.log('🥧 Configuración de Pi Browser cargada exitosamente');
    
} catch (error) {
    console.error('❌ Error fatal cargando configuración Pi Browser:', error);
    
    // Crear configuración mínima de emergencia
    window.IS_PI_BROWSER = false;
    window.debugAudio = () => console.log('Debug audio no disponible');
    window.isPiBrowser = () => false;
}

console.log('🥧 Script de configuración Pi Browser terminado');
