/* ============================================================================
   AGENCIA BYTE — PREMIUM JAVASCRIPT
   Nav, scroll-reveal, form validation, micro-interactions
   ============================================================================ */

(function() {
  'use strict';

  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  /* ====== 1. NAV SCROLL BEHAVIOR ====== */

  let ticking = false;
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateNavScroll);
      ticking = true;
    }
  }, { passive: true });

  function updateNavScroll() {
    if (lastScrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    updateActiveNavLink();
    ticking = false;
  }

  /* ====== 2. MOBILE MENU TOGGLE ====== */

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    const isClickInsideNav = nav.contains(e.target);
    if (!isClickInsideNav && hamburger.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ====== 3. SCROLL-REVEAL (IntersectionObserver) ====== */

  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.classList.add('is-visible');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ====== 4. ACTIVE NAV LINK HIGHLIGHT ====== */

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('main > section');
    let activeSectionId = '';
    let maxRatio = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const ratio = visibleHeight / viewportHeight;

      if (ratio > maxRatio) {
        maxRatio = ratio;
        activeSectionId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  updateActiveNavLink();

  /* ====== 5. SERVICE CARD HOVER GLOW ====== */

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });

  /* ====== 6. CONTACT FORM VALIDATION ====== */

  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formSuccess = document.querySelector('.form__success');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.form__error');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('show');
      input.style.borderColor = 'var(--color-error)';
    }
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    const errorSpan = input.parentElement.querySelector('.form__error');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('show');
    }
    input.style.borderColor = '';
    input.removeAttribute('aria-invalid');
  }

  function validateForm() {
    let isValid = true;

    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Por favor, insira seu nome.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Por favor, insira seu e-mail.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Por favor, insira um e-mail válido.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Por favor, insira sua mensagem.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'A mensagem deve ter pelo menos 10 caracteres.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'scale(0.95)';
        contactForm.style.pointerEvents = 'none';

        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          formSuccess.style.animation = 'fadeIn 0.6s ease forwards';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);

        contactForm.reset();

        setTimeout(() => {
          contactForm.style.display = 'flex';
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'scale(1)';
          contactForm.style.pointerEvents = 'auto';
          contactForm.style.animation = 'fadeIn 0.6s ease forwards';
          formSuccess.style.display = 'none';
        }, 5000);
      }
    });

    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          clearError(input);
        }
      });
    });
  }

  /* ====== 7. PARALLAX & SMOOTH ANIMATIONS ====== */

  const gradientShapes = document.querySelectorAll('.hero__gradient-shape');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const scrollRatio = window.scrollY / window.innerHeight;
      gradientShapes.forEach((shape, index) => {
        const speed = (index + 1) * 50;
        shape.style.transform = `translateY(${scrollRatio * speed}px)`;
      });
    }
  }, { passive: true });

  /* ====== 8. MARQUEE PAUSE ON HOVER/TOUCH ====== */

  const marquee = document.querySelector('.tecnologias__track');
  if (marquee) {
    marquee.addEventListener('touchstart', () => {
      marquee.style.animationPlayState = 'paused';
    }, { passive: true });

    marquee.addEventListener('touchend', () => {
      marquee.style.animationPlayState = 'running';
    }, { passive: true });
  }

  /* ====== 9. BUTTON RIPPLE EFFECT ====== */

  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ====== 10. PAGE LOAD ANIMATION ====== */

  window.addEventListener('load', () => {
    document.documentElement.style.scrollBehavior = 'smooth';
  });

console.log('✨ Agencia Byte premium site loaded');

})();
