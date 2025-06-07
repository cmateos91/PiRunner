// Sistema de feedback visual para input debugging
class InputFeedbackSystem {
    constructor() {
        this.feedbackElement = null;
        this.debugMode = false;
        this.init();
    }
    
    init() {
        this.feedbackElement = document.getElementById('inputFeedback');
        
        // Funciones globales para debugging
        window.toggleInputDebug = () => this.toggleDebugMode();
        window.showInputFeedback = (type, message) => this.showFeedback(type, message);
        
        console.log('🎯 Input Feedback System initialized');
        console.log('💡 Use toggleInputDebug() to enable visual debugging');
    }
    
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            document.body.classList.add('debug-touch-areas');
            console.log('🐛 Input Debug Mode: ON');
            console.log('  - Rojo: Áreas que NO activan salto');
            console.log('  - Verde: Áreas que SÍ activan salto');
            this.showFeedback('debug', 'Debug Mode ON');
        } else {
            document.body.classList.remove('debug-touch-areas');
            console.log('🐛 Input Debug Mode: OFF');
            this.showFeedback('debug', 'Debug Mode OFF');
        }
        
        return this.debugMode;
    }
    
    showFeedback(type, message) {
        if (!this.feedbackElement) return;
        
        // Limpiar clases previas
        this.feedbackElement.className = 'input-feedback';
        
        // Agregar clase del tipo
        this.feedbackElement.classList.add(type);
        this.feedbackElement.textContent = message;
        
        // Mostrar feedback
        this.feedbackElement.classList.add('show');
        
        // Ocultar después de un tiempo
        setTimeout(() => {
            if (this.feedbackElement) {
                this.feedbackElement.classList.remove('show');
            }
        }, type === 'debug' ? 2000 : 800);
    }
    
    // Feedback para input válido
    showJumpFeedback() {
        if (this.debugMode) {
            this.showFeedback('touch', '🦘 SALTO');
        }
    }
    
    // Feedback para input ignorado
    showIgnoredFeedback(reason = '') {
        if (this.debugMode) {
            this.showFeedback('ignored', `🚫 IGNORADO ${reason}`.trim());
        }
    }
    
    // Feedback genérico de toque
    showTouchFeedback(x, y) {
        if (this.debugMode) {
            this.showFeedback('touch', `👆 (${Math.round(x)}, ${Math.round(y)})`);
        }
    }
}

// Inicializar sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.inputFeedbackSystem = new InputFeedbackSystem();
});

// Integración con InputHandler (inyectar feedback)
function enhanceInputHandlerWithFeedback() {
    if (!window.game || !window.game.inputHandler) {
        console.log('⚠️ InputHandler no disponible aún para enhancement');
        return false;
    }
    
    const inputHandler = window.game.inputHandler;
    const feedbackSystem = window.inputFeedbackSystem;
    
    if (!feedbackSystem) {
        console.log('⚠️ InputFeedbackSystem no disponible');
        return false;
    }
    
    // Interceptar método shouldIgnoreInput para feedback
    const originalShouldIgnore = inputHandler.shouldIgnoreInput;
    inputHandler.shouldIgnoreInput = function(target) {
        const shouldIgnore = originalShouldIgnore.call(this, target);
        
        if (shouldIgnore && feedbackSystem.debugMode) {
            const elementInfo = target ? 
                (target.id || target.className || target.tagName || 'unknown') : 'null';
            feedbackSystem.showIgnoredFeedback(`(${elementInfo})`);
        }
        
        return shouldIgnore;
    };
    
    // Interceptar handleJumpStart para feedback
    const originalHandleJumpStart = window.game.handleJumpStart;
    window.game.handleJumpStart = function() {
        feedbackSystem.showJumpFeedback();
        return originalHandleJumpStart.call(this);
    };
    
    console.log('✅ InputHandler enhanced with feedback system');
    return true;
}

// Intentar enhancement cuando el juego esté listo
function tryEnhanceInputHandler() {
    if (enhanceInputHandlerWithFeedback()) {
        return;
    }
    
    // Reintentar después de un momento
    setTimeout(tryEnhanceInputHandler, 1000);
}

// Iniciar enhancement
setTimeout(tryEnhanceInputHandler, 500);

console.log('🎯 Input Feedback System loaded');
console.log('💡 Funciones disponibles:');
console.log('  - toggleInputDebug() - Activar/desactivar modo debug');
console.log('  - showInputFeedback(type, message) - Mostrar feedback manual');
