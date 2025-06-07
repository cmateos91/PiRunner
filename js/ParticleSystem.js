class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.isLowPerformanceMode = false;
    }
    
    setLowPerformanceMode(enabled) {
        this.isLowPerformanceMode = enabled;
        this.maxParticles = enabled ? 20 : 50;
        
        // Reducir partículas existentes si es necesario
        if (enabled && this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(0, this.maxParticles);
        }
    }
    
    addParticle(particle) {
        // En modo bajo rendimiento, reducir probabilidad de crear partículas
        if (this.isLowPerformanceMode && Math.random() > 0.5) {
            return;
        }
        
        this.particles.push(particle);
        
        // Mantener límite de partículas
        if (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
    }
    
    createSuperJumpEffect(x, y) {
        // Efecto especial para supersalto - más partículas y colores únicos
        const count = this.isLowPerformanceMode ? 6 : 12;
        
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x + (Math.random() - 0.5) * 40,
                y: y + 25,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 4 + 2,
                life: 1.2,
                decay: 0.015,
                size: Math.random() * 3 + 2,
                color: i % 3 === 0 ? 
                       `rgba(0, 255, 255, 0.9)` :  // Cian brillante
                       i % 3 === 1 ?
                       `rgba(255, 255, 255, 0.95)` : // Blanco puro
                       `rgba(0, 255, 136, 0.9)`      // Verde brillante
            });
        }
    }
    
    createShockwave(x, y) {
        // Onda de choque circular para supersalto
        const count = this.isLowPerformanceMode ? 4 : 8;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                life: 0.8,
                decay: 0.04,
                size: 4,
                color: `rgba(0, 255, 255, 0.7)`
            });
        }
    }
    
    createCoinCollectEffect(x, y) {
        const count = this.isLowPerformanceMode ? 4 : 8;
        
        for (let i = 0; i < count; i++) {
            this.addParticle({
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
    
    createJumpEffect(x, y, intensity = 1) {
        const baseCount = this.isLowPerformanceMode ? 2 : 3;
        const particleCount = Math.floor(baseCount + intensity * (this.isLowPerformanceMode ? 2 : 4));
        
        for (let i = 0; i < particleCount; i++) {
            this.addParticle({
                x: x + (Math.random() - 0.5) * 30,
                y: y + 20,
                vx: (Math.random() - 0.5) * 4 * intensity,
                vy: Math.random() * 2 + 1 + intensity,
                life: 0.6 + intensity * 0.4,
                decay: 0.02 + intensity * 0.01,
                size: Math.random() * 2 + 1 + intensity,
                color: intensity > 0.8 ? 
                       `rgba(255, 255, 255, 0.9)` :  // Blanco brillante para saltos potentes
                       `rgba(255, 255, 255, 0.7)`    // Blanco normal
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
