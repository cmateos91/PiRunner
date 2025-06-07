// Test de traducción para verificar que todos los elementos funcionen correctamente
function testTranslationSystem() {
    console.log('🧪 Iniciando test del sistema de traducciones...');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    // Test 1: Verificar que i18n esté inicializado
    const test1 = window.i18n ? 'PASS' : 'FAIL';
    results.tests.push(`I18n inicializado: ${test1}`);
    if (test1 === 'PASS') results.passed++; else results.failed++;
    
    if (!window.i18n) {
        console.log('❌ Sistema de traducciones no inicializado');
        return results;
    }
    
    // Test 2: Verificar idiomas soportados
    const supportedLangs = window.i18n.getSupportedLanguages();
    const test2 = supportedLangs.length === 3 && 
                  supportedLangs.includes('en') && 
                  supportedLangs.includes('es') && 
                  supportedLangs.includes('hi') ? 'PASS' : 'FAIL';
    results.tests.push(`Idiomas soportados (3): ${test2} - ${supportedLangs.join(', ')}`);
    if (test2 === 'PASS') results.passed++; else results.failed++;
    
    // Test 3: Verificar traducciones básicas
    const testKeys = [
        'game.points',
        'game.gameOver', 
        'leaderboard.title',
        'payment.success',
        'audio.mute'
    ];
    
    testKeys.forEach(key => {
        const translation = window.i18n.t(key);
        const test = translation !== key ? 'PASS' : 'FAIL';
        results.tests.push(`Traducción '${key}': ${test} - "${translation}"`);
        if (test === 'PASS') results.passed++; else results.failed++;
    });
    
    // Test 4: Verificar elementos HTML con data-i18n
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    const test4 = elementsWithI18n.length > 0 ? 'PASS' : 'FAIL';
    results.tests.push(`Elementos con data-i18n encontrados: ${test4} - ${elementsWithI18n.length} elementos`);
    if (test4 === 'PASS') results.passed++; else results.failed++;
    
    // Test 5: Verificar selector de idioma
    const languageSelector = document.getElementById('languageSelector');
    const languageButtons = document.querySelectorAll('.language-option');
    const test5 = languageSelector && languageButtons.length === 3 ? 'PASS' : 'FAIL';
    results.tests.push(`Selector de idioma: ${test5} - ${languageButtons.length} botones`);
    if (test5 === 'PASS') results.passed++; else results.failed++;
    
    // Test 6: Verificar función changeLanguage
    const test6 = typeof window.changeLanguage === 'function' ? 'PASS' : 'FAIL';
    results.tests.push(`Función changeLanguage: ${test6}`);
    if (test6 === 'PASS') results.passed++; else results.failed++;
    
    // Mostrar resultados
    console.log('🧪 Resultados del test de traducciones:');
    console.log(`✅ Pasados: ${results.passed}`);
    console.log(`❌ Fallidos: ${results.failed}`);
    console.log(`📊 Total: ${results.passed + results.failed}`);
    
    results.tests.forEach(test => {
        const icon = test.includes('PASS') ? '✅' : '❌';
        console.log(`${icon} ${test}`);
    });
    
    return results;
}

// Test de cambio de idioma
async function testLanguageChange() {
    console.log('🔄 Probando cambio de idiomas...');
    
    const languages = ['en', 'es', 'hi'];
    
    for (const lang of languages) {
        console.log(`Cambiando a ${lang}...`);
        
        if (window.changeLanguage) {
            await window.changeLanguage(lang);
            
            // Esperar un poco para que se apliquen los cambios
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'unknown';
            console.log(`Idioma actual: ${currentLang}`);
            
            // Verificar una traducción de muestra
            if (window.i18n) {
                const sample = window.i18n.t('game.points');
                console.log(`Muestra de traducción 'game.points': "${sample}"`);
            }
        }
    }
    
    console.log('🔄 Test de cambio de idiomas completado');
}

// Exponer funciones para testing manual
window.testTranslationSystem = testTranslationSystem;
window.testLanguageChange = testLanguageChange;

console.log('🧪 Sistema de testing de traducciones cargado');
console.log('💡 Usa testTranslationSystem() y testLanguageChange() en la consola para probar');
