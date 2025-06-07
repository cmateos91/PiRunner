// Funciones para game over con integración Pi Network

async function initializePiNetwork() {
    console.log('Inicializando conexión con Pi Network...');
    
    if (!PiNetworkManager.isAvailable()) {
        console.warn('Pi Network SDK no disponible');
        return false;
    }

    try {
        // Inicializar Pi Network al cargar la página
        const success = await window.piNetworkManager.initialize();
        if (success) {
            console.log('Pi Network disponible y listo');
            return true;
        }
    } catch (error) {
        console.error('Error inicializando Pi Network:', error);
    }
    
    return false;
}

async function showLeaderboard() {
    console.log('Mostrar clasificación');
    
    // TODO: Implementar cuando tengamos backend
    // Por ahora mostrar mensaje temporal
    showTempMessage('🏆 Clasificación próximamente disponible', 'info');
}

async function saveScore() {
    console.log('Intentando guardar puntuación...');
    
    if (!window.game) {
        console.error('Juego no disponible');
        return;
    }

    const score = window.game.score;
    const coins = window.game.coins;

    // Verificar que hay puntuación que guardar
    if (score <= 0) {
        showTempMessage('⚠️ No hay puntuación para guardar', 'warning');
        return;
    }

    try {
        // Verificar que Pi Network está disponible
        if (!PiNetworkManager.isAvailable()) {
            showTempMessage('❌ Pi Network no disponible', 'error');
            return;
        }

        // Autenticar si no está autenticado
        if (!window.piNetworkManager.isAuthenticated) {
            showTempMessage('🔐 Autenticando con Pi Network...', 'info');
            const authenticated = await window.piNetworkManager.authenticate();
            
            if (!authenticated) {
                showTempMessage('❌ Error de autenticación', 'error');
                return;
            }
        }

        // Crear pago para guardar puntuación
        showTempMessage('💰 Iniciando pago para guardar puntuación...', 'info');
        await window.piNetworkManager.createPaymentForScore(score, coins);

    } catch (error) {
        console.error('Error guardando puntuación:', error);
        showTempMessage('❌ Error al guardar puntuación', 'error');
    }
}

function showTempMessage(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `temp-notification ${type}`;
    notification.textContent = message;
    
    // Estilos básicos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transition: 'all 0.3s ease',
        backgroundColor: getMessageColor(type),
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    });

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getMessageColor(type) {
    const colors = {
        'success': '#10B981',
        'error': '#EF4444', 
        'warning': '#F59E0B',
        'info': '#3B82F6'
    };
    return colors[type] || colors.info;
}

// Inicializar Pi Network cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando Pi Runner con Pi Network...');
    initializePiNetwork();
});