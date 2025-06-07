// Funciones para game over con integración Pi Network

async function initializePiNetwork() {
    if (!PiNetworkManager.isAvailable()) {
        console.warn('Pi Network SDK no disponible');
        return false;
    }

    try {
        const success = await window.piNetworkManager.initialize();
        if (success) {
            console.log('✅ Pi Network inicializado');
            return true;
        }
    } catch (error) {
        console.error('Error inicializando Pi Network:', error);
    }
    
    return false;
}

async function showLeaderboard() {
    try {
        showMessage(window.i18n ? window.i18n.t('leaderboard.loading') : 'Cargando clasificación...', 'info');
        createLeaderboardModal();
        await loadLeaderboardData('allTime');
    } catch (error) {
        console.error('Error mostrando leaderboard:', error);
        showMessage(window.i18n ? window.i18n.t('leaderboard.error') : 'Error cargando clasificación', 'error');
    }
}

async function saveScore() {
    if (!window.game) {
        console.error('Juego no disponible');
        return;
    }

    const score = window.game.score;
    const coins = window.game.coins;

    if (score <= 0) {
        showMessage('⚠️ No hay puntuación para guardar', 'warning');
        return;
    }

    try {
        if (!PiNetworkManager.isAvailable()) {
            showMessage('❌ Pi Network no disponible', 'error');
            return;
        }

        if (!window.piNetworkManager.isAuthenticated) {
            showMessage(window.i18n ? window.i18n.t('payment.authenticate') : 'Autenticando con Pi Network...', 'info');
            const authenticated = await window.piNetworkManager.authenticate();
            
            if (!authenticated) {
                showMessage(window.i18n ? window.i18n.t('payment.authError') : 'Error de autenticación', 'error');
                return;
            }
        }

        showMessage(window.i18n ? window.i18n.t('payment.initiating') : 'Iniciando pago para guardar puntuación...', 'info');
        await window.piNetworkManager.createPaymentForScore(score, coins);

    } catch (error) {
        console.error('Error guardando puntuación:', error);
        showMessage('❌ Error al guardar puntuación', 'error');
    }
}

// Función unificada para mostrar mensajes (reemplaza showTempMessage)
function showMessage(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `temp-notification ${type}`;
    notification.textContent = message;
    
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

// Alias para compatibilidad
const showTempMessage = showMessage;

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
    initializePiNetwork();
});

// Funciones del leaderboard
function createLeaderboardModal() {
    // Verificar si ya existe
    if (document.getElementById('leaderboardModal')) {
        document.getElementById('leaderboardModal').style.display = 'flex';
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'leaderboardModal';
    modal.className = 'leaderboard-modal';
    
    modal.innerHTML = `
        <div class="leaderboard-content">
            <div class="leaderboard-header">
                <h2 class="leaderboard-title">${window.i18n ? window.i18n.t('leaderboard.title') : '🏆 Clasificación'}</h2>
                <button class="close-leaderboard" onclick="closeLeaderboard()">×</button>
            </div>
            
            <div class="leaderboard-tabs">
                <button class="leaderboard-tab active" onclick="switchLeaderboardTab('allTime', this)">${window.i18n ? window.i18n.t('leaderboard.all') : 'Todo'}</button>
                <button class="leaderboard-tab" onclick="switchLeaderboardTab('daily', this)">${window.i18n ? window.i18n.t('leaderboard.today') : 'Hoy'}</button>
                <button class="leaderboard-tab" onclick="switchLeaderboardTab('weekly', this)">${window.i18n ? window.i18n.t('leaderboard.week') : 'Semana'}</button>
                <button class="leaderboard-tab" onclick="switchLeaderboardTab('monthly', this)">${window.i18n ? window.i18n.t('leaderboard.month') : 'Mes'}</button>
            </div>
            
            <div id="leaderboardContent">
                <div class="leaderboard-loading">${window.i18n ? window.i18n.t('leaderboard.loading') : 'Cargando...'}</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function switchLeaderboardTab(type, button) {
    // Update active tab
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    button.classList.add('active');

    // Load data for selected type
    await loadLeaderboardData(type);
}

async function loadLeaderboardData(type = 'allTime') {
    try {
        const content = document.getElementById('leaderboardContent');
        content.innerHTML = `<div class="leaderboard-loading">${window.i18n ? window.i18n.t('leaderboard.loading') : 'Cargando...'}</div>`;

        const response = await fetch(`/api/leaderboard?type=${type}&limit=20`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.leaderboard.length > 0) {
            renderLeaderboard(data.leaderboard);
        } else {
            content.innerHTML = `
                <div class="leaderboard-empty">
                    <p>${window.i18n ? window.i18n.t('leaderboard.empty') : '📭 No hay puntuaciones aún'}</p>
                    <p>${window.i18n ? window.i18n.t('leaderboard.beFirst') : '¡Sé el primero en guardar tu score!'}</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        document.getElementById('leaderboardContent').innerHTML = `
            <div class="leaderboard-empty">
                <p>${window.i18n ? window.i18n.t('leaderboard.error') : '❌ Error cargando clasificación'}</p>
                <p>${window.i18n ? window.i18n.t('leaderboard.tryAgain') : 'Inténtalo de nuevo más tarde'}</p>
            </div>
        `;
    }
}

function renderLeaderboard(scores) {
    const content = document.getElementById('leaderboardContent');
    
    const listHTML = scores.map(score => `
        <div class="leaderboard-item rank-${score.rank <= 3 ? score.rank : 'other'}">
            <div class="leaderboard-rank">${getRankDisplay(score.rank)}</div>
            <div class="leaderboard-player">
                <div class="leaderboard-username">${escapeHtml(score.username)}</div>
                <div class="leaderboard-details">
                    ${formatDate(score.timestamp)} • ${score.coins} Pi Coins
                </div>
            </div>
            <div class="leaderboard-score">
                ${score.score.toLocaleString()}
                <div class="leaderboard-coins">puntos</div>
            </div>
        </div>
    `).join('');

    content.innerHTML = `<div class="leaderboard-list">${listHTML}</div>`;
}

function getRankDisplay(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';  
    if (rank === 3) return '🥉';
    return `#${rank}`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}