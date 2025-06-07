# Sonidos disponibles en Pi Runner

Esta carpeta contiene los archivos de audio del juego.

## 🎵 Archivos incluidos:

### ✅ coin_collect.wav
- **Tipo**: Sonido de recolección de moneda Pi
- **Uso**: Se reproduce al recolectar monedas doradas
- **Estado**: Integrado y funcional

### ✅ explosion.wav
- **Tipo**: Sonido de explosión al chocar
- **Uso**: Se reproduce cuando la moneda Pi choca con enemigos matemáticos
- **Estado**: Integrado y funcional

### ✅ background_music.mp3
- **Tipo**: Música de fondo
- **Uso**: Loop continuo durante el juego
- **Estado**: Integrado y funcional
- **Control**: Se puede silenciar con el botón 🔊/🔇

## 🎛️ Controles de audio:

- **Botón mute**: Ubicado en la esquina superior derecha de la UI
- **Volumen automático**: Ajustado para no interferir con el gameplay
- **Autoplay**: Se activa después de la primera interacción del usuario

## 📋 Archivos potenciales para agregar:

### jump.wav (opcional)
- **Tipo**: Sonido de salto normal
- **Características**: Sonido limpio, corto (0.2-0.5s)

### super_jump.wav (opcional)
- **Tipo**: Sonido de supersalto
- **Características**: Más grave y potente que el salto normal

## 🔧 Integración técnica:

Los sonidos se cargan automáticamente al inicio del juego. Si un archivo no existe, el juego continúa funcionando normalmente sin ese sonido específico.

El AudioManager maneja:
- Precarga de efectos críticos
- Gestión de volumen independiente
- Compatibilidad con políticas de autoplay
- Fallbacks silenciosos para archivos faltantes