// Language management
class I18n {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'pt';
    this.init();
  }

  getStoredLanguage() {
    return localStorage.getItem('language');
  }

  setStoredLanguage(lang) {
    localStorage.setItem('language', lang);
  }

  init() {
    this.setupLanguageButtons();
    this.translate(this.currentLanguage);
    this.updateActiveButton();
  }

  setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        this.changeLanguage(lang);
      });
    });
  }

  changeLanguage(lang) {
    this.currentLanguage = lang;
    this.setStoredLanguage(lang);
    this.translate(lang);
    this.updateActiveButton();

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update meta tags for SEO
    this.updateMetaTags(lang);
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

    if (!t) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update all elements with data-i18n-html attribute (contains HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) {
        el.placeholder = t[key];
      }
    });
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
    window.i18n = new I18n();
  });
} else {
  window.i18n = new I18n();
}
