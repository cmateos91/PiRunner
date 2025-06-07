class ObstacleManager {
    constructor(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
        this.obstacles = [];
        this.obstacleTypes = [
            // Símbolos matemáticos enemigos de π - colores Pi Network
            { width: 25, height: 45, type: 'sigma', symbol: 'Σ', color: '#DC2626' },      // Rojo suave
            { width: 20, height: 50, type: 'integral', symbol: '∫', color: '#7C3AED' },   // Púrpura suave
            { width: 30, height: 40, type: 'delta', symbol: 'Δ', color: '#059669' },      // Verde suave
            { width: 28, height: 48, type: 'infinity', symbol: '∞', color: '#EA580C' },   // Naranja suave
            { width: 22, height: 42, type: 'alpha', symbol: 'α', color: '#9333EA' },      // Púrpura diferente
            { width: 26, height: 46, type: 'beta', symbol: 'β', color: '#4B5563' },       // Gray-600
            { width: 24, height: 44, type: 'gamma', symbol: 'γ', color: '#92400E' },      // Marrón suave
            { width: 18, height: 38, type: 'theta', symbol: 'θ', color: '#B91C1C' },      // Rojo oscuro suave
        ];
    }
    
    spawn(frameCount) {
        const mobileScale = this.isMobile ? 0.8 : 1;
        
        // Progresión de enemigos según el tiempo
        let availableTypes = [];
        if (frameCount < 600) {
            // Primeros 10 segundos: solo enemigos básicos
            availableTypes = this.obstacleTypes.slice(0, 3);
        } else if (frameCount < 1800) {
            // 10-30 segundos: agregar más enemigos
            availableTypes = this.obstacleTypes.slice(0, 5);
        } else if (frameCount < 3600) {
            // 30-60 segundos: casi todos
            availableTypes = this.obstacleTypes.slice(0, 7);
        } else {
            // Después de 1 minuto: todos los enemigos
            availableTypes = this.obstacleTypes;
        }
        
        const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        // Ocasionalmente spawn múltiples obstáculos
        const multiSpawn = frameCount > 1200 && Math.random() < 0.15; // 15% chance después de 20s
        const spawnCount = multiSpawn ? 2 : 1;
        
        for (let i = 0; i < spawnCount; i++) {
            this.obstacles.push({
                x: this.gameWidth + (i * 60), // Separación entre múltiples
                y: this.gameHeight - (this.isMobile ? 60 : 80) - (selectedType.height * mobileScale),
                width: selectedType.width * mobileScale,
                height: selectedType.height * mobileScale,
                type: selectedType.type,
                symbol: selectedType.symbol,
                color: selectedType.color,
                // Propiedades para animación
                animationFrame: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                glowIntensity: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    update(speed) {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= speed;
            
            // Actualizar animaciones
            obstacle.animationFrame += obstacle.pulseSpeed;
            
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        for (let obstacle of this.obstacles) {
            // Efectos de fondo
            MathEnemyEffects.createHostileSymbolEffect(ctx, obstacle);
            MathEnemyEffects.createAntiPiField(ctx, obstacle);
            
            // Símbolo principal
            this.renderMathSymbol(ctx, obstacle);
            
            // Efectos de primer plano
            MathEnemyEffects.addSymbolTrail(ctx, obstacle, 3);
        }
    }
    
    renderMathSymbol(ctx, obstacle) {
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;
        const time = obstacle.animationFrame;
        
        ctx.save();
        
        // Efecto de respiración/pulsación
        const pulseScale = 1 + Math.sin(time) * 0.1;
        ctx.translate(centerX, centerY);
        ctx.scale(pulseScale, pulseScale);
        
        // Sombra amenazante
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = `bold ${obstacle.height * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obstacle.symbol, 3, 3);
        ctx.restore();
        
        // Resplandor de fondo
        const glowAlpha = 0.3 + Math.sin(time * 1.5) * 0.2;
        ctx.save();
        ctx.globalAlpha = glowAlpha * obstacle.glowIntensity;
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.arc(0, 0, obstacle.width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Gradiente del símbolo principal
        const gradient = ctx.createLinearGradient(
            0, -obstacle.height / 2,
            0, obstacle.height / 2
        );
        gradient.addColorStop(0, this.lightenColor(obstacle.color, 40));
        gradient.addColorStop(0.5, obstacle.color);
        gradient.addColorStop(1, this.darkenColor(obstacle.color, 30));
        
        // Símbolo principal
        ctx.fillStyle = gradient;
        ctx.font = `bold ${obstacle.height * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obstacle.symbol, 0, 0);
        
        // Borde brillante
        ctx.strokeStyle = this.lightenColor(obstacle.color, 60);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(obstacle.symbol, 0, 0);
        
        // Brillo superior
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(time * 2) * 0.3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = `bold ${obstacle.height * 0.8}px Arial`;
        ctx.fillText(obstacle.symbol, -1, -obstacle.height * 0.15);
        ctx.restore();
        
        // Partículas malévolas ocasionales
        if (Math.random() < 0.1) {
            this.renderEvilParticles(ctx, obstacle);
        }
        
        ctx.restore();
    }
    
    renderEvilParticles(ctx, obstacle) {
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + obstacle.animationFrame;
            const distance = obstacle.width * 0.7;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            ctx.save();
            ctx.globalAlpha = 0.4 + Math.sin(obstacle.animationFrame + i) * 0.3;
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Utilidades para manipular colores
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                     (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
                     (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const B = (num >> 8 & 0x00FF) - amt;
        const G = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 + 
                     (B > 255 ? 255 : B < 0 ? 0 : B) * 0x100 + 
                     (G > 255 ? 255 : G < 0 ? 0 : G)).toString(16).slice(1);
    }
    
    clear() {
        this.obstacles = [];
    }
}