# ✅ Pi Network Mainnet Verification Checklist

## 🌐 Domain Configuration
- [x] DNS Records configured (A + CNAME)
- [x] Vercel domain verification complete
- [x] SSL Certificate active
- [x] https://runnerpi.xyz accessible

## 🔧 Next Critical Steps

### 1. Pi Developer Portal Setup
- [ ] Create new app with "Pi Mainnet" network
- [ ] Production URL: https://runnerpi.xyz
- [ ] Generate mainnet Server API Key
- [ ] Configure mainnet App Wallet
- [ ] Verify domain ownership in portal

### 2. Update Environment Variables
```env
PI_API_KEY=YOUR_NEW_MAINNET_API_KEY
PI_WALLET_ADDRESS=YOUR_NEW_MAINNET_WALLET
PI_NETWORK_MODE=mainnet
NODE_ENV=production
```

### 3. Deploy & Test
```bash
vercel --prod
```

### 4. Pi Browser Testing
- [ ] Open https://runnerpi.xyz in Pi Browser
- [ ] Verify NO "Testnet" banner appears
- [ ] Test Pi Network authentication
- [ ] Test payment creation (0.01 Pi)
- [ ] Verify transaction completion
- [ ] Check leaderboard storage

## 🚨 Critical Differences: Testnet vs Mainnet

| Aspect | Testnet | Mainnet |
|--------|---------|---------|
| SDK sandbox | `true` | `false` |
| API Key | Test key | Production key |
| Wallet | Test wallet | Real production wallet |
| Payments | Test Pi (free) | Real Pi (costs money) |
| Domain | Can use .vercel.app | Must use custom domain |
| Pi Browser | Shows "Testnet" banner | No banner |

## 🎯 Success Indicators

### In Pi Browser Console:
```javascript
console.log('Pi SDK Mode:', window.Pi._config?.sandbox ? 'Testnet' : 'Mainnet');
// Should show: "Mainnet"
```

### In Network Tab:
```
API calls to: https://api.minepi.com/v2/
Headers: Authorization: Key YOUR_MAINNET_API_KEY
```

### Visual Indicators:
- ❌ NO yellow/black "Testnet" banner in Pi Browser
- ✅ Payment flows use real Pi amounts
- ✅ Transactions appear on Pi Blockchain explorer

---

🚀 **Ready for Pi Network Mainnet Production!**
