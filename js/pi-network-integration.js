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
            // Detectar entorno correctamente
            const isMainnet = this.isMainnetEnvironment();
            
            // Para testnet usamos sandbox: true
            // Para mainnet usamos sandbox: false
            await Pi.init({ 
                version: "2.0",
                sandbox: !isMainnet // sandbox: true para testnet, false para mainnet
            });
            
            this.isInitialized = true;
            console.log(`✅ Pi Network SDK inicializado (${isMainnet ? 'Mainnet' : 'Testnet'}) - sandbox: ${!isMainnet}`);
            return true;
        } catch (error) {
            console.error('Error inicializando Pi Network SDK:', error);
            return false;
        }
    }

    // Detectar si es mainnet environment
    isMainnetEnvironment() {
        const hostname = window.location.hostname.toLowerCase();
        
        // SOLO mainnet si es el dominio personalizado runnerpi.xyz
        const isMainnetDomain = hostname === 'www.runnerpi.xyz' || hostname === 'runnerpi.xyz';
        
        // TODO lo demás es testnet (incluyendo vercel.app y localhost)
        const isTestnetDomain = hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
        
        console.log(`🔍 Domain detection: ${hostname} -> ${isMainnetDomain ? 'Mainnet' : 'Testnet'}`);
        
        return isMainnetDomain;
    }

    async authenticate() {
        if (!this.isInitialized) {
            const initialized = await this.initialize();
            if (!initialized) return false;
        }

        try {
            const scopes = ['username', 'payments'];
            const onIncompletePaymentFound = (payment) => {
                console.warn('Pago incompleto encontrado:', payment);
                this.handleIncompletePayment(payment);
            };

            const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
            
            this.isAuthenticated = true;
            this.user = authResult.user;
            this.accessToken = authResult.accessToken;
            
            console.log('✅ Usuario autenticado:', this.user.username);
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
                amount: 0.01, // Precio accesible para testing
                memo: `Guardar puntuación: ${score} puntos, ${coins} Pi Coins`,
                metadata: {
                    score: score,
                    coins: coins,
                    timestamp: Date.now(),
                    gameVersion: "1.0",
                    appWallet: window.APP_WALLET || "GBYCQD35WCGKAECP3CLCFB7SAWF5L3AKWRKPPQONZK4BAEQQ37JMTN3V"
                }
            };

            const callbacks = {
                onReadyForServerApproval: (paymentId) => {
                    this.handleServerApproval(paymentId);
                },
                
                onReadyForServerCompletion: (paymentId, txid) => {
                    this.handleServerCompletion(paymentId, txid);
                },
                
                onCancel: (paymentId) => {
                    this.showMessage(window.i18n ? window.i18n.t('payment.cancelled') : 'Pago cancelado. Puntuación no guardada.', 'warning');
                },
                
                onError: (error, payment) => {
                    console.error('❌ Payment Error:', error);
                    this.showMessage(window.i18n ? window.i18n.t('payment.error') : 'Error al procesar el pago. Inténtalo de nuevo.', 'error');
                }
            };

            // Crear el pago
            Pi.createPayment(paymentData, callbacks);
            
        } catch (error) {
            console.error('Error creando pago:', error);
            this.showMessage('Error al iniciar el pago.', 'error');
            return false;
        }
    }

    handleServerApproval(paymentId) {
        this.showMessage(window.i18n ? window.i18n.t('payment.processing') : 'Procesando pago...', 'info');
        
        this.callBackendAPI('approve', paymentId)
            .then(response => {
                console.log('✅ Pago aprobado');
            })
            .catch(error => {
                console.error('Error en aprobación:', error);
                this.showMessage(window.i18n ? window.i18n.t('payment.error') : 'Error en la aprobación del pago', 'error');
            });
    }

    handleServerCompletion(paymentId, txid) {
        this.showMessage(window.i18n ? window.i18n.t('payment.finalizing') : 'Finalizando pago...', 'info');
        
        this.callBackendAPI('complete', paymentId, txid)
            .then(response => {
                console.log('✅ Pago completado exitosamente');
                
                if (response.payment && response.wasImprovement === false) {
                    this.showMessage(window.i18n ? window.i18n.t('payment.noImprovement') : 'Puntuación no mejorada. ¡Intenta superar tu récord! 💪', 'warning');
                } else {
                    this.showMessage(window.i18n ? window.i18n.t('payment.success') : '¡Nuevo récord guardado exitosamente! 🎉', 'success');
                }
            })
            .catch(error => {
                console.error('❌ Error al completar pago:', error);
                this.showMessage(window.i18n ? window.i18n.t('payment.error') : 'Error al completar el pago', 'error');
            });
    }

    async callBackendAPI(action, paymentId, txid = null) {
        try {
            // Usar URL actual del navegador (permite ambos environments)
            const baseUrl = window.location.origin;
                
            console.log(`🔗 Calling backend API: ${baseUrl}/api/payments (${this.isMainnetEnvironment() ? 'Mainnet' : 'Testnet'})`);
            
            const response = await fetch(`${baseUrl}/api/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action,
                    paymentId: paymentId,
                    txid: txid,
                    userInfo: this.user ? {
                        username: this.user.username,
                        uid: this.user.uid
                    } : null
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Backend API call failed:', error);
            throw error;
        }
    }

    handleIncompletePayment(payment) {
        this.showMessage('Procesando pago pendiente...', 'info');
        // TODO: Enviar a backend para procesar
    }

    // Usar función unificada de mensajes
    showMessage(message, type = 'info') {
        // Si existe la función global showMessage, usarla
        if (typeof window.showMessage === 'function') {
            window.showMessage(message, type);
            return;
        }
        
        // Fallback: implementación local
        const notification = document.createElement('div');
        notification.className = `payment-notification ${type}`;
        notification.textContent = message;
        
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

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
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
        if (this.isAuthenticated && this.user) {
            console.log(`✅ Usuario conectado: ${this.user.username}`);
        }
    }

    // Método para verificar si Pi Network está disponible
    static isAvailable() {
        return typeof window.Pi !== 'undefined';
    }
}

// Instancia global del manager Pi Network
window.piNetworkManager = new PiNetworkManager();