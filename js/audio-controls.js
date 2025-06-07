// Script para manejar el botón de mute - versión optimizada para Pi Browser
document.addEventListener('DOMContentLoaded', () => {
    const muteButton = document.getElementById('muteButton');
    
    if (muteButton) {
        // Inicializar estado visual desde localStorage
        const isMuted = localStorage.getItem('piRunnerMuted') === 'true';
        updateMuteButtonVisual(isMuted);
        
        // Usar event delegation para mejor rendimiento
        muteButton.addEventListener('click', handleMuteClick);
        
        // Inicializar audio después de primer click en cualquier parte
        document.addEventListener('click', initializeAudioOnFirstClick, { once: true });
        document.addEventListener('touchstart', initializeAudioOnFirstClick, { once: true });
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
        muteButton.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar');
        
        // Cambiar color para mejor feedback visual
        muteButton.style.opacity = isMuted ? '0.6' : '1.0';
    }
}

// Inicializar audio de forma diferida tras primer gesto
function initializeAudioOnFirstClick() {
    setTimeout(() => {
        if (window.game && window.game.audioManager) {
            window.game.audioManager.initializeAfterUserGesture();
            console.log('Audio inicializado tras primer gesto del usuario');
        }
    }, 100);
}

// Exponer función global para uso desde otros scripts
window.updateAudioControls = updateMuteButtonVisual;
