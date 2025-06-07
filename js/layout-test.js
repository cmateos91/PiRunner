// Test del nuevo layout del selector de idioma
function testNewLanguageLayout() {
    console.log('🧪 Testing nuevo layout del selector de idioma...');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    // Test 1: Verificar que el selector está en el UI principal
    const languageSelector = document.getElementById('languageSelector');
    const ui = document.getElementById('ui');
    const isInUI = ui && ui.contains(languageSelector);
    const test1 = isInUI ? 'PASS' : 'FAIL';
    results.tests.push(`Selector en UI principal: ${test1}`);
    if (test1 === 'PASS') results.passed++; else results.failed++;
    
    // Test 2: Verificar estructura ui-controls
    const uiControls = document.querySelector('.ui-controls');
    const test2 = uiControls && uiControls.contains(languageSelector) ? 'PASS' : 'FAIL';
    results.tests.push(`Contenedor ui-controls: ${test2}`);
    if (test2 === 'PASS') results.passed++; else results.failed++;
    
    // Test 3: Verificar que los botones usan texto en lugar de banderas
    const languageButtons = document.querySelectorAll('.language-option');
    const hasTextLabels = Array.from(languageButtons).every(btn => {
        return btn.textContent.match(/^(EN|ES|HI)$/);
    });
    const test3 = hasTextLabels ? 'PASS' : 'FAIL';
    results.tests.push(`Botones con texto (EN/ES/HI): ${test3}`);
    if (test3 === 'PASS') results.passed++; else results.failed++;
    
    // Test 4: Verificar posicionamiento horizontal
    if (uiControls) {
        const computedStyle = window.getComputedStyle(uiControls);
        const isFlexRow = computedStyle.flexDirection === 'row' || computedStyle.flexDirection === '';
        const test4 = isFlexRow ? 'PASS' : 'FAIL';
        results.tests.push(`Layout horizontal: ${test4}`);
        if (test4 === 'PASS') results.passed++; else results.failed++;
    }
    
    // Test 5: Verificar que no hay conflictos de z-index
    const uiZIndex = window.getComputedStyle(ui).zIndex;
    const test5 = parseInt(uiZIndex) >= 1000 ? 'PASS' : 'FAIL';
    results.tests.push(`Z-index UI correcto: ${test5} (${uiZIndex})`);
    if (test5 === 'PASS') results.passed++; else results.failed++;
    
    // Test 6: Verificar funcionalidad de cambio de idioma
    if (typeof window.changeLanguage === 'function') {
        const test6 = 'PASS';
        results.tests.push(`Función changeLanguage disponible: ${test6}`);
        results.passed++;
    } else {
        results.tests.push(`Función changeLanguage disponible: FAIL`);
        results.failed++;
    }
    
    // Mostrar resultados
    console.log('🧪 Resultados del test de nuevo layout:');
    console.log(`✅ Pasados: ${results.passed}`);
    console.log(`❌ Fallidos: ${results.failed}`);
    console.log(`📊 Total: ${results.passed + results.failed}`);
    
    results.tests.forEach(test => {
        const icon = test.includes('PASS') ? '✅' : '❌';
        console.log(`${icon} ${test}`);
    });
    
    // Test visual adicional
    if (languageSelector) {
        console.log('📐 Información de posicionamiento:');
        const rect = languageSelector.getBoundingClientRect();
        console.log(`Position: ${rect.left.toFixed(0)}px, ${rect.top.toFixed(0)}px`);
        console.log(`Size: ${rect.width.toFixed(0)}px × ${rect.height.toFixed(0)}px`);
    }
    
    return results;
}

// Test responsivo
function testResponsiveLayout() {
    console.log('📱 Testing layout responsivo...');
    
    const ui = document.getElementById('ui');
    const languageSelector = document.getElementById('languageSelector');
    
    if (!ui || !languageSelector) {
        console.log('❌ Elementos UI no encontrados');
        return;
    }
    
    console.log('📐 Medidas actuales:');
    console.log(`Ancho ventana: ${window.innerWidth}px`);
    console.log(`Alto ventana: ${window.innerHeight}px`);
    
    const uiRect = ui.getBoundingClientRect();
    console.log(`UI: ${uiRect.width.toFixed(0)}px × ${uiRect.height.toFixed(0)}px`);
    
    const selectorRect = languageSelector.getBoundingClientRect();
    console.log(`Selector: ${selectorRect.width.toFixed(0)}px × ${selectorRect.height.toFixed(0)}px`);
    
    // Verificar si hay overflow
    const hasOverflow = uiRect.right > window.innerWidth;
    console.log(`Overflow horizontal: ${hasOverflow ? '❌ SÍ' : '✅ NO'}`);
}

// Exponer funciones para testing
window.testNewLanguageLayout = testNewLanguageLayout;
window.testResponsiveLayout = testResponsiveLayout;

console.log('🧪 Test de nuevo layout cargado');
console.log('💡 Usa testNewLanguageLayout() y testResponsiveLayout() para probar');
