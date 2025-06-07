class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createCoinCollectEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 3 + 2,
                color: `hsl(${45 + Math.random() * 15}, 100%, ${70 + Math.random() * 20}%)`
            });
        }
    }
    
    createJumpEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + 20,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2 + 1,
                life: 0.8,
                decay: 0.025,
                size: Math.random() * 2 + 1,
                color: `rgba(255, 255, 255, 0.8)`
            });
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        for (let particle of this.particles) {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    clear() {
        this.particles = [];
    }
}