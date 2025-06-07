class PiRunner {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Delta time para animaciones fluidas
        this.lastTime = 0;
        this.deltaTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.accumulator = 0;
        
        // Configurar canvas responsivo
        this.setupCanvas();
        
        // Estado del juego
        this.gameState = 'playing';
        this.score = 0;
        this.coins = 0;
        this.baseSpeed = this.isMobile() ? 2.5 : 3;
        this.speed = this.baseSpeed;
        this.frameCount = 0;
        this.explosionTimer = 0;
        this.explosionDuration = 3000;
        
        // Limpieza de recursos al cerrar
        this.cleanup = [];
        
        // Instancias de clases
        this.player = new Player(this.width, this.height, this.isMobile());
        this.obstacleManager = new ObstacleManager(this.width, this.height, this.isMobile());
        this.coinManager = new CoinManager(this.width, this.height, this.isMobile());
        this.renderer = new Renderer(this.canvas, this.ctx, this.width, this.height, this.isMobile());
        this.inputHandler = new InputHandler(this.canvas, this);
        this.particleSystem = new ParticleSystem();
        this.coinFragmentSystem = new CoinFragmentSystem();
        this.audioManager = new AudioManager();
        
        this.setupResize();
        this.initializeAudio();
        
        // Iniciar el game loop
        this.startGameLoop();
        
        console.log('🎮 Pi Runner inicializado con delta time');
    }
    
    setupCanvas() {
        const container = document.getElementById('gameContainer');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // DPR limitado para Pi Browser
        const dpr = window.isPiBrowser ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        if (dpr > 1) {
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(dpr, dpr);
        }
        
        console.log(`🎮 Canvas: ${this.width}x${this.height}, DPR: ${dpr}`);
    }
    
    setupResize() {
        let resizeTimeout;
        const resizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupCanvas();
                this.updateAllDimensions();
            }, 100);
        };
        
        window.addEventListener('resize', resizeHandler);
        this.cleanup.push(() => window.removeEventListener('resize', resizeHandler));
    }
    
    updateAllDimensions() {
        const isMobile = this.isMobile();
        this.player.updatePosition(this.width, this.height, isMobile);
        if (this.renderer.updateDimensions) {
            this.renderer.updateDimensions(this.width, this.height, isMobile);
        }
    }
    
    initializeAudio() {
        // Inicializar audio SOLO tras el primer click/touch REAL en el canvas
        const initAudioOnCanvasInteraction = (event) => {
            // Solo procesar si es un evento real del usuario
            if (event.isTrusted) {
                console.log('🎵 Inicializando audio tras interacción real del usuario');
                
                try {
                    this.audioManager.initializeAfterUserGesture().then(() => {
                        console.log('🎵 Audio completamente inicializado');
                    }).catch(error => {
                        console.warn('⚠️ Error en inicialización diferida:', error);
                    });
                } catch (error) {
                    console.warn('Error inicializando audio:', error);
                }
                
                // Remover listeners tras primera inicialización exitosa
                this.canvas.removeEventListener('click', initAudioOnCanvasInteraction);
                this.canvas.removeEventListener('touchstart', initAudioOnCanvasInteraction);
            }
        };
        
        // Agregar listeners SOLO al canvas para asegurar interacción real
        this.canvas.addEventListener('click', initAudioOnCanvasInteraction, { once: true });
        this.canvas.addEventListener('touchstart', initAudioOnCanvasInteraction, { once: true });
        
        // Agregar cleanup
        this.cleanup.push(() => {
            this.canvas.removeEventListener('click', initAudioOnCanvasInteraction);
            this.canvas.removeEventListener('touchstart', initAudioOnCanvasInteraction);
        });
    }
    
    isMobile() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }
    
    handleJumpStart() {
        if (this.gameState === 'playing') {
            this.player.startJump();
        }
    }
    
    handleJumpEnd() {
        if (this.gameState === 'playing') {
            const jumpResult = this.player.executeJump();
            
            if (jumpResult) {
                if (jumpResult.isPerfect) {
                    this.particleSystem.createSuperJumpEffect(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height
                    );
                    
                    this.particleSystem.createShockwave(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height
                    );
                    
                    this.audioManager.playSuperJumpSound();
                } else {
                    this.particleSystem.createJumpEffect(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height,
                        jumpResult.chargeRatio
                    );
                }
            }
        }
    }
    
    handleJumpCancel() {
        if (this.gameState === 'playing') {
            this.player.cancelJump();
        }
    }
    
    update(deltaTime) {
        // Siempre actualizar efectos visuales con delta time
        this.particleSystem.update(deltaTime);
        this.coinFragmentSystem.update(deltaTime);
        
        if (this.gameState === 'playing') {
            this.frameCount++;
            this.score++;
            
            // Actualizar jugador con delta time
            this.player.update(deltaTime);
            
            // Generar elementos
            this.spawnElements();
            
            // Actualizar elementos con velocidad escalada por delta time
            const scaledSpeed = this.speed * (deltaTime / 16.67); // Normalizar a 60fps
            this.obstacleManager.update(scaledSpeed);
            this.coinManager.update(scaledSpeed);
            
            // Verificar colisiones
            this.checkCollisions();
            
            // Actualizar dificultad
            this.updateDifficulty();
            
            // Actualizar UI (menos frecuente)
            if (this.frameCount % 3 === 0) {
                GameUI.updateScore(this.score);
                GameUI.updateCoins(this.coins);
            }
            
        } else if (this.gameState === 'exploding') {
            const scaledSpeed = this.speed * 0.3 * (deltaTime / 16.67);
            this.obstacleManager.update(scaledSpeed);
            this.coinManager.update(scaledSpeed);
            
            this.explosionTimer += deltaTime;
            
            if (this.explosionTimer >= this.explosionDuration) {
                this.showGameOverScreen();
            }
        }
    }
    
    spawnElements() {
        // Frecuencia ajustada y más estable
        const baseObstacleFreq = this.isMobile() ? 300 : 250;
        const obstacleFrequency = Math.max(150, baseObstacleFreq - Math.floor(this.frameCount / 800) * 20);
        if (this.frameCount % obstacleFrequency === 0) {
            this.obstacleManager.spawn(this.frameCount);
        }
        
        const baseCoinFreq = this.isMobile() ? 180 : 150;
        const coinFrequency = Math.max(100, baseCoinFreq - Math.floor(this.frameCount / 1000) * 20);
        if (this.frameCount % coinFrequency === 0) {
            this.coinManager.spawn(this.frameCount);
        }
    }
    
    updateDifficulty() {
        // Incremento más gradual de dificultad
        const difficultyInterval = this.isMobile() ? 600 : 500;
        if (this.frameCount % difficultyInterval === 0) {
            this.speed += this.isMobile() ? 0.15 : 0.2;
            this.speed = Math.min(this.speed, this.baseSpeed * 3); // Límite máximo
        }
    }
    
    checkCollisions() {
        if (this.gameState !== 'playing') return;
        
        // Colisiones con obstáculos
        if (CollisionManager.checkObstacleCollisions(this.player, this.obstacleManager.obstacles)) {
            this.startExplosion();
            return;
        }
        
        // Colisiones con monedas
        const collectedCoins = this.coinManager.checkCollision(this.player);
        if (collectedCoins > 0) {
            this.audioManager.playCoinCollectSound();
            this.particleSystem.createCoinCollectEffect(
                this.player.x + this.player.width/2,
                this.player.y + this.player.height/2
            );
        }
        this.coins += collectedCoins;
    }
    
    render() {
        this.renderer.clear();
        this.renderer.renderGround();
        this.renderer.renderClouds(this.frameCount);
        
        // Renderizar elementos del juego
        this.obstacleManager.render(this.ctx);
        this.coinManager.render(this.ctx);
        
        if (this.gameState === 'playing') {
            this.player.render(this.ctx);
        }
        
        // Efectos visuales
        this.particleSystem.render(this.ctx);
        this.coinFragmentSystem.render(this.ctx);
    }
    
    startExplosion() {
        this.gameState = 'exploding';
        this.explosionTimer = 0;
        
        this.audioManager.stopBackgroundMusic();
        this.audioManager.playExplosionSound();
        
        this.coinFragmentSystem.createExplosion(
            this.player.x,
            this.player.y,
            this.player.width
        );
        
        GameUI.addDisintegrationEffect();
    }
    
    showGameOverScreen() {
        this.gameState = 'gameOver';
        GameUI.showGameOver(this.score, this.coins);
    }
    
    restart() {
        this.gameState = 'playing';
        this.score = 0;
        this.coins = 0;
        this.speed = this.baseSpeed;
        this.frameCount = 0;
        this.explosionTimer = 0;
        
        this.player.reset();
        this.obstacleManager.clear();
        this.coinManager.clear();
        this.particleSystem.clear();
        this.coinFragmentSystem.clear();
        this.inputHandler.reset();
        
        if (!this.audioManager.getMutedState()) {
            this.audioManager.playBackgroundMusic();
        }
        
        GameUI.hideGameOver();
    }
    
    // Game loop optimizado con delta time
    startGameLoop() {
        const gameLoop = (currentTime) => {
            // Calcular delta time
            if (this.lastTime === 0) {
                this.lastTime = currentTime;
            }
            
            this.deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Limitar delta time para evitar saltos grandes
            this.deltaTime = Math.min(this.deltaTime, 50); // Máximo 50ms
            
            // Acumulador para frame rate independiente
            this.accumulator += this.deltaTime;
            
            // Update con steps fijos
            while (this.accumulator >= this.frameInterval) {
                this.update(this.frameInterval);
                this.accumulator -= this.frameInterval;
            }
            
            // Render siempre
            this.render();
            
            // Continuar loop
            requestAnimationFrame(gameLoop);
        };
        
        // Iniciar el loop
        requestAnimationFrame(gameLoop);
    }
    
    // Cleanup de recursos
    destroy() {
        console.log('🧹 Limpiando recursos del juego...');
        
        // Ejecutar todas las funciones de cleanup
        this.cleanup.forEach(cleanupFn => {
            try {
                cleanupFn();
            } catch (error) {
                console.warn('Error en cleanup:', error);
            }
        });
        
        // Limpiar audio
        if (this.audioManager && typeof this.audioManager.destroy === 'function') {
            this.audioManager.destroy();
        }
        
        // Limpiar sistemas
        if (this.particleSystem) this.particleSystem.clear();
        if (this.coinFragmentSystem) this.coinFragmentSystem.clear();
        
        console.log('✅ Limpieza completada');
    }
}

// Inicializar juego
const game = new PiRunner();
window.game = game;

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    if (game && typeof game.destroy === 'function') {
        game.destroy();
    }
});

console.log('🎮 Pi Runner inicializado con optimizaciones de rendimiento');
