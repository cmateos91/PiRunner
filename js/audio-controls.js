// Script para manejar el botón de mute - versión optimizada para Pi Browser
document.addEventListener('DOMContentLoaded', () => {
    const muteButton = document.getElementById('muteButton');
    
    if (muteButton) {
        // Inicializar estado visual desde localStorage
        const isMuted = localStorage.getItem('piRunnerMuted') === 'true';
        updateMuteButtonVisual(isMuted);
        
        // Usar event delegation para mejor rendimiento
        muteButton.addEventListener('click', handleMuteClick);
        
        // NO inicializar audio aquí - lo hace Game.js tras interacción en canvas
        console.log('🎵 Controles de audio listos');
        
        // Escuchar cambios de idioma para actualizar el botón
        window.addEventListener('languageChanged', () => {
            if (window.game && window.game.audioManager) {
                updateMuteButtonVisual(window.game.audioManager.getMutedState());
            }
        });
    }
});

// Throttle para evitar clicks rápidos
let lastMuteToggle = 0;

function handleMuteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const now = Date.now();
    if (now - lastMuteToggle < 200) return; // Throttle de 200ms
    lastMuteToggle = now;
    
    try {
        if (window.game && window.game.audioManager) {
            const isMuted = window.game.audioManager.toggleMute();
            updateMuteButtonVisual(isMuted);
            
            // Feedback táctil si está disponible
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            console.warn('AudioManager no disponible aún');
        }
    } catch (error) {
        console.warn('Error con controles de audio:', error);
    }
}

function updateMuteButtonVisual(isMuted) {
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.textContent = isMuted ? '🔇' : '🔊';
        muteButton.classList.toggle('muted', isMuted);
        
        // Usar traducciones si están disponibles
        const label = isMuted ? 
            (window.i18n ? window.i18n.t('audio.unmute') : 'Activar sonido') : 
            (window.i18n ? window.i18n.t('audio.mute') : 'Silenciar');
        
        muteButton.setAttribute('aria-label', label);
        muteButton.setAttribute('title', label);
        
        // Cambiar color para mejor feedback visual
        muteButton.style.opacity = isMuted ? '0.6' : '1.0';
    }
}

// Exponer función global para uso desde otros scripts
window.updateAudioControls = updateMuteButtonVisual;
