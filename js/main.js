/* ============================================================================
   AGENCIA BYTE — PREMIUM JAVASCRIPT
   Nav, scroll-reveal, form validation, micro-interactions
   ============================================================================ */

(function () {
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
        const submitBtn = contactForm.querySelector('.form__submit') || contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Setup payload
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // UI Feedback: Loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => {
            if (response.ok) {
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
            } else {
              throw new Error('Submission failed');
            }
          })
          .catch(error => {
            console.error('Formspark Error:', error);
            alert('Ops! Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          });
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
    button.addEventListener('click', function (e) {
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

  /* ====== 11. CLIENTES SLIDER ====== */

  const sliderTrack = document.querySelector('.slider-track');
  const sliderBtns = document.querySelectorAll('.slider-btn');
  const sliderDots = document.querySelector('.slider-dots');
  const clienteCards = document.querySelectorAll('.cliente-card');

  if (sliderTrack && clienteCards.length > 0) {
    // Create dots
    clienteCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-btn--prev');
    const nextBtn = document.querySelector('.slider-btn--next');

    function updateActiveDot(index) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function getCurrentSlideIndex() {
      const cardWidth = clienteCards[0].clientWidth;
      const scrollLeft = sliderTrack.scrollLeft;
      return Math.round(scrollLeft / (cardWidth + 24)); // 24 = gap
    }

    function updateButtonStates() {
      const currentIndex = getCurrentSlideIndex();
      const maxIndex = clienteCards.length - 1;

      // Disable prev button on first slide
      if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      }

      // Disable next button on last slide
      if (nextBtn) {
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
      }
    }

    // Navigation buttons
    sliderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cardWidth = clienteCards[0].clientWidth;
        const scrollAmount = cardWidth + 24; // gap

        if (btn.classList.contains('slider-btn--prev')) {
          sliderTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          sliderTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });

    // Update dots and button states on scroll
    let scrollTimeout;
    sliderTrack.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const index = getCurrentSlideIndex();
        updateActiveDot(index);
        updateButtonStates();
      }, 100);
    });

    // Click on dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cardWidth = clienteCards[0].clientWidth;
        sliderTrack.scrollTo({
          left: index * (cardWidth + 24),
          behavior: 'smooth'
        });
      });
    });

    // Initialize button states
    updateButtonStates();
  }

  console.log('✨ Agencia Byte premium site loaded');

})();
