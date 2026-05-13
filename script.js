/* =========================================================
   MAN INTENSE — VIRILITY & PRIME
   Linha Alphagenin · Vanilla JS
   ========================================================= */

(function () {
  'use strict';

  /* ── 1. PARTICLES ── */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const COUNT = 70;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -(Math.random() * 0.4 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      };
    }

    function initParticlesArray() {
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(createParticle());
    }

    function drawParticle(p) {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 224, 255, ${alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0, 224, 255, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        drawParticle(p);
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) { Object.assign(p, createParticle()); p.y = H + 10; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      });
      requestAnimationFrame(animate);
    }

    resize();
    initParticlesArray();
    animate();
    window.addEventListener('resize', () => { resize(); initParticlesArray(); });
  })();

  /* ── 2. SCROLL REVEAL ── */
  (function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          // Stagger siblings inside grid containers
          const grid = entry.target.closest(
            '.escolha-grid, .benefits-grid, .testi-grid, .pricing-grid, .faq-list, .hero-inner'
          );
          if (grid) {
            const all = grid.querySelectorAll(':scope > .reveal, :scope > * > .reveal');
            let delay = 0;
            all.forEach(el => {
              if (!el.classList.contains('visible')) {
                setTimeout(() => el.classList.add('visible'), delay);
                delay += 80;
              }
            });
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  })();

  /* ── 3. SMOOTH SCROLL ── */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
          ) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  })();

  /* ── 4. FAQ ACCORDION ── */
  (function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  })();

  /* ── 5. HERO PARALLAX (subtle) ── */
  (function initParallax() {
    const heroBg = document.querySelector('.hero-bg-glow');
    const heroBeam = document.querySelector('.hero-beam');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.15}px)`;
          if (heroBeam) heroBeam.style.opacity = Math.max(0, 0.25 - y * 0.001);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ── 6. BUTTON RIPPLE ── */
  (function initRipple() {
    // Add keyframe once
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple-anim { to { width:200px; height:200px; opacity:0; } }`;
    document.head.appendChild(style);

    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute;
          left:${e.clientX - rect.left}px;
          top:${e.clientY - rect.top}px;
          width:0;height:0;
          border-radius:50%;
          background:rgba(255,255,255,0.22);
          transform:translate(-50%,-50%);
          animation:ripple-anim 0.55s ease-out forwards;
          pointer-events:none;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  })();

  /* ── 7. CUSTOM VIDEO PLAYER ── */
  (function initVideoPlayers() {
    if (typeof Plyr === 'undefined') return;

    const players = Plyr.setup('.js-player', {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'fullscreen'
      ],
      ratio: '9:16',
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: false,
      loop: { active: true }
    });

    const states = new Map();

    players.forEach(player => {
      states.set(player, {
        userStarted: false,
        manuallyPaused: false,
        pausedByViewport: false,
        internalPause: false
      });

      player.on('play', () => {
        const state = states.get(player);

        state.userStarted = true;
        state.manuallyPaused = false;
        state.pausedByViewport = false;

        // Impede dois vídeos tocando ao mesmo tempo
        players.forEach(otherPlayer => {
          if (otherPlayer === player) return;

          const otherState = states.get(otherPlayer);

          if (otherPlayer.playing) {
            otherState.internalPause = true;
            otherPlayer.pause();
            otherState.internalPause = false;
          }

          otherState.pausedByViewport = false;
        });
      });

      player.on('pause', () => {
        const state = states.get(player);

        if (!state.internalPause && !state.pausedByViewport) {
          state.manuallyPaused = true;
        }
      });
    });

    // Pausa quando sai da tela e volta quando entra de novo
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        const player = players.find(p => p.media === video);
        if (!player) return;

        const state = states.get(player);
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.45;

        if (!isVisible && player.playing) {
          state.pausedByViewport = true;
          state.internalPause = true;
          player.pause();
          state.internalPause = false;
          return;
        }

        if (
          isVisible &&
          state.userStarted &&
          state.pausedByViewport &&
          !state.manuallyPaused
        ) {
          state.pausedByViewport = false;

          player.play().catch(() => {
            // Alguns navegadores podem bloquear play automático com áudio.
            // Se acontecer, o usuário só precisa apertar play de novo.
          });
        }
      });
    }, {
      threshold: [0, 0.25, 0.45, 0.7]
    });

    players.forEach(player => observer.observe(player.media));
  })();

  console.log('%cMAN INTENSE — Virility & Prime · Alphagenin', 'color:#00E0FF;font-family:monospace;font-size:13px;font-weight:bold;text-shadow:0 0 10px #00E0FF');
})();
