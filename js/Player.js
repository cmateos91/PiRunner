class Player {
    constructor(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
        
        this.x = this.isMobile ? 60 : 100;
        this.y = this.gameHeight - (this.isMobile ? 90 : 120);
        this.width = this.isMobile ? 35 : 40;
        this.height = this.isMobile ? 35 : 40;
        this.velocityY = 0;
        this.isJumping = false;
        this.groundY = this.gameHeight - (this.isMobile ? 90 : 120);
    }
    
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.isMobile ? -13 : -15;
            this.isJumping = true;
        }
    }
    
    update() {
        // Gravedad
        this.velocityY += 0.8;
        this.y += this.velocityY;
        
        // Colisión con el suelo
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
    
    updatePosition(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
        this.groundY = this.gameHeight - (this.isMobile ? 90 : 120);
        
        if (!this.isJumping) {
            this.y = this.groundY;
        }
    }
    
    render(ctx) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        const radius = this.width/2;
        
        // Sombra de la moneda
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX + 2, centerY + 4, radius * 0.9, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Gradiente exterior (borde dorado)
        const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        outerGradient.addColorStop(0, '#FFD700');
        outerGradient.addColorStop(0.7, '#FFC72C');
        outerGradient.addColorStop(0.9, '#FF8C00');
        outerGradient.addColorStop(1, '#B8860B');
        
        // Círculo exterior
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde brillante exterior
        ctx.strokeStyle = '#FFFF99';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Círculo interior (más pequeño)
        const innerRadius = radius * 0.8;
        const innerGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, innerRadius
        );
        innerGradient.addColorStop(0, '#FFFF99');
        innerGradient.addColorStop(0.4, '#FFD700');
        innerGradient.addColorStop(0.8, '#FFC72C');
        innerGradient.addColorStop(1, '#DAA520');
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde interior
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Efecto de brillo superior
        const shineGradient = ctx.createLinearGradient(
            centerX - radius * 0.5, centerY - radius * 0.7,
            centerX + radius * 0.5, centerY - radius * 0.3
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = shineGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius * 0.2, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Símbolo Pi con estilo mejorado
        ctx.save();
        
        // Sombra del símbolo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = `bold ${this.width * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('π', centerX + 1, centerY + 1);
        
        // Gradiente para el símbolo Pi
        const piGradient = ctx.createLinearGradient(
            centerX, centerY - radius * 0.5,
            centerX, centerY + radius * 0.5
        );
        piGradient.addColorStop(0, '#2C1810');
        piGradient.addColorStop(0.5, '#000000');
        piGradient.addColorStop(1, '#4A4A4A');
        
        // Símbolo Pi principal
        ctx.fillStyle = piGradient;
        ctx.fillText('π', centerX, centerY);
        
        // Brillo en el símbolo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = `bold ${this.width * 0.6}px Arial`;
        ctx.fillText('π', centerX - 1, centerY - 1);
        
        ctx.restore();
        
        // Partículas brillantes (efecto opcional cuando salta)
        if (this.isJumping && this.velocityY < 0) {
            this.renderSparkles(ctx, centerX, centerY, radius);
        }
    }
    
    renderSparkles(ctx, centerX, centerY, radius) {
        const sparkles = 6;
        const time = Date.now() * 0.01;
        
        for (let i = 0; i < sparkles; i++) {
            const angle = (i / sparkles) * Math.PI * 2 + time;
            const distance = radius * 1.2;
            const sparkleX = centerX + Math.cos(angle) * distance;
            const sparkleY = centerY + Math.sin(angle) * distance;
            const size = 2 + Math.sin(time + i) * 1;
            
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(time + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
    }
}