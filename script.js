/* ===================================
   DR & DR SAMOSA — SCRIPTS
   Scroll animations, counters, nav
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- NAVBAR SCROLL ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- MOBILE NAV TOGGLE ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeMobileMenu = () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  };

  const openMobileMenu = () => {
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- SCROLL REVEAL (Intersection Observer) ---
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // --- COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  // --- PARALLAX ON HERO SHAPES (desktop only) ---
  const isMobileDevice = window.innerWidth <= 768;

  if (!isMobileDevice) {
    const heroShapes = document.querySelectorAll('.hero-shape');
    const floatingSamosas = document.querySelectorAll('.floating-samosa');

    const handleParallax = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;

      if (scrollY > maxScroll) return;

      heroShapes.forEach((shape, i) => {
        const speed = 0.03 + i * 0.015;
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });

      floatingSamosas.forEach((samosa, i) => {
        const speed = 0.02 + i * 0.01;
        const rotate = scrollY * 0.02 * (i % 2 === 0 ? 1 : -1);
        samosa.style.transform = `translateY(${scrollY * speed}px) rotate(${rotate}deg)`;
      });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- ACTIVE NAV LINK HIGHLIGHT ---
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--text)';
          link.style.setProperty('--after-width', '100%');
        } else {
          link.style.color = '';
          link.style.setProperty('--after-width', '');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- TILT & MAGNETIC EFFECTS (desktop only) ---
  const isTouch = !window.matchMedia('(pointer: fine)').matches;

  if (!isTouch) {
    // Tilt effect on menu cards
    const menuCards = document.querySelectorAll('.menu-card:not(.menu-card-cta)');

    menuCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Magnetic button effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- NEWSLETTER FORM ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        const btn = newsletterForm.querySelector('button');
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9L8 13L14 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        btn.style.background = 'var(--green-600)';
        input.value = '';
        input.placeholder = 'You\'re in!';

        setTimeout(() => {
          btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          btn.style.background = '';
          input.placeholder = 'your@email.com';
        }, 3000);
      }
    });
  }

  // --- HERO SCROLL FADE ---
  const hero = document.getElementById('hero');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  const handleHeroFade = () => {
    const scrollY = window.scrollY;
    const heroHeight = hero ? hero.offsetHeight : 800;
    const fadeStart = heroHeight * 0.3;
    const fadeEnd = heroHeight * 0.7;

    if (scrollIndicator) {
      const indicatorOpacity = Math.max(0, 1 - scrollY / 300);
      scrollIndicator.style.opacity = indicatorOpacity;
    }

    if (hero && scrollY > fadeStart) {
      const progress = Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
      hero.style.opacity = 1 - progress * 0.4;
    } else if (hero) {
      hero.style.opacity = 1;
    }
  };

  window.addEventListener('scroll', handleHeroFade, { passive: true });

  // --- CURSOR GLOW ON HERO (desktop only) ---
  const heroBg = document.querySelector('.hero-bg-shapes');

  if (heroBg && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const glow = heroBg.querySelector('.cursor-glow') || (() => {
        const div = document.createElement('div');
        div.className = 'cursor-glow';
        div.style.cssText = `
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.15s ease-out;
        `;
        heroBg.appendChild(div);
        return div;
      })();

      glow.style.left = `${e.clientX - 200}px`;
      glow.style.top = `${e.clientY - 200}px`;
    });
  }

  // --- MOBILE STICKY CTA BAR ---
  const mobileCta = document.getElementById('mobileCta');

  if (mobileCta) {
    let mobileCtaVisible = false;

    const handleMobileCta = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > window.innerHeight * 0.6;

      if (shouldShow && !mobileCtaVisible) {
        mobileCtaVisible = true;
        mobileCta.classList.add('visible');
      } else if (!shouldShow && mobileCtaVisible) {
        mobileCtaVisible = false;
        mobileCta.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleMobileCta, { passive: true });
  }

});
