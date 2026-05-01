// Debug helper for i18n issues
window.debugI18n = {
  check: function() {
    console.clear();
    console.log('=== I18N DEBUG INFO ===');

    // Check translations object
    console.log('1. translations object loaded:', !!window.translations);
    if (window.translations) {
      console.log('   - Languages available:', Object.keys(window.translations));
      console.log('   - PT keys:', Object.keys(window.translations.pt || {}).length);
      console.log('   - EN keys:', Object.keys(window.translations.en || {}).length);
      console.log('   - ES keys:', Object.keys(window.translations.es || {}).length);
    }

    // Check i18n instance
    console.log('2. i18n instance:', !!window.i18n);
    if (window.i18n) {
      console.log('   - Current language:', window.i18n.currentLanguage);
      console.log('   - Stored language:', window.i18n.getStoredLanguage());
    }

    // Check language buttons
    const buttons = document.querySelectorAll('.lang-btn');
    console.log('3. Language buttons found:', buttons.length);
    buttons.forEach((btn, i) => {
      console.log(`   - Button ${i}: data-lang="${btn.dataset.lang}", active: ${btn.classList.contains('active')}`);
    });

    // Check translatable elements
    const i18nElements = document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder]');
    console.log('4. Translatable elements found:', i18nElements.length);

    // Check localStorage
    console.log('5. localStorage available:', this.isLocalStorageAvailable());

    console.log('=== END DEBUG ===');
  },

  isLocalStorageAvailable: function() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  changeLangDebug: function(lang) {
    console.log(`Attempting to change language to: ${lang}`);
    if (window.i18n) {
      window.i18n.changeLanguage(lang);
      this.check();
    } else {
      console.error('i18n instance not available');
    }
  }
};

// Run debug check when this script loads
console.log('[debug.js] Loaded - run window.debugI18n.check() to diagnose');
