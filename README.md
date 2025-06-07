# 🪙 Pi Runner

Un juego de runner infinito inspirado en el clásico dinosaurio de Chrome, pero protagonizado por una moneda Pi dorada. Desarrollado con tecnologías web modernas, optimizado para dispositivos móviles y diseñado con la paleta de colores inspirada en Pi Network.

## 🎮 Características

- **Protagonista único**: Moneda Pi dorada con efectos visuales sofisticados
- **Enemigos matemáticos**: Símbolos matemáticos como Σ, ∫, Δ, ∞, α, β, γ, θ que actúan como obstáculos
- **Física realista**: Sistema de salto, gravedad y colisiones precisas
- **Efectos espectaculares**: Explosión de fragmentos al chocar, partículas y animaciones
- **Responsive**: Optimizado para escritorio y móviles
- **Dificultad progresiva**: Velocidad, frecuencia y tipos de enemigos que aumentan gradualmente
- **Sistema de recolección**: Monedas Pi para puntuar
- **Arquitectura modular**: Código organizado y escalable
- **Diseño cohesivo**: Paleta de colores inspirada en Pi Network para integración visual
- **Temática matemática**: Guerra entre π y otros símbolos matemáticos
- **Estética moderna**: Gradientes, sombras y efectos visuales profesionales

## 🚀 Demo

[Ver demo en vivo](tu-url-de-github-pages)

## 📱 Capturas de pantalla

![Gameplay](screenshots/gameplay.png)
![Explosión](screenshots/explosion.png)
![Móvil](screenshots/mobile.png)

## 🧮 Enemigos matemáticos

El juego presenta una guerra épica entre **π (Pi)** y otros símbolos matemáticos que actúan como enemigos:

### 🔴 Enemigos básicos (0-10 segundos)
- **Σ (Sigma)** - Sumatoria: Enemigo rojo que representa la acumulación
- **∫ (Integral)** - Integral: Enemigo púrpura que simboliza el cálculo
- **Δ (Delta)** - Delta: Enemigo verde que representa el cambio

### 🟠 Enemigos intermedios (10-30 segundos)
- **∞ (Infinito)** - Infinito: Enemigo naranja con distorsión especial
- **α (Alpha)** - Alpha: Enemigo púrpura, el primer rival
- **β (Beta)** - Beta: Enemigo gris oscuro, segundo en la jerarquía

### 🟣 Enemigos avanzados (30+ segundos)
- **γ (Gamma)** - Gamma: Enemigo marrón con efectos complejos
- **θ (Theta)** - Theta: Enemigo rojo oscuro, el más desafiante

### 🎭 Características de los enemigos
- **Efectos visuales únicos**: Cada enemigo tiene su color y animación
- **Auras malévolas**: Campos de energía que rodean a los símbolos
- **Pulsaciones amenazantes**: Respiración y movimiento orgánico
- **Partículas hostiles**: Efectos de partículas que orbitan alrededor
- **Progresión narrativa**: Los enemigos aparecen gradualmente según la dificultad

## 🎯 Cómo jugar

- **Escritorio**: Presiona `ESPACIO` o `FLECHA ARRIBA` para saltar
- **Móvil**: Toca la pantalla para saltar
- **Objetivo**: Evita los símbolos matemáticos enemigos y recolecta monedas Pi
- **Supervivencia**: Los enemigos se vuelven más frecuentes y variados con el tiempo
- **Puntuación**: Sobrevive el mayor tiempo posible en la guerra matemática

## 🛠️ Tecnologías utilizadas

- **HTML5 Canvas** para renderizado
- **JavaScript ES6+** con arquitectura modular
- **CSS3** con animaciones y efectos
- **Responsive Design** para múltiples dispositivos

## 📁 Estructura del proyecto

```
PiRunner/
├── index.html              # Archivo principal
├── css/                    # Estilos CSS modulares
│   ├── variables.css       # Variables y utilidades
│   ├── base.css           # Estilos base
│   ├── game-container.css # Contenedor del juego
│   ├── ui.css             # Interfaz de usuario
│   ├── modal.css          # Modal de game over
│   ├── animations.css     # Animaciones generales
│   ├── effects.css        # Efectos especiales
│   ├── explosion-effects.css # Efectos de explosión
│   └── math-enemies.css   # Estilos para enemigos matemáticos
├── js/                     # Módulos JavaScript
│   ├── Game.js            # Clase principal del juego
│   ├── Player.js          # Lógica del jugador (moneda π)
│   ├── ObstacleManager.js # Gestión de enemigos matemáticos
│   ├── CoinManager.js     # Gestión de monedas Pi
│   ├── Renderer.js        # Sistema de renderizado
│   ├── InputHandler.js    # Manejo de controles
│   ├── CollisionManager.js # Detección de colisiones
│   ├── GameUI.js          # Interfaz de usuario
│   ├── ParticleSystem.js  # Sistema de partículas
│   ├── CoinFragmentSystem.js # Sistema de fragmentos
│   └── MathEnemyEffects.js # Efectos especiales de enemigos
└── README.md              # Este archivo
```

## 🚀 Instalación y uso

### Opción 1: Descarga directa
1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador
3. ¡A jugar!

### Opción 2: Servidor local
```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/pi-runner.git
cd pi-runner

# Sirve con cualquier servidor HTTP estático
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (con live-server)
npx live-server

# Abre http://localhost:8000 en tu navegador
```

## 🎨 Características técnicas

### Sistema de enemigos matemáticos
Los obstáculos ahora son símbolos matemáticos con:
- **8 tipos diferentes** de enemigos con progresión temporal
- **Efectos visuales únicos** para cada símbolo
- **Auras malévolas** y campos de energía
- **Animaciones orgánicas** con pulsación y respiración
- **Colores temáticos** específicos por enemigo
- **Spawn múltiple** ocasional para mayor desafío
### Sistema de fragmentación
Al chocar con un enemigo matemático, la moneda se descompone en 25-40 mini monedas con:
- **Física realista**: Gravedad, rebotes múltiples y fricción
- **Dispersión natural**: Ángulos y velocidades aleatorias
- **Persistencia visual**: Los fragmentos permanecen en el suelo
- **Gradientes únicos**: Cada fragmento tiene su propia coloración

### Optimizaciones móviles
- **Canvas responsivo** con soporte para alta densidad de píxeles
- **Controles táctiles** optimizados
- **Prevención de zoom** y comportamientos no deseados
- **Elementos escalados** según el dispositivo
- **Performance ajustada** para dispositivos móviles

### Arquitectura modular
- **Separación de responsabilidades**: Cada clase tiene una función específica
- **Fácil mantenimiento**: Código organizado y documentado
- **Escalabilidad**: Preparado para futuras características
- **Reutilización**: Componentes independientes

## 🔮 Roadmap

- [ ] **Integración con Pi Network blockchain**
- [ ] **Sistema de logros y recompensas**
- [ ] **Múltiples personajes y skins**
- [ ] **Diferentes biomas y escenarios**
- [ ] **Tabla de puntuaciones global**
- [ ] **Modo multijugador**
- [ ] **Power-ups y habilidades especiales**

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Inspirado en el juego del dinosaurio de Chrome
- Iconografía basada en el símbolo Pi (π)
- Desarrollado con amor para la comunidad Pi Network

## 📧 Contacto

Tu Nombre - [@tu_usuario](https://twitter.com/tu_usuario) - tu@email.com

Link del Proyecto: [https://github.com/tu-usuario/pi-runner](https://github.com/tu-usuario/pi-runner)

---

⭐ **¡Dale una estrella al proyecto si te gustó!** ⭐