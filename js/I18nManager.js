// Sistema de internacionalización para Pi Runner
class I18nManager {
    constructor() {
        this.currentLanguage = 'en'; // Idioma por defecto
        this.translations = {};
        this.supportedLanguages = ['en', 'es', 'hi']; // Inglés, Español, Hindi
        
        this.init();
    }
    
    async init() {
        try {
            // Detectar idioma del usuario
            this.currentLanguage = this.detectUserLanguage();
            
            // Cargar traducciones
            await this.loadTranslations();
            
            // Aplicar traducciones a la página
            this.applyTranslations();
            
            console.log(`🌍 I18n initialized: ${this.currentLanguage}`);
        } catch (error) {
            console.error('❌ Error initializing i18n:', error);
            // Fallback al inglés
            this.currentLanguage = 'en';
            await this.loadTranslations();
            this.applyTranslations();
        }
    }
    
    detectUserLanguage() {
        // 1. Verificar localStorage (preferencia del usuario)
        const savedLang = localStorage.getItem('pirunner_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            return savedLang;
        }
        
        // 2. Detectar desde navegador
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase().split('-')[0];
        
        // 3. Mapear códigos especiales
        const langMap = {
            'hi': 'hi',     // Hindi
            'en': 'en',     // English
            'es': 'es',     // Spanish
            'in': 'hi',     // Indonesia -> Hindi (Pi Network tiene muchos usuarios de India)
        };
        
        const detectedLang = langMap[langCode] || 'en';
        
        console.log(`🌍 Detected language: ${browserLang} -> ${detectedLang}`);
        return this.supportedLanguages.includes(detectedLang) ? detectedLang : 'en';
    }
    
