# 📱 Área de Anuncios - Pi Runner

## 🎯 **Características Implementadas:**

### **📍 Posicionamiento Estratégico:**
- **Ubicación**: Parte inferior de la pantalla
- **Espacio reservado**: 50-80px de altura según dispositivo
- **Diseño**: No invasivo, complementa la experiencia de juego

### **🎮 Integración Inteligente:**
- ✅ **Auto-ajuste**: El juego se redimensiona automáticamente
- ✅ **Pi Browser Ready**: Preparado para Pi Network Ads
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Opcional**: Puede ocultarse/mostrarse dinámicamente

## 🔧 **Implementación Técnica:**

### **CSS Classes Disponibles:**
```css
#adSpace              /* Contenedor principal */
.ad-content          /* Área del contenido del anuncio */
.banner-ad           /* Anuncios banner responsivos */
.pi-ad               /* Estilos específicos Pi Network */
.ad-placeholder      /* Placeholder cuando no hay ads */
```

### **Estados del Sistema:**
- `loading` - Cargando anuncio
- `success` - Anuncio cargado exitosamente  
- `error` - Error al cargar
- `hidden` - Área oculta

## 🎨 **Diseño Responsivo:**

### **Móvil (≤480px):**
- Altura: 50px
- Banner: 320x50px (estándar móvil)

### **Tablet (481-767px):**
- Altura: 60px
- Banner: 468x60px

### **Desktop (≥768px):**
- Altura: 80px
- Banner: 728x90px (leaderboard)

## 🥧 **Integración Pi Network Ads:**

### **Detección Automática:**
```javascript
// Detecta Pi Browser automáticamente
if (window.IS_PI_BROWSER && Pi.Ads) {
    adManager.setupPiNetworkAds();
}
```

### **Preparado para Banner Ads:**
```javascript
// Cuando Pi Network implemente banner ads
const adResponse = await Pi.Ads.showAd('banner');
```

### **Verificación de Compatibilidad:**
```javascript
const features = await Pi.nativeFeaturesList();
const adsSupported = features.includes('ad_network');
```

## 🎮 **Experiencia de Usuario:**

### **Impacto Mínimo:**
- ✅ No interrumpe el gameplay
- ✅ Se integra visualmente con el diseño
- ✅ Transiciones suaves
- ✅ Carga asíncrona

### **Controles para Testing:**
- **Toggle Button**: Ocultar/mostrar área (esquina derecha)
- **Simulate Ads**: `simulateAds()` en consola
- **Debug Info**: `window.adSpaceManager` en consola

## 📊 **Métricas y Analytics Ready:**

### **Eventos Trackeable:**
- Ad space shown/hidden
- Ad load success/failure
- User interaction with ads
- Performance metrics

### **Preparado para:**
- Pi Network Ad Network metrics
- Revenue tracking
- A/B testing de posiciones
- Optimización de formatos

## 🔮 **Futuras Expansiones:**

### **Tipos de Anuncios Soportados:**
1. **Banner Ads** (implementado)
2. **Interstitial Ads** (entre niveles)
3. **Rewarded Ads** (Pi Coins extra)
4. **Native Ads** (integrados en UI)

### **Monetización Pi Network:**
- **Pi Payments**: Usuarios pagan para quitar ads
- **Pi Rewards**: Ver ads para ganar Pi Coins
- **Premium Mode**: Suscripción sin anuncios

## 🛠 **API de Control:**

### **Métodos Principales:**
```javascript
// Mostrar/ocultar
adSpaceManager.showAdSpace()
adSpaceManager.hideAdSpace()

// Cargar anuncio
adSpaceManager.displayBannerAd()

// Cambiar estado
adSpaceManager.setAdState('loading')

// Actualizar contenido
adSpaceManager.updateAdContent('<div>Ad HTML</div>')
```

### **Configuración:**
```javascript
// En pi-browser-config.js
window.PI_BROWSER_CONFIG.ads = {
    enabled: true,
    position: 'bottom',
    autoShow: false,
    respectMute: true
}
```

## 🎯 **Beneficios del Diseño:**

1. **Monetización Lista**: Espacio preparado para generar ingresos
2. **Experiencia Preservada**: No afecta negativamente al juego
3. **Pi Network Nativo**: Integración específica con su ecosistema
4. **Escalable**: Fácil agregar más formatos
5. **Configurable**: Admin puede controlar visibilidad

¡El juego ahora está preparado para monetización futura sin comprometer la experiencia actual! 🚀💰
