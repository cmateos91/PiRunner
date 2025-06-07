class Renderer {
    constructor(canvas, ctx, gameWidth, gameHeight, isMobile) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
    
    renderGround() {
        const groundHeight = this.isMobile ? 60 : 80;
        
        // Suelo con gradiente inspirado en Pi Network
        const groundGradient = this.ctx.createLinearGradient(
            0, this.gameHeight - groundHeight,
            0, this.gameHeight
        );
        groundGradient.addColorStop(0, '#6B7280'); // Pi gray-500
        groundGradient.addColorStop(0.3, '#4B5563'); // Pi gray-600
        groundGradient.addColorStop(1, '#374151'); // Pi gray-700
        
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.gameHeight - groundHeight, this.gameWidth, groundHeight);
        
        // Línea superior del suelo con brillo sutil
        const topGradient = this.ctx.createLinearGradient(
            0, this.gameHeight - groundHeight,
            0, this.gameHeight - groundHeight + 8
        );
        topGradient.addColorStop(0, 'rgba(156, 163, 175, 0.8)'); // Pi gray-400 con transparencia
        topGradient.addColorStop(1, 'rgba(156, 163, 175, 0.2)');
        
        this.ctx.fillStyle = topGradient;
        this.ctx.fillRect(0, this.gameHeight - groundHeight, this.gameWidth, 8);
        
        // Detalles del suelo - pequeñas piedras o textura
        this.ctx.fillStyle = 'rgba(107, 114, 128, 0.6)'; // Pi gray-500 transparente
        for (let i = 0; i < this.gameWidth; i += 40) {
            const x = i + Math.sin(i * 0.1) * 10;
            const y = this.gameHeight - groundHeight + 15 + Math.sin(i * 0.05) * 3;
            this.ctx.fillRect(x, y, 2, 2);
            this.ctx.fillRect(x + 15, y + 8, 1, 1);
        }
    }
    
    renderClouds(frameCount) {
        // Nubes más sutiles y modernas
        this.ctx.fillStyle = 'rgba(249, 250, 251, 0.6)'; // Pi gray-50 con transparencia
        const cloudOffset = (frameCount * 0.3) % (this.gameWidth + 150);
        
        // Múltiples capas de nubes para profundidad
        this.renderCloudLayer(300 - cloudOffset, 40, 0.8);
        this.renderCloudLayer(500 - cloudOffset, 60, 0.6);
        this.renderCloudLayer(700 - cloudOffset, 35, 0.9);
        
        // Segunda capa más lejana
        this.ctx.fillStyle = 'rgba(243, 244, 246, 0.4)'; // Pi gray-100 con transparencia
        const slowCloudOffset = (frameCount * 0.15) % (this.gameWidth + 200);
        this.renderCloudLayer(400 - slowCloudOffset, 80, 0.5);
        this.renderCloudLayer(800 - slowCloudOffset, 50, 0.7);
    }
    
    renderCloudLayer(x, y, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.renderCloud(x, y);
        this.ctx.restore();
    }
    
    renderCloud(x, y) {
        // Nubes más suaves y orgánicas
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 20, y - 5, 22, 0, Math.PI * 2);
        this.ctx.arc(x + 40, y, 16, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y + 8, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sombra sutil en la nube
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = 'rgba(107, 114, 128, 0.3)'; // Pi gray-500
        this.ctx.beginPath();
        this.ctx.arc(x + 2, y + 12, 15, 0, Math.PI * 2);
        this.ctx.arc(x + 22, y + 10, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 42, y + 12, 13, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    updateDimensions(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
    }
}