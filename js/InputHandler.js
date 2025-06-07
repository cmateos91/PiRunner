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
        
        // Controles táctiles - Sistema de carga
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isTouchActive) {
                this.isTouchActive = true;
                this.game.handleJumpStart();
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.isTouchActive) {
                this.isTouchActive = false;
                this.game.handleJumpEnd();
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            if (this.isTouchActive) {
                this.isTouchActive = false;
                this.game.handleJumpCancel();
            }
        }, { passive: false });
        
        // Click para escritorio - Sistema de carga
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (!this.isKeyPressed) { // Evitar duplicados con teclado
                this.game.handleJumpStart();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (!this.isKeyPressed) { // Evitar duplicados con teclado
                this.game.handleJumpEnd();
            }
        });
        
        // Manejar cuando el mouse sale del canvas
        this.canvas.addEventListener('mouseleave', (e) => {
            if (!this.isKeyPressed) {
                this.game.handleJumpCancel();
            }
        });
        
        // Manejar pérdida de foco de la ventana
        window.addEventListener('blur', () => {
            this.isKeyPressed = false;
            this.isTouchActive = false;
            this.game.handleJumpCancel();
        });
    }
    
    reset() {
        this.isKeyPressed = false;
        this.isTouchActive = false;
    }
}