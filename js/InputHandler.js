class InputHandler {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
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
        
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.game.handleJump();
            }
        });
        
        // Controles táctiles optimizados
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.handleJump();
        }, { passive: false });
        
        // Click para escritorio
        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.game.handleJump();
        });
    }
}