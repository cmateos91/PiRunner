# 🚀 Pi Network Mainnet Configuration Checklist

## ✅ **Pasos Completados en el Código**

- [x] Pi SDK configurado para detectar mainnet automáticamente
- [x] Variables de entorno para mainnet/testnet configuradas
- [x] Meta tags OpenGraph para Pi Browser
- [x] Validación de API Key en backend
- [x] Headers CSP para Pi Network domains

## 📋 **Tareas CRÍTICAS para Pi Developer Portal**

### **1. Registro de App en Pi Developer Portal**
- [ ] Abrir `develop.pi` en Pi Browser
- [ ] Crear nueva app con **App Network: Pi Mainnet**
- [ ] Configurar App Name: "Pi Runner"
- [ ] Configurar App Categories: "Games, Entertainment"

### **2. Configuración de Hosting**
- [ ] Registrar dominio principal de producción
- [ ] Configurar **Production URL**: `https://tu-dominio-final.com`
- [ ] Verificar dominio ownership (DNS verification)
- [ ] Configurar **Development URL** para testing

### **3. App Wallet Configuration**
- [ ] Crear **App Wallet** específico para mainnet
- [ ] Actualizar `PI_WALLET_ADDRESS` en variables de entorno
- [ ] Verificar que wallet tiene fondos suficientes para pruebas
- [ ] Configurar wallet como recipient en Developer Portal

### **4. API Keys & Permissions**
- [ ] Generar **Server API Key** para mainnet
- [ ] Actualizar `PI_API_KEY` en variables de entorno de Vercel
- [ ] Configurar scopes: `username`, `payments`
- [ ] Verificar permisos de pagos activados

### **5. Domain Verification**
```bash
# En tu dominio personalizado, agregar DNS record:
TXT _pi-verification YOUR_VERIFICATION_TOKEN_FROM_PORTAL
```

### **6. Environment Variables en Vercel**
```env
PI_API_KEY=YOUR_MAINNET_API_KEY
PI_WALLET_ADDRESS=YOUR_MAINNET_WALLET
PI_NETWORK_MODE=mainnet
NODE_ENV=production
```

### **7. Deployment Commands**
```bash
# Deploy usando configuración mainnet
cp vercel.mainnet.json vercel.json
vercel --prod --env PI_NETWORK_MODE=mainnet

# Verificar deployment
curl https://tu-app.vercel.app/api/payments
```

### **8. Testing en Pi Browser**
- [ ] Abrir app en Pi Browser
- [ ] Verificar que NO aparece banner "Testnet"
- [ ] Probar autenticación
- [ ] Probar crear payment (0.01 Pi)
- [ ] Verificar payment approval/completion
- [ ] Verificar leaderboard storage

## ⚠️ **IMPORTANTES**

### **Diferencias Mainnet vs Testnet:**

| Aspecto | Testnet | Mainnet |
|---------|---------|---------|
| SDK sandbox | `true` | `false` |
| API Key | Testnet key | Mainnet key |
| Wallet | Test wallet | Real wallet |
| Payments | Test Pi | Real Pi |
| Domain | .vercel.app OK | Custom domain required |

### **Validation Scripts:**

```javascript
// Verificar configuración en browser console
console.log('Pi SDK Mode:', window.Pi._config?.sandbox ? 'Testnet' : 'Mainnet');
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', window.location.hostname);
```

### **Error Common:**
- ❌ `sandbox: false` con testnet API key = FAIL
- ❌ Mainnet app con vercel.app domain = FAIL  
- ❌ No configurar App Wallet = PAYMENTS FAIL
- ✅ Mainnet app + custom domain + mainnet API = SUCCESS

## 🎯 **Next Steps:**

1. **Configurar dominio personalizado en Vercel**
2. **Registrar app en Pi Developer Portal con mainnet**
3. **Actualizar variables de entorno**
4. **Deploy y verificar**

---

💡 **Tip**: Mantén versión testnet separada para desarrollo usando branch diferente.
