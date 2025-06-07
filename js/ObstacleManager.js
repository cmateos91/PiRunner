class ObstacleManager {
    constructor(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
        this.obstacles = [];
        this.obstacleTypes = [
            { width: 20, height: 40, type: 'cactus' },
            { width: 15, height: 60, type: 'tall_cactus' },
            { width: 25, height: 35, type: 'rock' }
        ];
    }
    
    spawn(frameCount) {
        const mobileScale = this.isMobile ? 0.8 : 1;
        const availableTypes = frameCount > 1800 ? this.obstacleTypes : [this.obstacleTypes[0]];
        const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        this.obstacles.push({
            x: this.gameWidth,
            y: this.gameHeight - (this.isMobile ? 60 : 80) - (selectedType.height * mobileScale),
            width: selectedType.width * mobileScale,
            height: selectedType.height * mobileScale,
            type: selectedType.type
        });
    }
    
    update(speed) {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= speed;
            
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        for (let obstacle of this.obstacles) {
            if (obstacle.type === 'cactus') {
                this.renderCactus(ctx, obstacle);
            } else if (obstacle.type === 'tall_cactus') {
                this.renderTallCactus(ctx, obstacle);
            } else if (obstacle.type === 'rock') {
                this.renderRock(ctx, obstacle);
            }
        }
    }
    
    renderCactus(ctx, obstacle) {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.fillStyle = '#006400';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 5, 4, 10);
        ctx.fillRect(obstacle.x + obstacle.width - 6, obstacle.y + 8, 4, 8);
    }
    
    renderTallCactus(ctx, obstacle) {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.fillStyle = '#006400';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 8, 4, 15);
        ctx.fillRect(obstacle.x + obstacle.width - 6, obstacle.y + 12, 4, 12);
        ctx.fillRect(obstacle.x + obstacle.width - 8, obstacle.y + 20, 6, 8);
    }
    
    renderRock(ctx, obstacle) {
        ctx.fillStyle = '#696969';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.fillStyle = '#808080';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(obstacle.x + 4, obstacle.y + 4, 6, 6);
        ctx.fillRect(obstacle.x + obstacle.width - 8, obstacle.y + obstacle.height - 10, 4, 4);
    }
    
    clear() {
        this.obstacles = [];
    }
}