    async loadTranslations() {
        try {
            // Cargar archivo de traducciones del idioma actual
            const response = await fetch(`/translations/${this.currentLanguage}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${this.currentLanguage}.json`);
            }
            
            this.translations = await response.json();
            console.log(`📝 Translations loaded for: ${this.currentLanguage}`);
            
        } catch (error) {
            console.warn(`⚠️ Failed to load translations for ${this.currentLanguage}, using fallback`);
            
            // Fallback: usar traducciones embebidas
            this.translations = this.getFallbackTranslations(this.currentLanguage);
        }
    }
    
    getFallbackTranslations(lang) {
        const fallbackTranslations = {
            en: {
                // Game UI
                "game.points": "Points",
                "game.coins": "Pi Coins",
                "game.gameOver": "Game Over!",
                "game.score": "Score",
                "game.restart": "Restart",
                "game.leaderboard": "📊 Leaderboard",
                "game.saveScore": "💾 Save Score",
                
                // Leaderboard
                "leaderboard.title": "🏆 Leaderboard",
                "leaderboard.all": "All Time",
                "leaderboard.today": "Today",
                "leaderboard.week": "Week",
                "leaderboard.month": "Month",
                "leaderboard.empty": "📭 No scores yet",
                "leaderboard.beFirst": "Be the first to save your score!",
                "leaderboard.loading": "Loading...",
                "leaderboard.error": "❌ Error loading leaderboard",
                "leaderboard.tryAgain": "Try again later",
                
                // Payments
                "payment.processing": "Processing payment...",
                "payment.finalizing": "Finalizing payment...",
                "payment.cancelled": "Payment cancelled. Score not saved.",
                "payment.error": "Error processing payment. Try again.",
                "payment.success": "🎉 New record saved successfully!",
                "payment.noImprovement": "💪 Score not improved. Try to beat your record!",
                "payment.authenticate": "🔐 Authenticating with Pi Network...",
                "payment.authError": "❌ Authentication error",
                "payment.initiating": "💰 Initiating payment to save score...",
                
                // Audio
                "audio.mute": "Mute",
                "audio.unmute": "Unmute",
                
                // Ads
                "ads.space": "📱 Ad space reserved • Pi Network Ads Ready",
                
                // General
                "general.loading": "Loading...",
                "general.error": "Error",
                "general.success": "Success",
                "general.cancel": "Cancel",
                "general.close": "Close",
                "general.ok": "OK"
            },
            
            es: {
                // Game UI
                "game.points": "Puntos",
                "game.coins": "Pi Coins",
                "game.gameOver": "¡Juego Terminado!",
                "game.score": "Puntuación",
                "game.restart": "Reiniciar",
                "game.leaderboard": "📊 Clasificación",
                "game.saveScore": "💾 Guardar",
                
                // Leaderboard
                "leaderboard.title": "🏆 Clasificación",
                "leaderboard.all": "Todo",
                "leaderboard.today": "Hoy",
                "leaderboard.week": "Semana",
                "leaderboard.month": "Mes",
                "leaderboard.empty": "📭 No hay puntuaciones aún",
                "leaderboard.beFirst": "¡Sé el primero en guardar tu score!",
                "leaderboard.loading": "Cargando...",
                "leaderboard.error": "❌ Error cargando clasificación",
                "leaderboard.tryAgain": "Inténtalo de nuevo más tarde",
                
                // Payments
                "payment.processing": "Procesando pago...",
                "payment.finalizing": "Finalizando pago...",
                "payment.cancelled": "Pago cancelado. Puntuación no guardada.",
                "payment.error": "Error al procesar el pago. Inténtalo de nuevo.",
                "payment.success": "¡Nuevo récord guardado exitosamente! 🎉",
                "payment.noImprovement": "Puntuación no mejorada. ¡Intenta superar tu récord! 💪",
                "payment.authenticate": "🔐 Autenticando con Pi Network...",
                "payment.authError": "❌ Error de autenticación",
                "payment.initiating": "💰 Iniciando pago para guardar puntuación...",
                
                // Audio
                "audio.mute": "Silenciar",
                "audio.unmute": "Activar sonido",
                
                // Ads
                "ads.space": "📱 Espacio reservado para anuncios • Pi Network Ads Ready",
                
                // General
                "general.loading": "Cargando...",
                "general.error": "Error",
                "general.success": "Éxito",
                "general.cancel": "Cancelar",
                "general.close": "Cerrar",
                "general.ok": "OK"
            },
            
            hi: {
                // Game UI
                "game.points": "अंक",
                "game.coins": "Pi कॉइन्स",
                "game.gameOver": "खेल समाप्त!",
                "game.score": "स्कोर",
                "game.restart": "फिर से शुरू करें",
                "game.leaderboard": "📊 लीडरबोर्ड",
                "game.saveScore": "💾 स्कोर सेव करें",
                
                // Leaderboard
                "leaderboard.title": "🏆 लीडरबोर्ड",
                "leaderboard.all": "सभी समय",
                "leaderboard.today": "आज",
                "leaderboard.week": "सप्ताह",
                "leaderboard.month": "महीना",
                "leaderboard.empty": "📭 अभी तक कोई स्कोर नहीं",
                "leaderboard.beFirst": "अपना स्कोर सेव करने वाले पहले बनें!",
                "leaderboard.loading": "लोड हो रहा है...",
                "leaderboard.error": "❌ लीडरबोर्ड लोड करने में त्रुटि",
                "leaderboard.tryAgain": "बाद में फिर कोशिश करें",
                
                // Payments
                "payment.processing": "भुगतान प्रोसेस हो रहा है...",
                "payment.finalizing": "भुगतान को अंतिम रूप दे रहे हैं...",
                "payment.cancelled": "भुगतान रद्द। स्कोर सेव नहीं हुआ।",
                "payment.error": "भुगतान में त्रुटि। फिर कोशिश करें।",
                "payment.success": "🎉 नया रिकॉर्ड सफलतापूर्वक सेव हुआ!",
                "payment.noImprovement": "💪 स्कोर में सुधार नहीं। अपना रिकॉर्ड तोड़ने की कोशिश करें!",
                "payment.authenticate": "🔐 Pi Network के साथ प्रमाणीकरण...",
                "payment.authError": "❌ प्रमाणीकरण त्रुटि",
                "payment.initiating": "💰 स्कोर सेव करने के लिए भुगतान शुरू कर रहे हैं...",
                
                // Audio
                "audio.mute": "म्यूट करें",
                "audio.unmute": "आवाज़ चालू करें",
                
                // Ads
                "ads.space": "📱 विज्ञापन स्थान आरक्षित • Pi Network Ads तैयार",
                
                // General
                "general.loading": "लोड हो रहा है...",
                "general.error": "त्रुटि",
                "general.success": "सफलता",
                "general.cancel": "रद्द करें",
                "general.close": "बंद करें",
                "general.ok": "ठीक है"
            }
        };
        
        return fallbackTranslations[lang] || fallbackTranslations.en;
    }
    
    t(key, fallback = key) {
        // Obtener traducción por clave
        const translation = this.translations[key];
        return translation || fallback;
    }
    
    applyTranslations() {
        // Aplicar traducciones a elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Aplicar traducciones a elementos con data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            element.title = translation;
        });
        
        console.log(`🌍 Translations applied for: ${this.currentLanguage}`);
    }
    
    async setLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            console.warn(`⚠️ Language ${langCode} not supported`);
            return;
        }
        
        this.currentLanguage = langCode;
        localStorage.setItem('pirunner_language', langCode);
        
        await this.loadTranslations();
        this.applyTranslations();
        
        // Actualizar elementos dinámicos específicos
        this.updateDynamicElements();
        
        // Trigger custom event para que otros componentes se actualicen
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: langCode }
        }));
        
        console.log(`🌍 Language changed to: ${langCode}`);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
    
    // Método para obtener traducciones para JavaScript
    getTranslation(key, fallback = key) {
        return this.t(key, fallback);
    }
    
    // Método para formatear con variables
    format(key, variables = {}) {
        let translation = this.t(key);
        
        Object.keys(variables).forEach(variable => {
            translation = translation.replace(`{${variable}}`, variables[variable]);
        });
        
        return translation;
    }
    
    // Actualizar elementos dinámicos que no usan data-i18n
    updateDynamicElements() {
        // Actualizar botón de audio
        if (window.updateAudioControls && window.game && window.game.audioManager) {
            const isMuted = window.game.audioManager.isMuted();
            window.updateAudioControls(isMuted);
        }
        
        // Si hay un leaderboard abierto, actualizar sus textos
        const leaderboardModal = document.getElementById('leaderboardModal');
        if (leaderboardModal && leaderboardModal.style.display !== 'none') {
            this.updateLeaderboardTexts();
        }
    }
    
    updateLeaderboardTexts() {
        // Actualizar título del leaderboard
        const title = document.querySelector('.leaderboard-title');
        if (title) title.textContent = this.t('leaderboard.title');
        
        // Actualizar pestañas
        const tabs = document.querySelectorAll('.leaderboard-tab');
        if (tabs.length >= 4) {
            tabs[0].textContent = this.t('leaderboard.all');
            tabs[1].textContent = this.t('leaderboard.today');
            tabs[2].textContent = this.t('leaderboard.week');
            tabs[3].textContent = this.t('leaderboard.month');
        }
        
        // Si hay contenido vacío, actualizarlo
        const emptyContent = document.querySelector('.leaderboard-empty');
        if (emptyContent) {
            const paragraphs = emptyContent.querySelectorAll('p');
            if (paragraphs.length >= 2) {
                paragraphs[0].textContent = this.t('leaderboard.empty');
                paragraphs[1].textContent = this.t('leaderboard.beFirst');
            }
        }
    }
}

// Crear instancia global
window.i18n = new I18nManager();

console.log('🌍 I18n Manager loaded');
