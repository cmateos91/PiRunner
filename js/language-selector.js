// Language Selector Management
function changeLanguage(langCode) {
    if (window.i18n) {
        window.i18n.setLanguage(langCode);
        updateLanguageSelector(langCode);
    }
}

function updateLanguageSelector(langCode) {
    // Actualizar estado visual del selector
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === langCode) {
            btn.classList.add('active');
        }
    });
}

// Inicializar selector de idioma cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar cambios de idioma para actualizar el selector
    window.addEventListener('languageChanged', (event) => {
        updateLanguageSelector(event.detail.language);
    });
    
    // Configurar idioma inicial después de que i18n esté listo
    if (window.i18n) {
        updateLanguageSelector(window.i18n.getCurrentLanguage());
    } else {
        // Si i18n no está listo, esperar un poco
        setTimeout(() => {
            if (window.i18n) {
                updateLanguageSelector(window.i18n.getCurrentLanguage());
            }
        }, 100);
    }
});

console.log('🌍 Language selector initialized');
