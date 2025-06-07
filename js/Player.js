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
        
        // Sistema de salto variable
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.minJumpForce = this.isMobile ? -11 : -13;
        this.maxJumpForce = this.isMobile ? -16 : -18;
        this.superJumpForce = this.isMobile ? -22 : -25; // Supersalto
        this.maxChargeTime = 400; // 400ms máximo de carga
        this.perfectWindow = 50; // 50ms de ventana para timing perfecto
        this.currentJumpForce = this.minJumpForce;
    }
    
    startJump() {
        if (!this.isJumping && !this.isCharging) {
            this.isCharging = true;
            this.chargeStartTime = Date.now();
            return true;
        }
        return false;
    }
    
    executeJump() {
        if (this.isCharging && !this.isJumping) {
            const chargeTime = Date.now() - this.chargeStartTime;
            const chargeRatio = Math.min(chargeTime / this.maxChargeTime, 1);
            
            // Verificar si está en la ventana de timing perfecto
            const isPerfectTiming = chargeTime >= this.maxChargeTime && 
                                  chargeTime <= this.maxChargeTime + this.perfectWindow;
            
            let jumpType = 'normal';
            
            if (isPerfectTiming) {
                // Supersalto por timing perfecto
                this.currentJumpForce = this.superJumpForce;
                jumpType = 'perfect';
            } else {
                // Interpolación normal entre fuerza mínima y máxima
                this.currentJumpForce = this.minJumpForce + (this.maxJumpForce - this.minJumpForce) * chargeRatio;
            }
            
            this.velocityY = this.currentJumpForce;
            this.isJumping = true;
            this.isCharging = false;
            
            return {
                jumpForce: this.currentJumpForce,
                chargeTime: chargeTime,
                chargeRatio: chargeRatio,
                jumpType: jumpType,
                isPerfect: isPerfectTiming
            };
        }
        return null;
    }
    
    cancelJump() {
        if (this.isCharging) {
            this.isCharging = false;
            return true;
        }
        return false;
    }
    
    // Método legacy para compatibilidad
    jump() {
        this.startJump();
        return this.executeJump();
    }
    
    getChargeStatus() {
        if (!this.isCharging) return null;
        
        const chargeTime = Date.now() - this.chargeStartTime;
        const chargeRatio = Math.min(chargeTime / this.maxChargeTime, 1);
        const isInPerfectWindow = chargeTime >= this.maxChargeTime && 
                                chargeTime <= this.maxChargeTime + this.perfectWindow;
        
        return {
            chargeTime: chargeTime,
            chargeRatio: chargeRatio,
            isMaxCharge: chargeRatio >= 1,
            isInPerfectWindow: isInPerfectWindow,
            perfectWindowProgress: isInPerfectWindow ? 
                (chargeTime - this.maxChargeTime) / this.perfectWindow : 0
        };
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
        
        // Actualizar fuerzas de salto según el dispositivo
        this.minJumpForce = this.isMobile ? -11 : -13;
        this.maxJumpForce = this.isMobile ? -16 : -18;
        this.superJumpForce = this.isMobile ? -22 : -25;
        
        if (!this.isJumping) {
            this.y = this.groundY;
        }
    }
    
    render(ctx) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        const radius = this.width/2;
        
        // Indicador de carga de salto
        if (this.isCharging) {
            this.renderChargeIndicator(ctx, centerX, centerY, radius);
        }
        
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
    
    renderChargeIndicator(ctx, centerX, centerY, radius) {
        const chargeStatus = this.getChargeStatus();
        if (!chargeStatus) return;
        
        const indicatorRadius = radius + 8;
        const chargeAngle = chargeStatus.chargeRatio * Math.PI * 2;
        
        // Anillo de carga base
        ctx.save();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Fondo del anillo
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, indicatorRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Progreso del anillo
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, indicatorRadius, -Math.PI / 2, -Math.PI / 2 + chargeAngle);
        ctx.stroke();
        
        // Zona de timing perfecto
        if (chargeStatus.isMaxCharge) {
            // Anillo de timing perfecto
            ctx.strokeStyle = chargeStatus.isInPerfectWindow ? '#00FFFF' : '#00FF88';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6;
            
            // Zona de timing perfecto (pequeña sección después del círculo completo)
            const perfectStartAngle = -Math.PI / 2;
            const perfectEndAngle = perfectStartAngle + (this.perfectWindow / this.maxChargeTime) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, indicatorRadius + 3, perfectStartAngle, perfectEndAngle);
            ctx.stroke();
            
            // Pulso intenso durante ventana perfecta
            if (chargeStatus.isInPerfectWindow) {
                const pulseIntensity = 0.7 + Math.sin(Date.now() * 0.05) * 0.3;
                ctx.globalAlpha = pulseIntensity;
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 6;
                ctx.shadowColor = '#00FFFF';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(centerX, centerY, indicatorRadius + 5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                // Efecto de rayos durante timing perfecto
                this.renderPerfectTimingRays(ctx, centerX, centerY, radius + 15);
            } else {
                // Pulso normal en máxima carga
                const pulseIntensity = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
                ctx.globalAlpha = pulseIntensity;
                ctx.strokeStyle = '#00FF88';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(centerX, centerY, indicatorRadius + 2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    renderPerfectTimingRays(ctx, centerX, centerY, radius) {
        const rayCount = 8;
        const time = Date.now() * 0.01;
        
        ctx.save();
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + time;
            const innerRadius = radius;
            const outerRadius = radius + 8 + Math.sin(time + i) * 3;
            
            const startX = centerX + Math.cos(angle) * innerRadius;
            const startY = centerY + Math.sin(angle) * innerRadius;
            const endX = centerX + Math.cos(angle) * outerRadius;
            const endY = centerY + Math.sin(angle) * outerRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        ctx.restore();
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
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.currentJumpForce = this.minJumpForce;
    }
}