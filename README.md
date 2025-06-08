# Pi Runner 🏃‍♂️

Un endless runner optimizado para Pi Network con integración completa de Pi SDK, sistema de pagos y leaderboards globales.

## 🎮 Características principales

### **Gameplay**
- **Endless runner** con mecánicas de salto dinámicas
- **Sistema de carga** de salto para diferentes alturas
- **Obstáculos matemáticos** con efectos visuales
- **Recolección de Pi Coins** con fragmentación
- **Efectos de partículas** avanzados
- **Audio optimizado** para móviles

### **Pi Network Integration**
- **Pi SDK 2.0** completamente integrado
- **Pagos en Pi** para guardar puntuaciones
- **Autenticación** de usuarios Pi Network
- **Mainnet ready** - configurado para producción
- **Gestión de pagos incompletos**

### **Funcionalidades sociales**
- **Leaderboard global** con filtros temporales
- **Ranking en tiempo real** (Hoy, Semana, Mes, Todo)
- **Sistema de mejores puntuaciones**
- **Perfiles de usuario** Pi Network

### **UX/UI**
- **Soporte multiidioma** (English, Español, Hindi)
- **Input pantalla completa** optimizado para móvil
- **Interfaz responsive** para todos los dispositivos
- **Optimizado para Pi Browser**
- **Controles de audio** integrados

## 🛠️ Tecnologías

- **Frontend**: Vanilla JavaScript, HTML5 Canvas, CSS3
- **Backend**: Node.js, Express, Vercel Functions
- **Base de datos**: Vercel Blob Storage
- **Pagos**: Pi Network SDK
- **Deploy**: Vercel

## 🚀 Setup Production

### **Variables de entorno requeridas**
```env
PI_API_KEY=your_mainnet_pi_api_key
PI_WALLET_ADDRESS=your_mainnet_stellar_wallet
PI_NETWORK_MODE=mainnet
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### **Deploy a mainnet**
```bash
vercel --prod
```

## 📱 Pi Network Configuration

### **Pi Developer Portal Setup**
1. Registrar app con **App Network: Pi Mainnet**
2. Configurar **Production URL**: `https://runnerpi.xyz`
3. Configurar **App Wallet** para mainnet
4. Generar **Server API Key** para mainnet
5. Verificar dominio ownership

### **App Config**
- **App Name**: Pi Runner
- **App Categories**: Games, Entertainment
- **Allowed Domains**: runnerpi.xyz

## 🎯 Estructura del proyecto

```
PiRunner/
├── index.html              # Página principal
├── css/                    # Estilos optimizados
├── js/                     # JavaScript core
│   ├── Game.js            # Motor del juego
│   ├── Player.js          # Lógica del jugador
│   ├── pi-network-integration.js # Pi Network SDK
│   └── ...
├── api/                    # Backend APIs
│   ├── payments.js        # Procesamiento de pagos Pi
│   ├── leaderboard.js     # Sistema de rankings
│   └── recover-payments.js # Recuperación de pagos
├── lib/                    # Utilidades backend
├── translations/           # Archivos de idiomas
├── sounds/                # Audio assets
└── schema/                # Validaciones
```

## 🎮 Cómo jugar

1. **Salto básico**: Toca cualquier parte de la pantalla
2. **Salto de carga**: Mantén presionado para saltar más alto
3. **Recolecta Pi Coins**: Toca las monedas para sumar puntos
4. **Evita obstáculos**: Esquiva las operaciones matemáticas
5. **Guarda tu puntuación**: Usa Pi Network para el leaderboard global

## 🌍 Idiomas soportados

- **English** (en) - Idioma por defecto
- **Español** (es) - Mercado hispanohablante  
- **Hindi** (hi) - Comunidad Pi Network India

## 📊 APIs disponibles

### **GET /api/leaderboard**
```javascript
// Obtener rankings
?type=allTime|daily|weekly|monthly&limit=20
```

### **POST /api/payments**
```javascript
// Procesar pagos Pi Network
{
  "action": "approve|complete|cancel",
  "paymentId": "payment_id",
  "txid": "transaction_id" // solo para complete
}
```

### **POST /api/recover-payments**
```javascript
// Recuperar pagos incompletos
{
  "userUid": "user_uid"
}
```

## 🛡️ Seguridad

- **Validación** de pagos en backend
- **Rate limiting** en APIs
- **Input sanitization** completa
- **CORS** configurado correctamente
- **Environment variables** para secretos

## 🎯 Performance

### **Optimizaciones implementadas**
- **Canvas rendering** optimizado para 60fps
- **Audio lazy loading** para móviles
- **Particle system** eficiente
- **Event delegation** para mejor performance
- **Bundle optimizado** sin dependencias innecesarias

### **Métricas objetivo**
- **FPS**: 60fps en dispositivos modernos
- **Load time**: <2s primera carga
- **Memory usage**: <50MB en Pi Browser
- **Battery impact**: Minimizado

## 🏆 Features Pi Network

### **Pagos integrados**
- **User-to-App payments** para guardar scores
- **Server-side approval** y completion
- **Gestión de errores** y pagos incompletos
- **Leaderboard verificado** con blockchain

### **Autenticación**
- **Pi Network login** nativo
- **Username display** en leaderboards
- **Scopes**: username, payments
- **Token validation** en backend

## 📈 Analytics Ready

- **Payment success** tracking
- **User behavior** analytics ready
- **Performance monitoring** integrado
- **Error tracking** en producción

## 🌐 Deployment

### **Production URL**
- **Mainnet**: https://runnerpi.xyz
- **Pi Network**: Registrado en Developer Portal
- **SSL**: Configurado automáticamente
- **CDN**: Vercel Edge Network

### **Environment**
- **Node.js**: 18+ 
- **Vercel**: Serverless functions
- **Pi SDK**: v2.0
- **Blob Storage**: Persistent leaderboards

## 📄 Licencia

[Ver LICENSE file]

## 🎊 Créditos

Desarrollado para la comunidad Pi Network con ❤️

Optimizado para **Pi Browser** y **Pi Mainnet** - ¡Listo para jugar y ganar Pi! 🥧

---

**🚀 MAINNET READY - Pi Network Production Game 🚀**

**Sitio**: https://runnerpi.xyz  
**Pi Network**: Mainnet App  
**Soporte**: [GitHub Issues]
