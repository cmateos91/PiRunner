// Configuración del frontend usando variables de entorno
window.APP_CONFIG = {
    PI_WALLET: "GBYCQD35WCGKAECP3CLCFB7SAWF5L3AKWRKPPQONZK4BAEQQ37JMTN3V",
    // vercel.app es considerado TESTNET, no production
    IS_PRODUCTION: window.location.hostname === 'runnerpi.xyz' || window.location.hostname === 'www.runnerpi.xyz'
};

// Configurar wallet address globalmente
window.APP_WALLET = window.APP_CONFIG.PI_WALLET;
