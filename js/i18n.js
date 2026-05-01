// Language management
class I18n {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'pt';
    this.init();
    console.log('[i18n] Initialized with language:', this.currentLanguage);
  }

  getStoredLanguage() {
    try {
      return localStorage.getItem('language');
    } catch (e) {
      console.warn('[i18n] localStorage not available:', e);
      return null;
    }
  }

  setStoredLanguage(lang) {
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.warn('[i18n] Could not save language to localStorage:', e);
    }
  }

  init() {
    if (!window.translations) {
      console.error('[i18n] translations object not found! Make sure translations.js is loaded first.');
      return;
    }

    this.setupLanguageButtons();
    this.translate(this.currentLanguage);
    this.updateActiveButton();
  }

  setupLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    console.log('[i18n] Found', buttons.length, 'language buttons');

    if (buttons.length === 0) {
      console.warn('[i18n] No language buttons found!');
      return;
    }

    buttons.forEach(btn => {
      // Set initial active state
      if (btn.dataset.lang === this.currentLanguage) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lang = btn.dataset.lang;
        console.log('[i18n] Language button clicked:', lang);
        this.changeLanguage(lang);
      });
    });
  }

  changeLanguage(lang) {
    console.log('[i18n] Changing language to:', lang);
    this.currentLanguage = lang;
    this.setStoredLanguage(lang);
    this.translate(lang);
    this.updateActiveButton();

    // Update html lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';

    // Update meta tags for SEO
    this.updateMetaTags(lang);
    console.log('[i18n] Language changed to:', lang);
  }

  updateActiveButton() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === this.currentLanguage) {
        btn.classList.add('active');
      }
    });
  }

  translate(lang) {
    const t = translations[lang];

    if (!t) {
      console.error('[i18n] Translation not found for language:', lang);
      return;
    }

    let updated = 0;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
        updated++;
      }
    });

    // Update all elements with data-i18n-html attribute (contains HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (t[key]) {
        el.innerHTML = t[key];
        updated++;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) {
        el.placeholder = t[key];
        updated++;
      }
    });

    console.log('[i18n] Updated', updated, 'elements for language:', lang);
  }

  updateMetaTags(lang) {
    const metaTags = {
      description: {
        pt: 'Agencia Byte - Desenvolvimento de sistemas personalizados, automações com IA e soluções tech. Transformamos ideias em código que funciona.',
        en: 'Agencia Byte - Custom system development, AI automations and tech solutions. We transform ideas into working code.',
        es: 'Agencia Byte - Desarrollo de sistemas personalizados, automatizaciones con IA y soluciones tech. Transformamos ideas en código que funciona.'
      },
      keywords: {
        pt: 'desenvolvimento de sistemas, automação com IA, consultoria técnica, agência de tecnologia, sistemas personalizados',
        en: 'system development, AI automation, technical consulting, technology agency, custom systems',
        es: 'desarrollo de sistemas, automatización con IA, consultoría técnica, agencia de tecnología, sistemas personalizados'
      }
    };

    // Update description meta tag
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && metaTags.description[lang]) {
      descMeta.content = metaTags.description[lang];
    }

    // Update keywords meta tag
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta && metaTags.keywords[lang]) {
      keywordsMeta.content = metaTags.keywords[lang];
    }

    // Update language meta tag
    let langMeta = document.querySelector('meta[name="language"]');
    if (langMeta) {
      langMeta.content = lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Spanish';
    }
  }

  t(key) {
    return translations[this.currentLanguage][key] || key;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[i18n] DOMContentLoaded - initializing I18n');
    window.i18n = new I18n();
  });
} else {
  console.log('[i18n] DOM already loaded - initializing I18n');
  window.i18n = new I18n();
}

console.log('[i18n] Script loaded. Translations available:', !!window.translations);
