# Contribuir a Pi Runner

¡Gracias por tu interés en contribuir a Pi Runner! Este documento proporciona pautas para contribuir al proyecto.

## 🚀 Cómo contribuir

### Reportar bugs
1. Verifica que el bug no haya sido reportado antes
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable
   - Información del dispositivo/navegador

### Sugerir mejoras
1. Abre un issue con el tag "enhancement"
2. Describe la funcionalidad propuesta
3. Explica por qué sería útil
4. Considera la implementación si es posible

### Contribuir código

#### Setup del proyecto
```bash
git clone https://github.com/tu-usuario/pi-runner.git
cd pi-runner
npm install  # Para herramientas de desarrollo (opcional)
```

#### Flujo de trabajo
1. Fork el proyecto
2. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios siguiendo las convenciones
4. Asegúrate de que el juego funciona correctamente
5. Commit con mensajes descriptivos:
   ```bash
   git commit -m "feat: agregar power-up de velocidad"
   ```
6. Push a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
7. Abre un Pull Request

## 📝 Convenciones de código

### JavaScript
- Usa `const` y `let`, evita `var`
- Nombres descriptivos para variables y funciones
- Comentarios para lógica compleja
- Mantén las funciones pequeñas y enfocadas

### CSS
- Usa variables CSS para valores reutilizables
- Organiza por componentes
- Prefiere flexbox/grid sobre floats
- Mobile-first responsive design

### Estructura de archivos
- Un archivo por clase/módulo
- Importaciones al inicio
- Exportaciones al final
- Mantén la estructura modular existente

## 🎯 Áreas de contribución

### Frontend
- Nuevos efectos visuales
- Mejoras de UI/UX
- Optimizaciones de performance
- Compatibilidad con navegadores

### Gameplay
- Nuevos tipos de obstáculos
- Power-ups y habilidades
- Modos de juego adicionales
- Sistema de puntuación

### Integración Pi Network
- Implementación del SDK
- Sistema de recompensas
- Autenticación de usuarios
- Transacciones blockchain

## 🧪 Testing

Antes de enviar tu PR, asegúrate de:
- [ ] El juego carga sin errores
- [ ] Los controles funcionan en escritorio y móvil
- [ ] No hay errores en la consola
- [ ] Las animaciones son fluidas
- [ ] El responsive design funciona correctamente

## 📋 Checklist para Pull Requests

- [ ] El código sigue las convenciones del proyecto
- [ ] Los cambios están bien documentados
- [ ] Se incluyen capturas de pantalla si hay cambios visuales
- [ ] El juego funciona correctamente
- [ ] Los commits tienen mensajes descriptivos
- [ ] Se actualizó la documentación si es necesario

## 💡 Ideas para contribuir

### Beginner-friendly
- Mejorar documentación
- Añadir comentarios al código
- Corregir typos
- Optimizar assets

### Intermediate
- Nuevos efectos de partículas
- Sonidos y música
- Más tipos de obstáculos
- Mejoras de performance

### Advanced
- Sistema de save/load
- Integración con Pi Network
- Multijugador
- Editor de niveles

## 🤝 Código de conducta

- Sé respetuoso con otros contributores
- Acepta críticas constructivas
- Ayuda a otros desarrolladores
- Mantén un ambiente positivo

## ❓ ¿Necesitas ayuda?

- Abre un issue con el tag "question"
- Revisa la documentación existente
- Consulta issues cerrados similares
- Contáctanos por email: tu@email.com

¡Gracias por contribuir a Pi Runner! 🪙✨