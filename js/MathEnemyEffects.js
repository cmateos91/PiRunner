class MathEnemyEffects {
    static createHostileSymbolEffect(ctx, obstacle) {
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;
        const time = Date.now() * 0.003;
        
        // Aura malévola
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(time + obstacle.animationFrame) * 0.1;
        
        const auraGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, obstacle.width
        );
        auraGradient.addColorStop(0, obstacle.color + '80'); // 50% transparencia
        auraGradient.addColorStop(0.7, obstacle.color + '40'); // 25% transparencia
        auraGradient.addColorStop(1, obstacle.color + '00'); // Transparente
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, obstacle.width * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    static createAntiPiField(ctx, obstacle) {
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;
        const time = Date.now() * 0.005;
        
        // Campo de distorsión matemática
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + time;
            const radius = obstacle.width * 0.8 + Math.sin(time * 2 + i) * 5;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            ctx.arc(x, y, 1 + Math.sin(time + i) * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    
    static addSymbolTrail(ctx, obstacle, speed) {
        const time = Date.now() * 0.01;
        const trailLength = 3;
        
        for (let i = 0; i < trailLength; i++) {
            const alpha = (trailLength - i) / trailLength * 0.3;
            const offset = (i + 1) * speed * 0.5;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = obstacle.color;
            ctx.font = `bold ${obstacle.height * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                obstacle.symbol,
                obstacle.x + obstacle.width / 2 + offset,
                obstacle.y + obstacle.height / 2 + Math.sin(time + i) * 2
            );
            ctx.restore();
        }
    }
}