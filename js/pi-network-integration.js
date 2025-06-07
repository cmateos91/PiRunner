// Pi Network Integration
class PiNetworkManager {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('Inicializando Pi Network SDK...');
            
            // Detectar si estamos en desarrollo/testing
            const isProduction = window.location.hostname !== 'localhost' && 
                                 !window.location.hostname.includes('vercel.app');
            
            // Inicializar Pi SDK con sandbox para desarrollo
            await Pi.init({ 
                version: "2.0",
                sandbox: !isProduction // sandbox en desarrollo, mainnet en producción
            });
            
            this.isInitialized = true;
            
            console.log(`Pi Network SDK inicializado en modo: ${!isProduction ? 'Sandbox' : 'Production'}`);
            return true;
        } catch (error) {
            console.error('Error inicializando Pi Network SDK:', error);
            return false;
        }
    }

    async authenticate() {
        if (!this.isInitialized) {
            const initialized = await this.initialize();
            if (!initialized) return false;
        }

        try {
            console.log('Autenticando usuario...');
            
            // Scopes requeridos para Pi Runner
            const scopes = ['username', 'payments'];
            
            // Callback para pagos incompletos
            const onIncompletePaymentFound = (payment) => {
                console.warn('Pago incompleto encontrado:', payment);
                this.handleIncompletePayment(payment);
            };

            // Autenticar con Pi Network
            const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
            
            this.isAuthenticated = true;
            this.user = authResult.user;
            this.accessToken = authResult.accessToken;
            
            console.log('Usuario autenticado:', this.user.username);
            this.updateUI();
            
            return true;
        } catch (error) {
            console.error('Error en autenticación:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    async createPaymentForScore(score, coins) {
        if (!this.isAuthenticated) {
            console.error('Usuario no autenticado');
            return false;
        }

        try {
            const paymentData = {
                amount: 1, // TODO: Definir precio final
                memo: `Guardar puntuación: ${score} puntos, ${coins} Pi Coins`,
                metadata: {
                    score: score,
                    coins: coins,
                    timestamp: Date.now(),
                    gameVersion: "1.0"
                }
            };

            const callbacks = {
                onReadyForServerApproval: (paymentId) => {
                    console.log('Pago listo para aprobación:', paymentId);
                    // TODO: Enviar a backend para aprobación
                    this.handleServerApproval(paymentId);
                },
                
                onReadyForServerCompletion: (paymentId, txid) => {
                    console.log('Pago listo para completar:', paymentId, txid);
                    // TODO: Enviar a backend para completar
                    this.handleServerCompletion(paymentId, txid);
                },
                
                onCancel: (paymentId) => {
                    console.log('Pago cancelado:', paymentId);
                    this.showPaymentMessage('Pago cancelado. Puntuación no guardada.', 'warning');
                },
                
                onError: (error, payment) => {
                    console.error('Error en pago:', error, payment);
                    this.showPaymentMessage('Error al procesar el pago. Inténtalo de nuevo.', 'error');
                }
            };

            // Crear el pago
            Pi.createPayment(paymentData, callbacks);
            
        } catch (error) {
            console.error('Error creando pago:', error);
            this.showPaymentMessage('Error al iniciar el pago.', 'error');
            return false;
        }
    }

    handleServerApproval(paymentId) {
        // TODO: Implementar cuando tengamos backend
        console.log('TODO: Enviar para aprobación del servidor:', paymentId);
        // Por ahora simulamos aprobación automática
        this.showPaymentMessage('Procesando pago...', 'info');
    }

    handleServerCompletion(paymentId, txid) {
        // TODO: Implementar cuando tengamos backend
        console.log('TODO: Enviar para completar en servidor:', paymentId, txid);
        // Por ahora simulamos completado exitoso
        this.showPaymentMessage('¡Puntuación guardada exitosamente!', 'success');
    }

    handleIncompletePayment(payment) {
        // Manejar pagos incompletos encontrados
        console.log('Procesando pago incompleto:', payment);
        this.showPaymentMessage('Procesando pago pendiente...', 'info');
        // TODO: Enviar a backend para procesar
    }

    showPaymentMessage(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `payment-notification ${type}`;
        notification.textContent = message;
        
        // Estilos básicos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transition: 'all 0.3s ease',
            backgroundColor: this.getNotificationColor(type)
        });

        document.body.appendChild(notification);

        // Remover después de 4 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#10B981',
            'error': '#EF4444',
            'warning': '#F59E0B',
            'info': '#3B82F6'
        };
        return colors[type] || colors.info;
    }

    updateUI() {
        // Actualizar UI con información del usuario
        if (this.isAuthenticated && this.user) {
            console.log(`Usuario conectado: ${this.user.username}`);
            // TODO: Mostrar nombre de usuario en la UI si es necesario
        }
    }

    // Método para verificar si Pi Network está disponible
    static isAvailable() {
        return typeof window.Pi !== 'undefined';
    }
}

// Instancia global del manager Pi Network
window.piNetworkManager = new PiNetworkManager();