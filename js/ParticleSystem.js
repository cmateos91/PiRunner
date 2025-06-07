class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = window.isPiBrowser ? 15 : 30;
        this.isLowPerformanceMode = false;
        
        // Object pool para evitar garbage collection
        this.particlePool = [];
        this.poolSize = this.maxParticles + 10;
        this.initializePool();
        
        console.log(`🎆 ParticleSystem optimizado: ${this.maxParticles} max particles`);
    }
    
    initializePool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.particlePool.push({
                x: 0, y: 0, vx: 0, vy: 0,
                life: 0, maxLife: 1, size: 0,
                color: '', inUse: false
            });
        }
    }
    
    getParticleFromPool() {
        for (let particle of this.particlePool) {
            if (!particle.inUse) {
                particle.inUse = true;
                return particle;
            }
        }
        return null; // Pool exhausted
    }
    
    returnParticleToPool(particle) {
        particle.inUse = false;
        particle.life = 0;
    }
    
    setLowPerformanceMode(enabled) {
        this.isLowPerformanceMode = enabled;
        this.maxParticles = enabled ? (window.isPiBrowser ? 8 : 15) : (window.isPiBrowser ? 15 : 30);
        
        // Reducir partículas activas si es necesario
        if (enabled && this.particles.length > this.maxParticles) {
            const excess = this.particles.splice(this.maxParticles);
            excess.forEach(particle => this.returnParticleToPool(particle));
        }
    }
    
    addParticle(config) {
        // Probabilidad reducida en modo bajo rendimiento
        if (this.isLowPerformanceMode && Math.random() > 0.7) {
            return;
        }
        
        const particle = this.getParticleFromPool();
        if (!particle) return; // Pool exhausted
        
        // Configurar partícula
        Object.assign(particle, config);
        particle.maxLife = particle.life;
        
        this.particles.push(particle);
        
        // Mantener límite
        if (this.particles.length > this.maxParticles) {
            const removed = this.particles.shift();
            this.returnParticleToPool(removed);
        }
    }
    
    createSuperJumpEffect(x, y) {
        const count = this.isLowPerformanceMode ? 4 : 8;
        
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x + (Math.random() - 0.5) * 40,
                y: y + 25,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 4 + 2,
                life: 1.0,
                size: Math.random() * 3 + 2,
                color: ['rgba(0, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)', 'rgba(0, 255, 136, 0.9)'][i % 3]
            });
        }
    }
    
    createShockwave(x, y) {
        if (this.isLowPerformanceMode) return;
        
        const count = 6;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.addParticle({
                x: x, y: y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                life: 0.6,
                size: 3,
                color: 'rgba(0, 255, 255, 0.7)'
            });
        }
    }
    
    createCoinCollectEffect(x, y) {
        const count = this.isLowPerformanceMode ? 3 : 6;
        
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 0.8,
                size: Math.random() * 2 + 1.5,
                color: `hsl(${45 + Math.random() * 15}, 100%, ${70 + Math.random() * 20}%)`
            });
        }
    }
    
    createJumpEffect(x, y, intensity = 1) {
        const baseCount = this.isLowPerformanceMode ? 1 : 2;
        const particleCount = Math.floor(baseCount + intensity);
        
        for (let i = 0; i < particleCount; i++) {
            this.addParticle({
                x: x + (Math.random() - 0.5) * 30,
                y: y + 20,
                vx: (Math.random() - 0.5) * 4 * intensity,
                vy: Math.random() * 2 + 1 + intensity,
                life: 0.5 + intensity * 0.3,
                size: Math.random() * 2 + 1 + intensity,
                color: intensity > 0.8 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'
            });
        }
    }
    
    update(deltaTime = 16.67) {
        const dtScale = deltaTime / 16.67; // Normalizar a 60fps
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Física con delta time
            particle.x += particle.vx * dtScale;
            particle.y += particle.vy * dtScale;
            particle.vy += 0.08 * dtScale; // Gravedad escalada
            
            // Decaimiento de vida con delta time
            const decay = (particle.maxLife / 60) * dtScale; // Vida en frames
            particle.life -= decay;
            
            if (particle.life <= 0) {
                const removed = this.particles.splice(i, 1)[0];
                this.returnParticleToPool(removed);
            }
        }
    }
    
    render(ctx) {
        if (this.particles.length === 0) return;
        
        // Renderizado optimizado
        ctx.save();
        
        for (let particle of this.particles) {
            const alpha = Math.max(0, particle.life / particle.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    clear() {
        // Devolver todas las partículas al pool
        this.particles.forEach(particle => this.returnParticleToPool(particle));
        this.particles = [];
    }
    
    getStats() {
        const inUse = this.particlePool.filter(p => p.inUse).length;
        return {
            active: this.particles.length,
            poolInUse: inUse,
            poolAvailable: this.particlePool.length - inUse,
            maxParticles: this.maxParticles
        };
    }
}
