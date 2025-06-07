class PiRunner {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar canvas responsivo
        this.setupCanvas();
        
        // Estado del juego
        this.gameState = 'playing'; // 'playing', 'exploding', 'gameOver'
        this.score = 0;
        this.coins = 0;
        this.speed = this.isMobile() ? 2.5 : 3;
        this.frameCount = 0;
        this.explosionTimer = 0;
        this.explosionDuration = 3000; // 3 segundos para ver la explosión
        
        // Instancias de clases
        this.player = new Player(this.width, this.height, this.isMobile());
        this.obstacleManager = new ObstacleManager(this.width, this.height, this.isMobile());
        this.coinManager = new CoinManager(this.width, this.height, this.isMobile());
        this.renderer = new Renderer(this.canvas, this.ctx, this.width, this.height, this.isMobile());
        this.inputHandler = new InputHandler(this.canvas, this);
        this.particleSystem = new ParticleSystem();
        this.coinFragmentSystem = new CoinFragmentSystem();
        
        this.setupResize();
        this.gameLoop();
    }
    
    setupCanvas() {
        const container = document.getElementById('gameContainer');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Configurar para pantallas de alta densidad
        const dpr = window.devicePixelRatio || 1;
        if (dpr > 1) {
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.ctx.scale(dpr, dpr);
        }
    }
    
    setupResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupCanvas();
                this.updateAllDimensions();
            }, 100);
        });
    }
    
    updateAllDimensions() {
        const isMobile = this.isMobile();
        this.player.updatePosition(this.width, this.height, isMobile);
        this.renderer.updateDimensions(this.width, this.height, isMobile);
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
                // Crear efecto de partículas basado en el tipo de salto
                if (jumpResult.isPerfect) {
                    // Supersalto - efectos especiales
                    this.particleSystem.createSuperJumpEffect(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height
                    );
                    
                    // Efecto de onda de choque
                    this.particleSystem.createShockwave(
                        this.player.x + this.player.width/2,
                        this.player.y + this.player.height
                    );
                } else {
                    // Salto normal con intensidad variable
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
    
    // Método legacy para compatibilidad
    handleJump() {
        this.handleJumpStart();
        this.handleJumpEnd();
    }
    
    update() {
        // Siempre actualizar efectos visuales
        this.particleSystem.update();
        this.coinFragmentSystem.update();
        
        if (this.gameState === 'playing') {
            this.frameCount++;
            this.score++;
            
            // Actualizar jugador
            this.player.update();
            
            // Generar elementos
            this.spawnElements();
            
            // Actualizar elementos
            this.obstacleManager.update(this.speed);
            this.coinManager.update(this.speed);
            
            // Verificar colisiones
            this.checkCollisions();
            
            // Actualizar dificultad
            this.updateDifficulty();
            
            // Actualizar UI
            GameUI.updateScore(this.score);
            GameUI.updateCoins(this.coins);
            
        } else if (this.gameState === 'exploding') {
            // Durante la explosión, solo continuar el movimiento de obstáculos y monedas
            this.obstacleManager.update(this.speed * 0.3); // Velocidad reducida
            this.coinManager.update(this.speed * 0.3);
            
            // Actualizar timer de explosión
            this.explosionTimer += 16; // Aproximadamente 60fps
            
            // Cambiar a game over después del tiempo de explosión
            if (this.explosionTimer >= this.explosionDuration) {
                this.showGameOverScreen();
            }
        }
        // En estado 'gameOver' no actualizar nada del juego
    }
    
    spawnElements() {
        // Generar obstáculos (reducida frecuencia para apreciar mejor los nuevos enemigos)
        const baseObstacleFreq = this.isMobile() ? 240 : 200;
        const obstacleFrequency = Math.max(120, baseObstacleFreq - Math.floor(this.frameCount / 600) * 15);
        if (this.frameCount % obstacleFrequency === 0) {
            this.obstacleManager.spawn(this.frameCount);
        }
        
        // Generar monedas
        const baseCoinFreq = this.isMobile() ? 150 : 120;
        const coinFrequency = Math.max(80, baseCoinFreq - Math.floor(this.frameCount / 900) * 15);
        if (this.frameCount % coinFrequency === 0) {
            this.coinManager.spawn(this.frameCount);
        }
    }
    
    updateDifficulty() {
        const difficultyInterval = this.isMobile() ? 400 : 300;
        if (this.frameCount % difficultyInterval === 0) {
            this.speed += this.isMobile() ? 0.2 : 0.3;
        }
    }
    
    checkCollisions() {
        // Solo verificar colisiones si el juego está activo
        if (this.gameState !== 'playing') return;
        
        // Colisiones con obstáculos
        if (CollisionManager.checkObstacleCollisions(this.player, this.obstacleManager.obstacles)) {
            this.startExplosion();
            return;
        }
        
        // Colisiones con monedas
        const collectedCoins = this.coinManager.checkCollision(this.player);
        if (collectedCoins > 0) {
            // Crear efecto de partículas por cada moneda recolectada
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
        
        // Solo renderizar el jugador si está jugando
        if (this.gameState === 'playing') {
            this.player.render(this.ctx);
        }
        
        // Siempre renderizar efectos
        this.particleSystem.render(this.ctx);
        this.coinFragmentSystem.render(this.ctx);
    }
    
    startExplosion() {
        this.gameState = 'exploding';
        this.explosionTimer = 0;
        
        // Crear explosión de fragmentos de moneda
        this.coinFragmentSystem.createExplosion(
            this.player.x,
            this.player.y,
            this.player.width
        );
        
        // Agregar efectos visuales adicionales
        GameUI.addDisintegrationEffect();
    }
    
    showGameOverScreen() {
        this.gameState = 'gameOver';
        GameUI.showGameOver(this.score, this.coins);
    }
    
    gameOver() {
        // Método deprecated - usar startExplosion() en su lugar
        this.startExplosion();
    }
    
    restart() {
        this.gameState = 'playing';
        this.score = 0;
        this.coins = 0;
        this.speed = this.isMobile() ? 2.5 : 3;
        this.frameCount = 0;
        this.explosionTimer = 0;
        
        this.player.reset();
        this.obstacleManager.clear();
        this.coinManager.clear();
        this.particleSystem.clear();
        this.coinFragmentSystem.clear();
        this.inputHandler.reset();
        
        GameUI.hideGameOver();
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Inicializar juego
const game = new PiRunner();