# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-07

### Added - Enemigos Matemáticos
- 🧮 **8 nuevos enemigos matemáticos** que reemplazan obstáculos genéricos:
  - Σ (Sigma) - Sumatoria con efectos rojos
  - ∫ (Integral) - Integral con efectos púrpuras  
  - Δ (Delta) - Delta con efectos verdes
  - ∞ (Infinito) - Infinito con distorsión especial
  - α (Alpha) - Alpha con efectos púrpuras
  - β (Beta) - Beta con efectos grises
  - γ (Gamma) - Gamma con efectos marrones
  - θ (Theta) - Theta con efectos rojos oscuros

### Enhanced
- 🎭 **Sistema de progresión de enemigos**: Aparición gradual según tiempo de juego
- ✨ **Efectos visuales únicos por enemigo**: Auras, pulsaciones y partículas específicas
- 🌟 **Múltiples sistemas de efectos**: 
  - Auras malévolas con gradientes radiales
  - Campos anti-Pi con partículas orbitales
  - Rastros de símbolos con desvanecimiento
- 🎨 **Paleta de colores temática**: Cada enemigo con su identidad visual
- 📐 **Spawn múltiple ocasional**: Hasta 2 enemigos simultáneos en niveles avanzados
- 🎪 **Animaciones orgánicas**: Respiración, pulsación y rotación suave

### Technical Features
- **MathEnemyEffects.js**: Nueva clase para efectos especiales de enemigos
- **math-enemies.css**: Estilos CSS específicos para enemigos matemáticos
- **Progresión temporal**: Sistema de desbloqueo de enemigos por frameCount
- **Utilidades de color**: Funciones para aclarar/oscurecer colores dinámicamente
- **Animaciones síncronas**: Efectos coordinados con el tiempo de juego

### Gameplay Changes
- 🐌 **Frecuencia reducida**: Menos spawning para apreciar mejor los nuevos efectos
- 🎯 **Mejor visibilidad**: Espaciado optimizado entre enemigos
- 🏃‍♂️ **Curva de dificultad ajustada**: Progresión más suave con enemigos complejos

## [1.0.0] - 2025-06-07

### Added
- 🎮 Juego base de runner infinito con moneda Pi como protagonista
- 🪙 Sistema de renderizado avanzado para la moneda con gradientes y efectos
- 💥 Sistema de fragmentación espectacular al chocar con obstáculos
- ✨ Sistema de partículas para efectos visuales (salto, recolección)
- 📱 Optimización completa para dispositivos móviles
- 🎯 Sistema de colisiones preciso
- 🏃‍♂️ Dificultad progresiva con velocidad y frecuencia incremental
- 🎨 Múltiples tipos de obstáculos (cactus, cactus alto, rocas)
- 💰 Sistema de recolección de monedas Pi con patrones complejos
- 🌤️ Fondo animado con nubes en movimiento
- 🎭 Animaciones CSS sofisticadas y efectos de transición
- 📐 Arquitectura modular con separación de responsabilidades
- 🎪 Estados del juego (playing, exploding, gameOver) para experiencia fluida
- 🎵 Efectos visuales sincronizados con la gameplay

### Technical Features
- **Modular Architecture**: 9 clases especializadas para diferentes aspectos del juego
- **Responsive Canvas**: Adaptación automática a diferentes tamaños de pantalla
- **High DPI Support**: Soporte para pantallas de alta densidad
- **Touch Optimization**: Controles táctiles optimizados con prevención de zoom
- **Physics Engine**: Sistema de física realista para fragmentos con gravedad y rebotes
- **Particle Systems**: Dos sistemas de partículas independientes
- **CSS Variables**: Sistema de variables CSS para fácil personalización
- **Mobile Performance**: Optimizaciones específicas para dispositivos móviles

### Game Mechanics
- **Progressive Difficulty**: Velocidad y spawn rate que aumentan gradualmente
- **Multiple Obstacle Types**: 3 tipos diferentes de obstáculos con gráficos únicos
- **Coin Patterns**: Patrones simples y complejos de monedas coleccionables
- **Explosion System**: 25-40 fragmentos con física realista al chocar
- **Multi-bounce Physics**: Fragmentos con múltiples rebotes y asentamiento
- **Visual Effects**: Partículas de salto, recolección y explosión

### Files Structure
```
css/                    # Estilos modulares
├── variables.css       # Variables CSS y utilidades
├── base.css           # Estilos base
├── game-container.css # Contenedor del juego
├── ui.css             # Interfaz de usuario
├── modal.css          # Modal de game over
├── animations.css     # Animaciones generales
├── effects.css        # Efectos especiales
└── explosion-effects.css # Efectos de explosión

js/                     # Módulos JavaScript
├── Game.js            # Controlador principal
├── Player.js          # Lógica del jugador
├── ObstacleManager.js # Gestión de obstáculos
├── CoinManager.js     # Gestión de monedas
├── Renderer.js        # Sistema de renderizado
├── InputHandler.js    # Manejo de controles
├── CollisionManager.js # Detección de colisiones
├── GameUI.js          # Interfaz de usuario
├── ParticleSystem.js  # Sistema de partículas
└── CoinFragmentSystem.js # Sistema de fragmentos
```

## [Unreleased]

### Planned
- 🔗 Integración con Pi Network blockchain
- 🏆 Sistema de logros y recompensas
- 🎵 Sonidos y música
- 🎨 Múltiples skins para la moneda
- 🌍 Diferentes biomas y escenarios
- 📊 Tabla de puntuaciones global
- 👥 Modo multijugador
- ⚡ Power-ups y habilidades especiales