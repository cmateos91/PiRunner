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
            // VERIFICAR SI PI SDK ESTÁ DISPONIBLE
            if (!this.isPiSDKAvailable()) {
                this.showPiBrowserRequired();
                return false;
            }

            // Detectar entorno correctamente
            const isMainnet = this.isMainnetEnvironment();
            
            // Para testnet usamos sandbox: true
            // Para mainnet usamos sandbox: false
            await Pi.init({ 
                version: "2.0",
                sandbox: !isMainnet // sandbox: true para testnet, false para mainnet
            });
            
            this.isInitialized = true;
            const mode = isMainnet ? 'Mainnet' : 'Testnet';
            console.log(`✅ Pi Network SDK inicializado (${mode}) - sandbox: ${!isMainnet}`);
            
            // Mostrar modo en pantalla para debug
            this.showModeIndicator(mode);
            
            return true;
        } catch (error) {
            console.error('Error inicializando Pi Network SDK:', error);
            
            // Si falla, mostrar mensaje específico para URL no registrada
            if (this.isPiSDKAvailable() && error.message) {
                this.showURLNotRegistered();
            } else {
                this.showPiBrowserRequired();
            }
            return false;
        }
    }

    // Verificar si Pi SDK está disponible
    isPiSDKAvailable() {
        return typeof window.Pi !== 'undefined' && window.Pi;
    }

    // Mostrar mensaje cuando Pi SDK no está disponible
    showPiBrowserRequired() {
        const message = document.createElement('div');
        message.id = 'pi-browser-required';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <h1>🥧 Pi Browser Required</h1>
                <p style="font-size: 18px; margin: 20px 0;">
                    Esta aplicación necesita ejecutarse en Pi Browser para acceder a Pi Network.
                </p>
                <div style="margin: 20px 0;">
                    <p><strong>Opciones:</strong></p>
                    <p>📱 Abrir en Pi Browser</p>
                    <p>🔧 O usar el sandbox: <a href="https://sandbox.minepi.com/app/runnerpi-c7e8a5e13a8e9885" style="color: #ffd700;">sandbox.minepi.com</a></p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #ffd700;
                    color: black;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Continuar sin Pi Network</button>
            </div>
        `;
        document.body.appendChild(message);
    }

    // Mostrar mensaje cuando URL no está registrada en Developer Portal
    showURLNotRegistered() {
        const message = document.createElement('div');
        message.id = 'url-not-registered';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <h1>🔐 URL No Registrada</h1>
                <p style="font-size: 18px; margin: 20px 0;">
                    Esta URL no está registrada en Pi Developer Portal.
                </p>
                <div style="margin: 20px 0;">
                    <p><strong>URL actual:</strong> ${window.location.href}</p>
                    <p><strong>Solución:</strong> Registrar esta URL en develop.pi</p>
                </div>
                <div style="margin: 20px 0;">
                    <p>🔧 <strong>Usar sandbox mientras tanto:</strong></p>
                    <a href="https://sandbox.minepi.com/app/runnerpi-c7e8a5e13a8e9885" style="
                        color: #ffd700;
                        text-decoration: none;
                        background: rgba(255, 215, 0, 0.2);
                        padding: 8px 16px;
                        border-radius: 4px;
                        display: inline-block;
                        margin: 10px;
                    ">Abrir en Sandbox</a>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #ffd700;
                    color: black;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Continuar sin Pi Network</button>
            </div>
        `;
        document.body.appendChild(message);
    }

    // Detectar si es mainnet environment
    isMainnetEnvironment() {
        const hostname = window.location.hostname.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        
        // Forzar modo con parámetros URL
        const forceTestnet = urlParams.get('testnet') === 'true' || urlParams.get('sandbox') === 'true';
        const forceMainnet = urlParams.get('mainnet') === 'true';
        
        if (forceTestnet) {
            console.log(`🔍 URL Parameter: FORCED TESTNET MODE`);
            return false;
        }
        
        if (forceMainnet) {
            console.log(`🔍 URL Parameter: FORCED MAINNET MODE`);
            return true;
        }
        
        // IMPORTANTE: Por ahora TODO es testnet excepto runnerpi.xyz
        // vercel.app siempre es testnet, no mainnet
        const isMainnetDomain = hostname === 'runnerpi.xyz' || hostname === 'www.runnerpi.xyz';
        
        // TODO LO DEMÁS ES TESTNET (incluye vercel.app, localhost, etc)
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
            // Precio dinámico según environment
            const isMainnet = this.isMainnetEnvironment();
            const price = isMainnet ? 0.001 : 0.001; // Mainnet más caro, testnet barato
            
            const paymentData = {
                amount: price,
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
            const isMainnet = this.isMainnetEnvironment();
            const mode = isMainnet ? 'Mainnet' : 'Testnet';
                
            console.log(`🔗 Calling backend API: ${baseUrl}/api/payments (${mode})`);
            
            const response = await fetch(`${baseUrl}/api/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action,
                    paymentId: paymentId,
                    txid: txid,
                    environment: {
                        isMainnet: isMainnet,
                        mode: mode,
                        url: window.location.href // Incluir URL completa con parámetros
                    },
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

    // Mostrar indicador de modo en pantalla
    showModeIndicator(mode) {
        const indicator = document.createElement('div');
        indicator.id = 'pi-mode-indicator';
        indicator.textContent = `Pi ${mode}`;
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: ${mode === 'Mainnet' ? '#10B981' : '#F59E0B'};
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.getElementById('pi-mode-indicator')) {
                document.body.removeChild(indicator);
            }
        }, 10000);
    }

    // Método para verificar si Pi Network está disponible
    static isAvailable() {
        return typeof window.Pi !== 'undefined';
    }
}

// Instancia global del manager Pi Network
window.piNetworkManager = new PiNetworkManager();