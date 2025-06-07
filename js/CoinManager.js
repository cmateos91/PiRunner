class CoinManager {
    constructor(gameWidth, gameHeight, isMobile) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isMobile = isMobile;
        this.coins = [];
    }
    
    spawn(frameCount) {
        const mobileOffset = this.isMobile ? 10 : 0;
        const patterns = [
            { y: this.gameHeight - (160 - mobileOffset), single: true },
            { y: this.gameHeight - (200 - mobileOffset), single: true },
            { y: this.gameHeight - (100 - mobileOffset), single: true },
        ];
        
        if (frameCount > 1200) {
            patterns.push(
                { y: this.gameHeight - (180 - mobileOffset), multiple: 3, spacing: this.isMobile ? 25 : 30 },
                { y: this.gameHeight - (130 - mobileOffset), multiple: 2, spacing: this.isMobile ? 20 : 25 }
            );
        }
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const coinSize = this.isMobile ? 20 : 25;
        
        if (pattern.single) {
            this.coins.push({
                x: this.gameWidth,
                y: pattern.y,
                width: coinSize,
                height: coinSize,
                collected: false
            });
        } else if (pattern.multiple) {
            for (let i = 0; i < pattern.multiple; i++) {
                this.coins.push({
                    x: this.gameWidth + (i * pattern.spacing),
                    y: pattern.y,
                    width: coinSize,
                    height: coinSize,
                    collected: false
                });
            }
        }
    }
    
    update(speed) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            this.coins[i].x -= speed;
            
            if (this.coins[i].x + this.coins[i].width < 0) {
                this.coins.splice(i, 1);
            }
        }
    }
    
    checkCollision(player) {
        let collected = 0;
        
        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (!this.coins[i].collected && this.isColliding(player, this.coins[i])) {
                this.coins[i].collected = true;
                collected++;
                this.coins.splice(i, 1);
            }
        }
        
        return collected;
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    render(ctx) {
        for (let coin of this.coins) {
            if (coin.collected) continue;
            
            const centerX = coin.x + coin.width/2;
            const centerY = coin.y + coin.height/2;
            const radius = coin.width/2;
            const time = Date.now() * 0.003;
            
            // Rotación sutil de la moneda
            const rotation = time + coin.x * 0.01;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            // Sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(1, 2, radius * 0.8, radius * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Gradiente principal
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            gradient.addColorStop(0, '#FFFF99');
            gradient.addColorStop(0.6, '#FFD700');
            gradient.addColorStop(0.9, '#FFC72C');
            gradient.addColorStop(1, '#DAA520');
            
            // Círculo principal
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Borde brillante
            ctx.strokeStyle = '#FFFF99';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
            ctx.stroke();
            
            // Círculo interior
            const innerRadius = radius * 0.75;
            ctx.fillStyle = '#FFC72C';
            ctx.beginPath();
            ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Brillo superior
            const shineGradient = ctx.createLinearGradient(
                -radius * 0.5, -radius * 0.5,
                radius * 0.3, -radius * 0.2
            );
            shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = shineGradient;
            ctx.beginPath();
            ctx.arc(0, -radius * 0.2, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Símbolo Pi mejorado
            const fontSize = coin.width * 0.5;
            
            // Sombra del símbolo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('π', 0.5, 0.5);
            
            // Símbolo principal
            const piGradient = ctx.createLinearGradient(0, -radius * 0.3, 0, radius * 0.3);
            piGradient.addColorStop(0, '#1A1A1A');
            piGradient.addColorStop(0.5, '#000000');
            piGradient.addColorStop(1, '#333333');
            
            ctx.fillStyle = piGradient;
            ctx.fillText('π', 0, 0);
            
            // Brillo en el símbolo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillText('π', -0.5, -0.5);
            
            ctx.restore();
            
            // Efecto de flotación (parpadeo sutil)
            const pulseAlpha = 0.3 + Math.sin(time * 2 + coin.x * 0.1) * 0.2;
            ctx.save();
            ctx.globalAlpha = pulseAlpha;
            ctx.fillStyle = '#FFFF99';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    clear() {
        this.coins = [];
    }
}