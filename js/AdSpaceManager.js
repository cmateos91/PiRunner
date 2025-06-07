// Manager para el espacio de anuncios
class AdSpaceManager {
    constructor() {
        this.adSpace = document.getElementById('adSpace');
        this.isAdVisible = true;
        this.adLoadAttempts = 0;
        this.maxAdLoadAttempts = 3;
        
        console.log('📱 AdSpaceManager inicializado');
        this.init();
    }
    
    init() {
        // Ocultar por defecto hasta que haya anuncios reales
        this.hideAdSpace();
        
        // Detectar si estamos en Pi Browser para configurar anuncios específicos
        if (window.IS_PI_BROWSER) {
            console.log('📱 Pi Browser detectado - preparando para Pi Network Ads');
            this.setupPiNetworkAds();
        } else {
            console.log('📱 Navegador estándar - anuncios estándar disponibles');
        }
    }
    
    showAdSpace() {
        if (this.adSpace) {
            this.adSpace.classList.remove('hidden');
            document.body.classList.remove('no-ads');
            this.isAdVisible = true;
            console.log('📱 Espacio de anuncios mostrado');
        }
    }
    
    hideAdSpace() {
        if (this.adSpace) {
            this.adSpace.classList.add('hidden');
            document.body.classList.add('no-ads');
            this.isAdVisible = false;
            console.log('📱 Espacio de anuncios oculto');
        }
    }
    
    setupPiNetworkAds() {
        // Configuración específica para Pi Network Ads cuando esté disponible
        if (typeof Pi !== 'undefined' && Pi.Ads) {
            console.log('📱 Pi Network Ads SDK detectado');
            this.loadPiNetworkBannerAds();
        } else {
            console.log('📱 Pi Network Ads no disponible aún');
            // Intentar de nuevo en unos segundos
            setTimeout(() => this.setupPiNetworkAds(), 2000);
        }
    }
    
    async loadPiNetworkBannerAds() {
        try {
            // Verificar si los banner ads están disponibles
            const nativeFeatures = await Pi.nativeFeaturesList();
            
            if (nativeFeatures.includes('ad_network')) {
                console.log('📱 Pi Network Ad Network disponible');
                
                // Por ahora solo preparar el espacio
                this.updateAdContent(`
                    <div class="pi-ad">
                        <div style="color: var(--pi-gold-primary); font-size: 12px; text-align: center;">
                            🥧 Pi Network Ads<br>
                            <span style="font-size: 10px; opacity: 0.7;">Banner ads disponibles pronto</span>
                        </div>
                    </div>
                `);
                
                this.showAdSpace();
            } else {
                console.log('📱 Pi Network Ad Network no disponible en esta versión');
            }
        } catch (error) {
            console.warn('📱 Error configurando Pi Network Ads:', error);
        }
    }
    
    updateAdContent(htmlContent) {
        if (this.adSpace) {
            this.adSpace.innerHTML = `<div class="ad-content">${htmlContent}</div>`;
        }
    }
    
    setAdState(state) {
        if (!this.adSpace) return;
        
        // Limpiar estados previos
        this.adSpace.classList.remove('loading', 'error', 'success');
        
        switch (state) {
            case 'loading':
                this.adSpace.classList.add('loading');
                document.body.classList.add('loading-ads');
                break;
            case 'error':
                this.adSpace.classList.add('error');
                this.updateAdContent(`
                    <div class="ad-placeholder">
                        ⚠️ Error cargando anuncios
                    </div>
                `);
                break;
            case 'success':
                this.adSpace.classList.add('success');
                document.body.classList.remove('loading-ads');
                break;
            default:
                document.body.classList.remove('loading-ads');
        }
    }
    
    // Método para testing - simular carga de anuncios
    simulateAdLoad() {
        console.log('📱 Simulando carga de anuncios...');
        
        this.setAdState('loading');
        this.showAdSpace();
        
        setTimeout(() => {
            this.updateAdContent(`
                <div class="banner-ad" style="
                    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    padding: 8px;
                    font-size: 12px;
                    font-weight: 600;
                ">
                    🎮 Demo Ad • Pi Runner
                </div>
            `);
            this.setAdState('success');
        }, 1500);
    }
    
    // Método para integración futura con Pi Network Ads
    async displayBannerAd() {
        if (!window.IS_PI_BROWSER || !Pi?.Ads) {
            console.log('📱 Pi Ads no disponible');
            return false;
        }
        
        try {
            this.setAdState('loading');
            
            // Nota: Este es el patrón para cuando Pi Network implemente banner ads
            // const adResponse = await Pi.Ads.showAd('banner');
            // 
            // if (adResponse.result === 'AD_DISPLAYED') {
            //     this.setAdState('success');
            //     return true;
            // }
            
            // Por ahora, simular
            await this.simulateAdLoad();
            return true;
            
        } catch (error) {
            console.error('📱 Error mostrando banner ad:', error);
            this.setAdState('error');
            return false;
        }
    }
    
    toggleVisibility() {
        if (this.isAdVisible) {
            this.hideAdSpace();
        } else {
            this.showAdSpace();
        }
    }
}

// Función global para toggle (para el botón de testing)
function toggleAdSpace() {
    if (window.adSpaceManager) {
        window.adSpaceManager.toggleVisibility();
    }
}

// Función global para simular ads (para testing)
function simulateAds() {
    if (window.adSpaceManager) {
        window.adSpaceManager.simulateAdLoad();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.adSpaceManager = new AdSpaceManager();
});

console.log('📱 AdSpaceManager script cargado');
