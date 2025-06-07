// Script para manejar el botón de mute - versión simplificada
document.addEventListener('DOMContentLoaded', () => {
    const muteButton = document.getElementById('muteButton');
    
    if (muteButton) {
        muteButton.addEventListener('click', () => {
            try {
                if (window.game && window.game.audioManager) {
                    const isMuted = window.game.audioManager.toggleMute();
                    muteButton.textContent = isMuted ? '🔇' : '🔊';
                    muteButton.classList.toggle('muted', isMuted);
                }
            } catch (error) {
                console.warn('Error con controles de audio:', error);
            }
        });
    }
});