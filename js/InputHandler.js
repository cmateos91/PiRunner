class InputHandler {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.isKeyPressed = false;
        this.isTouchActive = false;
        this.setupControls();
    }
    
    setupControls() {
        // Prevenir zoom en móvil
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Controles de teclado - Sistema de carga
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.isKeyPressed) {
                e.preventDefault();
                this.isKeyPressed = true;
                this.game.handleJumpStart();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && this.isKeyPressed) {
                e.preventDefault();
                this.isKeyPressed = false;
                this.game.handleJumpEnd();
            }
        });
        
        // Controles táctiles - TODA LA PANTALLA (excluyendo UI)
        document.addEventListener('touchstart', (e) => {
            // Verificar si el toque es en elementos de UI que no deben activar salto
            if (this.shouldIgnoreTouch(e.target)) {
                return;
            }
            
            e.preventDefault();
            if (!this.isTouchActive) {
                this.isTouchActive = true;
                this.game.handleJumpStart();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            // Solo procesar si teníamos un toque activo
            if (!this.isTouchActive) {
                return;
            }
            
            e.preventDefault();
            this.isTouchActive = false;
            this.game.handleJumpEnd();
        }, { passive: false });
        
        document.addEventListener('touchcancel', (e) => {
            if (this.isTouchActive) {
                e.preventDefault();
                this.isTouchActive = false;
                this.game.handleJumpCancel();
            }
        }, { passive: false });
        
        // Click para escritorio - TODA LA PANTALLA (excluyendo UI)
        document.addEventListener('mousedown', (e) => {
            // Verificar si el click es en elementos de UI que no deben activar salto
            if (this.shouldIgnoreClick(e.target)) {
                return;
            }
            
            e.preventDefault();
            if (!this.isKeyPressed) { // Evitar duplicados con teclado
                this.game.handleJumpStart();
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            // Solo procesar si no es en UI y no hay teclado activo
            if (!this.shouldIgnoreClick(e.target) && !this.isKeyPressed) {
                e.preventDefault();
                this.game.handleJumpEnd();
            }
        });
        
        // Manejar pérdida de foco de la ventana
        window.addEventListener('blur', () => {
            this.isKeyPressed = false;
            this.isTouchActive = false;
            this.game.handleJumpCancel();
        });
    }
    
    // Verificar si debemos ignorar toques en elementos de UI
    shouldIgnoreTouch(target) {
        return this.shouldIgnoreInput(target);
    }
    
    // Verificar si debemos ignorar clicks en elementos de UI
    shouldIgnoreClick(target) {
        return this.shouldIgnoreInput(target);
    }
    
    // Método común para determinar si ignorar input en ciertos elementos
    shouldIgnoreInput(target) {
        if (!target) return false;
        
        // Lista de selectores de elementos que NO deben activar salto
        const ignoredSelectors = [
            // Controles de UI principales
            '#ui',
            '.ui-scores', 
            '.ui-controls',
            '#muteButton',
            '.audio-control',
            
            // Selector de idioma
            '#languageSelector',
            '.language-option',
            
            // Modales y overlays
            '#gameOver',
            '.game-over-buttons',
            '.btn',
            '.btn-secondary',
            
            // Leaderboard
            '#leaderboardModal',
            '.leaderboard-modal',
            '.leaderboard-content',
            '.leaderboard-tab',
            '.close-leaderboard',
            
            // Espacios de anuncios
            '#adSpace',
            '.ad-placeholder',
            '#toggleAds',
            
            // Notificaciones
            '.temp-notification',
            '.payment-notification',
            
            // Inputs y formularios
            'input',
            'button', 
            'select',
            'textarea',
            'a'
        ];
        
        // Verificar el elemento y sus padres
        let element = target;
        while (element && element !== document.body) {
            // Verificar por tag name
            const tagName = element.tagName ? element.tagName.toLowerCase() : '';
            if (['button', 'input', 'select', 'textarea', 'a'].includes(tagName)) {
                return true;
            }
            
            // Verificar por ID o clase
            for (const selector of ignoredSelectors) {
                if (element.matches && element.matches(selector)) {
                    return true;
                }
            }
            
            // Verificar atributos especiales
            if (element.hasAttribute && (
                element.hasAttribute('onclick') ||
                element.hasAttribute('data-clickable') ||
                element.classList.contains('clickable')
            )) {
                return true;
            }
            
            element = element.parentElement;
        }
        
        return false;
    }
    
    reset() {
        this.isKeyPressed = false;
        this.isTouchActive = false;
    }
}