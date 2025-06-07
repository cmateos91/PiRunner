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
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.gameHeight - groundHeight, this.gameWidth, groundHeight);
        
        // Línea de césped
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.gameHeight - groundHeight, this.gameWidth, 10);
    }
    
    renderClouds(frameCount) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const cloudOffset = (frameCount * 0.5) % (this.gameWidth + 100);
        
        this.renderCloud(200 - cloudOffset, 50);
        this.renderCloud(400 - cloudOffset, 80);
        this.renderCloud(600 - cloudOffset, 40);
    }
    
    renderCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateDimensions(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
    }
}