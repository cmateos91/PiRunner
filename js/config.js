// Configuración del frontend usando variables de entorno
window.APP_CONFIG = {
    PI_WALLET: "GBYCQD35WCGKAECP3CLCFB7SAWF5L3AKWRKPPQONZK4BAEQQ37JMTN3V",
    IS_PRODUCTION: window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')
};

// Configurar wallet address globalmente
window.APP_WALLET = window.APP_CONFIG.PI_WALLET;
