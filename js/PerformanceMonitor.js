// Monitor de rendimiento simplificado para debugging
class PerformanceMonitor {
    constructor() {
        console.log('📊 PerformanceMonitor iniciado');
        
        try {
            this.frameCount = 0;
            this.fps = 60;
            this.lastTime = performance.now();
            this.fpsHistory = [];
            this.isLowPerformance = false;
            this.audioQuality = 'high';
            
            // No iniciar monitoreo automáticamente para debug
            console.log('📊 PerformanceMonitor creado exitosamente');
        } catch (error) {
            console.error('❌ Error en PerformanceMonitor:', error);
        }
    }
    
    startMonitoring() {
        try {
            console.log('📊 Iniciando monitoreo de rendimiento');
            
            // Monitorear FPS cada segundo
            setInterval(() => {
                this.updatePerformanceMetrics();
            }, 1000);
            
            // Verificar cada 5 segundos si necesitamos ajustar
            setInterval(() => {
                this.adjustPerformanceSettings();
            }, 5000);
        } catch (error) {
            console.error('❌ Error iniciando monitoreo:', error);
        }
    }
    
    update() {
        try {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = this.frameCount;
                this.fpsHistory.push(this.fps);
                
                // Mantener solo los últimos 10 segundos
                if (this.fpsHistory.length > 10) {
                    this.fpsHistory.shift();
                }
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
        } catch (error) {
            console.error('❌ Error actualizando performance monitor:', error);
        }
    }
    
    updatePerformanceMetrics() {
        try {
            if (this.fpsHistory.length === 0) return;
            
            const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
            const minFps = Math.min(...this.fpsHistory);
            
            // Determinar si estamos en modo bajo rendimiento
            const wasLowPerformance = this.isLowPerformance;
            this.isLowPerformance = avgFps < 45 || minFps < 30;
            
            // Si cambió el estado, notificar
            if (wasLowPerformance !== this.isLowPerformance) {
                this.onPerformanceChange();
            }
        } catch (error) {
            console.error('❌ Error actualizando métricas:', error);
        }
    }
    
    adjustPerformanceSettings() {
        try {
            const avgFps = this.getAverageFPS();
            
            if (avgFps < 30) {
                this.setAudioQuality('low');
            } else if (avgFps < 45) {
                this.setAudioQuality('medium');
            } else {
                this.setAudioQuality('high');
            }
        } catch (error) {
            console.error('❌ Error ajustando configuración:', error);
        }
    }
    
    setAudioQuality(quality) {
        try {
            if (this.audioQuality === quality) return;
            
            this.audioQuality = quality;
            console.log(`📊 Calidad de audio cambiada a: ${quality}`);
            
            // No intentar ajustar audio manager por ahora para debug
        } catch (error) {
            console.error('❌ Error estableciendo calidad de audio:', error);
        }
    }
    
    onPerformanceChange() {
        try {
            if (this.isLowPerformance) {
                console.log('⚠️ Rendimiento bajo detectado');
            } else {
                console.log('✅ Rendimiento mejorado');
            }
        } catch (error) {
            console.error('❌ Error en cambio de rendimiento:', error);
        }
    }
    
    getAverageFPS() {
        try {
            if (this.fpsHistory.length === 0) return 60;
            return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        } catch (error) {
            console.error('❌ Error calculando FPS promedio:', error);
            return 60;
        }
    }
    
    getCurrentFPS() {
        return this.fps;
    }
    
    getPerformanceStatus() {
        try {
            return {
                fps: this.getCurrentFPS(),
                avgFps: this.getAverageFPS(),
                audioQuality: this.audioQuality,
                isLowPerformance: this.isLowPerformance
            };
        } catch (error) {
            console.error('❌ Error obteniendo estado:', error);
            return { error: true };
        }
    }
}

// Crear la instancia pero no integrar automáticamente por ahora
if (typeof window !== 'undefined') {
    try {
        console.log('📊 Creando PerformanceMonitor global');
        window.performanceMonitor = new PerformanceMonitor();
        console.log('📊 PerformanceMonitor creado exitosamente');
    } catch (error) {
        console.error('❌ Error creando PerformanceMonitor global:', error);
    }
}

console.log('📊 PerformanceMonitor script cargado');
