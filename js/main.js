/* ============================================
   MAIN.JS — Slider, Scroll Animations,
   Form Validation, Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Loader ----
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback: hide loader after 2s
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // ---- Header Scroll Effect ----
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ---- Mobile Menu ----
  const hamBtn = document.querySelector('.ham-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamBtn && mobileMenu) {
    hamBtn.addEventListener('click', () => mobileMenu.style.display = 'flex');
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => mobileMenu.style.display = 'none');
  }

  // ---- Hero Slider ----
  const heroTrack = document.querySelector('.hero-track');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (heroTrack && heroSlides.length > 0) {
    let currentSlide = 0;
    let autoPlayTimer;

    function goToSlide(index) {
      if (index < 0) index = heroSlides.length - 1;
      if (index >= heroSlides.length) index = 0;
      currentSlide = index;

      heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      heroSlides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
      sliderDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentSlide - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentSlide + 1); startAutoPlay(); });

    sliderDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); });
    });

    // Touch swipe support
    let touchStartX = 0;
    heroTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; stopAutoPlay(); }, { passive: true });
    heroTrack.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
      startAutoPlay();
    }, { passive: true });

    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', stopAutoPlay);
      heroSlider.addEventListener('mouseleave', startAutoPlay);
    }

    // Init
    goToSlide(0);
    startAutoPlay();
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---- Journey Timeline Animation ----
  const journeyTimeline = document.getElementById('journeyTimeline');
  const journeyLineFill = document.getElementById('journeyLineFill');
  if (journeyTimeline && journeyLineFill) {
    window.addEventListener('scroll', () => {
      const rect = journeyTimeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.8) {
        let fillPercentage = ((windowHeight * 0.8 - rect.top) / rect.height) * 100;
        fillPercentage = Math.max(0, Math.min(100, fillPercentage));
        journeyLineFill.style.height = `${fillPercentage}%`;
      }
    }, { passive: true });
  }

  // ---- Stagger Children Delay ----
  document.querySelectorAll('.stagger-children').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.floor(target * eased).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ---- Accordion ----
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(ai => {
        ai.classList.remove('open');
        ai.querySelector('.accordion-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ---- Multi-Step Form ----
  const stepPanels = document.querySelectorAll('.step-panel');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');

  if (stepPanels.length > 0) {
    let currentStep = 0;

    window.goToStep = function(step) {
      // Validate current step before moving forward
      if (step > currentStep) {
        const currentPanel = stepPanels[currentStep];
        const inputs = currentPanel.querySelectorAll('.form-control[required]');
        let valid = true;
        inputs.forEach(input => {
          if (!validateField(input)) valid = false;
        });
        if (!valid) return;
      }

      stepPanels.forEach((p, i) => p.classList.toggle('active', i === step));
      progressSteps.forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i < step) s.classList.add('completed');
        if (i === step) s.classList.add('active');
      });
      progressLines.forEach((l, i) => {
        l.classList.toggle('completed', i < step);
      });
      currentStep = step;
      // window.scrollTo({ top: 0, behavior: 'smooth' }); // Removed to prevent scrolling to top
    };

    window.nextStep = () => goToStep(currentStep + 1);
    window.prevStep = () => goToStep(currentStep - 1);
  }

  // ---- Form Validation ----
  window.validateField = function(input) {
    const value = input.value.trim();
    const errorEl = input.parentElement.querySelector('.form-error') ||
                    input.closest('.form-group')?.querySelector('.form-error');
    let errorMsg = '';

    // Required check
    if (input.hasAttribute('required') && !value) {
      errorMsg = 'This field is required.';
    }

    // Email
    if (!errorMsg && input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = 'Please enter a valid email address.';
    }

    // Phone
    if (!errorMsg && input.type === 'tel' && value) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) errorMsg = 'Please enter a valid 10-digit phone number.';
    }

    // Password
    if (!errorMsg && input.dataset.validate === 'password' && value) {
      if (value.length < 8) errorMsg = 'Password must be at least 8 characters.';
      else if (!/[A-Z]/.test(value)) errorMsg = 'Password must contain an uppercase letter.';
      else if (!/[a-z]/.test(value)) errorMsg = 'Password must contain a lowercase letter.';
      else if (!/[0-9]/.test(value)) errorMsg = 'Password must contain a number.';
      else if (!/[!@#$%^&*]/.test(value)) errorMsg = 'Password must contain a special character (!@#$%^&*).';
    }

    // Confirm Password
    if (!errorMsg && input.dataset.validate === 'confirm-password' && value) {
      const passwordInput = document.querySelector('[data-validate="password"]');
      if (passwordInput && value !== passwordInput.value) {
        errorMsg = 'Passwords do not match.';
      }
    }

    // Min length
    if (!errorMsg && input.minLength > 0 && value.length < input.minLength) {
      errorMsg = `Must be at least ${input.minLength} characters.`;
    }

    // Max length
    if (!errorMsg && input.maxLength > 0 && input.maxLength < 99999 && value.length > input.maxLength) {
      errorMsg = `Must not exceed ${input.maxLength} characters.`;
    }

    // Apply validation state
    if (errorMsg) {
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (errorEl) { errorEl.textContent = errorMsg; errorEl.classList.add('show'); }
      return false;
    } else {
      input.classList.remove('invalid');
      if (value) input.classList.add('valid');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
      return true;
    }
  };

  // Real-time validation on blur and input
  document.querySelectorAll('.form-control').forEach(input => {
    // Prevent numbers in name fields
    if (input.id && input.id.toLowerCase().includes('name')) {
      input.addEventListener('input', (e) => {
        if (/[0-9]/.test(e.target.value)) {
          e.target.value = e.target.value.replace(/[0-9]/g, '');
        }
      });
    }

    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  // ---- Password Strength Meter ----
  const passwordInputs = document.querySelectorAll('[data-validate="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('input', () => {
      const val = input.value;
      const bars = input.closest('.form-group')?.querySelectorAll('.strength-bar');
      if (!bars || bars.length === 0) return;

      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[!@#$%^&*]/.test(val)) strength++;

      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < strength) {
          bar.classList.add(strength <= 2 ? 'weak' : strength === 3 ? 'medium' : 'strong');
        }
      });
    });
  });

  // ---- Password Toggle Visibility ----
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggle.innerHTML = isPassword ?
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>' :
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      }
    });
  });

  // ---- Track Grievance Search ----
  const trackForm = document.getElementById('trackForm');
  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = trackForm.querySelector('.form-control');
      const resultCard = document.querySelector('.track-result');
      const noResult = document.querySelector('.no-result');

      if (searchInput && searchInput.value.trim()) {
        if (resultCard) resultCard.classList.add('show');
        if (noResult) noResult.style.display = 'none';
      }
    });
  }

  // ---- Dashboard Mobile Sidebar ----
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('sidebar');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.add('open'));
  }
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // ---- FAQ Search Filter ----
  const faqSearchInput = document.getElementById('faqSearch');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', () => {
      const query = faqSearchInput.value.toLowerCase();
      document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // ---- FAQ Category Filter ----
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  // ---- Generic Form Submit Handler ----
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('.form-control[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!validateField(input)) valid = false;
      });

      if (valid) {
        if (typeof showToast === 'function') {
          showToast('Form submitted successfully!', 'success');
        }
        form.reset();
        form.querySelectorAll('.form-control').forEach(i => i.classList.remove('valid', 'invalid'));
      }
    });
  });

});
