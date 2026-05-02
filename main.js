/* ============================================
   TRIBO LANDING — main.js
   Animaciones, scroll reveals, contador
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. NAV — scroll state
  // ==========================================
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  // ==========================================
  // 2. SCROLL REVEAL — Intersection Observer
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay para elementos en grid
        const siblings = entry.target.closest('.problems__grid, .section__header');
        let delay = 0;

        if (siblings) {
          const index = Array.from(siblings.children).indexOf(entry.target);
          delay = index * 80;
        }

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ==========================================
  // 3. CONTADOR ANIMADO — prueba social
  // ==========================================
  const counterEl = document.getElementById('counter');
  const target = parseInt(counterEl?.dataset.target || '312', 10);
  let counterStarted = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, end, duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(start + (end - start) * eased);

      el.textContent = current.toLocaleString('es-ES');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end.toLocaleString('es-ES');
      }
    }

    requestAnimationFrame(update);
  }

  if (counterEl) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
          counterStarted = true;
          animateCounter(counterEl, target);
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(counterEl);
  }


  // ==========================================
  // 4. SMOOTH SCROLL — links internos
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = nav?.offsetHeight || 68;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ==========================================
  // 5. PROBLEM CARDS — efecto hover parallax sutil
  // ==========================================
  const problemCards = document.querySelectorAll('.problem-card');

  problemCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });


  // ==========================================
  // 6. HERO HEADLINE — entrada con stagger de palabras
  // ==========================================
  const headline = document.querySelector('.hero__headline');

  if (headline) {
    // Pequeño delay para que cargue con elegancia
    setTimeout(() => {
      headline.style.opacity = '1';
      headline.style.transform = 'none';
    }, 100);
  }

});
