class CoinFragmentSystem {
    constructor() {
        this.fragments = [];
    }
    
    createExplosion(x, y, playerSize) {
        const fragmentCount = 25 + Math.floor(Math.random() * 15); // 25-40 fragmentos
        const centerX = x + playerSize / 2;
        const centerY = y + playerSize / 2;
        
        for (let i = 0; i < fragmentCount; i++) {
            // Ángulos más distribuidos para mejor dispersión
            const angle = (Math.PI * 2 / fragmentCount) * i + (Math.random() - 0.5) * 1.2;
            const speed = 2 + Math.random() * 6; // Velocidades más variadas
            const size = (playerSize * 0.08) + Math.random() * (playerSize * 0.12); // Tamaños más variados
            
            // Añadir velocidades más extremas para mayor dispersión
            const velocityMultiplier = 0.8 + Math.random() * 1.4;
            
            this.fragments.push({
                x: centerX + (Math.random() - 0.5) * 10, // Posición inicial ligeramente dispersa
                y: centerY + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed * velocityMultiplier,
                vy: Math.sin(angle) * speed * velocityMultiplier - (Math.random() * 3 + 1),
                size: size,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.4,
                life: 1.0,
                decay: 0.003 + Math.random() * 0.002, // Vida más larga para verlos más tiempo
                bounced: false,
                bounceCount: 0,
                maxBounces: 2 + Math.floor(Math.random() * 3), // Múltiples rebotes
                groundY: y + playerSize + 30, // Ajustar nivel del suelo
                opacity: 1.0,
                settled: false, // Para fragmentos que se quedan en el suelo
                color: {
                    hue: 35 + Math.random() * 25, // Rango más amplio de dorados
                    saturation: 70 + Math.random() * 30,
                    lightness: 50 + Math.random() * 30
                }
            });
        }
    }
    
    update() {
        for (let i = this.fragments.length - 1; i >= 0; i--) {
            const fragment = this.fragments[i];
            
            // Solo actualizar física si no está asentado
            if (!fragment.settled) {
                // Física
                fragment.x += fragment.vx;
                fragment.y += fragment.vy;
                fragment.vy += 0.2; // Gravedad más fuerte
                fragment.rotation += fragment.rotationSpeed;
                
                // Rebote en el suelo
                if (fragment.y >= fragment.groundY && fragment.bounceCount < fragment.maxBounces) {
                    fragment.vy *= -0.4 - (Math.random() * 0.3); // Rebote variable
                    fragment.vx *= 0.7 + (Math.random() * 0.2); // Fricción variable
                    fragment.bounceCount++;
                    fragment.rotationSpeed *= 0.8;
                    
                    // Añadir algo de variación en la posición horizontal al rebotar
                    fragment.vx += (Math.random() - 0.5) * 0.5;
                }
                
                // Si ha rebotado suficientes veces y está cerca del suelo, asentarlo
                if (fragment.bounceCount >= fragment.maxBounces && 
                    fragment.y >= fragment.groundY - 5 && 
                    Math.abs(fragment.vy) < 0.5) {
                    fragment.settled = true;
                    fragment.y = fragment.groundY;
                    fragment.vy = 0;
                    fragment.vx = 0;
                    fragment.rotationSpeed *= 0.1; // Rotación muy lenta cuando está asentado
                    fragment.decay = 0.001; // Desvanecimiento muy lento para fragmentos asentados
                }
                
                // Fricción adicional después de múltiples rebotes
                if (fragment.bounceCount > 0) {
                    fragment.vx *= 0.99;
                    fragment.vy *= 0.98;
                }
            } else {
                // Fragmentos asentados solo rotan ligeramente
                fragment.rotation += fragment.rotationSpeed;
            }
            
            // Desvanecimiento más lento para fragmentos asentados
            fragment.life -= fragment.decay;
            fragment.opacity = Math.max(0, fragment.life);
            
            // Eliminar fragmentos muertos (pero dar más tiempo a los asentados)
            if (fragment.life <= 0) {
                this.fragments.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        for (let fragment of this.fragments) {
            ctx.save();
            
            // Posición y rotación
            ctx.translate(fragment.x, fragment.y);
            ctx.rotate(fragment.rotation);
            ctx.globalAlpha = fragment.opacity;
            
            const radius = fragment.size / 2;
            
            // Sombra para fragmentos asentados (más realista)
            if (fragment.settled) {
                ctx.save();
                ctx.globalAlpha = fragment.opacity * 0.3;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.beginPath();
                ctx.ellipse(1, 3, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                ctx.globalAlpha = fragment.opacity;
            }
            
            // Gradiente del fragmento más detallado
            const gradient = ctx.createRadialGradient(
                -radius * 0.3, -radius * 0.3, 0, 
                0, 0, radius
            );
            gradient.addColorStop(0, `hsl(${fragment.color.hue}, ${fragment.color.saturation}%, ${fragment.color.lightness + 30}%)`);
            gradient.addColorStop(0.4, `hsl(${fragment.color.hue}, ${fragment.color.saturation}%, ${fragment.color.lightness + 10}%)`);
            gradient.addColorStop(0.7, `hsl(${fragment.color.hue}, ${fragment.color.saturation}%, ${fragment.color.lightness}%)`);
            gradient.addColorStop(1, `hsl(${fragment.color.hue}, ${fragment.color.saturation - 20}%, ${fragment.color.lightness - 30}%)`);
            
            // Círculo principal del fragmento
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Borde brillante más pronunciado
            ctx.strokeStyle = `hsl(${fragment.color.hue}, 100%, ${Math.min(95, fragment.color.lightness + 40)})`;
            ctx.lineWidth = Math.max(0.5, radius * 0.1);
            ctx.beginPath();
            ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
            ctx.stroke();
            
            // Círculo interior para más detalle
            if (radius > 4) {
                const innerRadius = radius * 0.6;
                ctx.fillStyle = `hsl(${fragment.color.hue}, ${fragment.color.saturation - 10}%, ${fragment.color.lightness + 5}%)`;
                ctx.beginPath();
                ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Brillo superior
            if (radius > 3) {
                const shineGradient = ctx.createLinearGradient(
                    -radius * 0.5, -radius * 0.8,
                    radius * 0.3, -radius * 0.2
                );
                shineGradient.addColorStop(0, `rgba(255, 255, 255, ${fragment.opacity * 0.8})`);
                shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = shineGradient;
                ctx.beginPath();
                ctx.arc(0, -radius * 0.3, radius * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Mini símbolo Pi (solo en fragmentos más grandes)
            if (fragment.size > 6) {
                const fontSize = fragment.size * 0.35;
                
                // Sombra del símbolo
                ctx.fillStyle = `rgba(0, 0, 0, ${fragment.opacity * 0.6})`;
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('π', 0.5, 0.5);
                
                // Símbolo principal
                ctx.fillStyle = `rgba(0, 0, 0, ${fragment.opacity * 0.9})`;
                ctx.fillText('π', 0, 0);
            }
            
            ctx.restore();
        }
    }
    
    hasActiveFragments() {
        return this.fragments.length > 0;
    }
    
    clear() {
        this.fragments = [];
    }
}