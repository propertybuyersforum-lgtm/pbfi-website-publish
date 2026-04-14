/* ============================================================
   BFI ANIMATIONS — Buyers Forum of India
   ============================================================ */

/* ── PAGE TRANSITION OVERLAY ── */
function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.style.transform = 'scaleY(0)';
      overlay.style.transformOrigin = 'top';
    }, 100);
  });
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('https://wa')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.transformOrigin = 'bottom';
      overlay.style.transform = 'scaleY(1)';
      setTimeout(() => { window.location.href = href; }, 500);
    });
  });
}

/* ── CANVAS PARTICLES ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      const big  = Math.random() > 0.78;
      this.r     = big ? Math.random() * 3.5 + 1.8 : Math.random() * 1.5 + 0.4;
      this.isBig = big;
      this.vx    = (Math.random() - 0.5) * 0.22;
      this.vy    = -(Math.random() * 0.45 + 0.12);
      this.alpha = big ? Math.random() * 0.45 + 0.12 : Math.random() * 0.6 + 0.1;
      this.life  = Math.random() * 280 + 120;
      this.age   = 0;
      this.gold  = Math.random() > 0.55;
      this.wobbleSpeed = Math.random() * 0.015 + 0.005;
      this.wobbleAmp   = Math.random() * 0.6;
      this.wobbleOff   = Math.random() * Math.PI * 2;
    }
    update() {
      this.x  += this.vx + Math.sin(this.age * this.wobbleSpeed + this.wobbleOff) * this.wobbleAmp;
      this.y  += this.vy;
      this.age++;
      if (this.y < -12 || this.age > this.life || this.x < -20 || this.x > W + 20) this.reset(false);
    }
    draw() {
      const fade = this.age < 40 ? this.age / 40 : this.age > this.life - 40 ? (this.life - this.age) / 40 : 1;
      const a    = this.alpha * fade;
      if (this.isBig && this.gold) {
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2.5);
        grd.addColorStop(0,   `rgba(232,201,106,${a * 0.9})`);
        grd.addColorStop(0.5, `rgba(201,168,76,${a * 0.4})`);
        grd.addColorStop(1,   `rgba(201,168,76,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a;
        ctx.fillStyle = '#E8C96A';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.isBig) {
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2);
        grd.addColorStop(0,   `rgba(245,243,238,${a * 0.7})`);
        grd.addColorStop(1,   `rgba(245,243,238,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a * 0.8;
        ctx.fillStyle = 'rgba(245,243,238,0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = a;
        ctx.fillStyle = this.gold ? 'rgba(201,168,76,0.85)' : 'rgba(245,243,238,0.55)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 180 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
}

/* ── ORBIT ANIMATION (JS-driven so labels stay upright) ── */
function initOrbit() {
  const ringOuter = document.querySelector('.ring-outer');
  if (!ringOuter) return;

  // Remove CSS spin — JS takes over
  ringOuter.style.animation = 'none';
  ringOuter.style.transform = 'translate(-50%, -50%)';

  const dots = Array.from(ringOuter.querySelectorAll('.ring-dot'));
  const radius = 200;
  const periodMs = 32000; // same 32 s as original

  // Parse the static --angle from each dot's inline style
  const baseAngles = dots.map(dot => {
    const raw = dot.style.getPropertyValue('--angle') || '0deg';
    return parseFloat(raw) * (Math.PI / 180);
  });

  let t0 = null;

  (function frame(ts) {
    if (!t0) t0 = ts;
    const spin = ((ts - t0) / periodMs) * 2 * Math.PI;

    dots.forEach((dot, i) => {
      const a = baseAngles[i] + spin;
      const x = Math.sin(a) * radius;
      const y = -Math.cos(a) * radius;

      // Position dot via pure translation — no rotation
      dot.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

      // Label sits inside dot. Since the dot is no longer rotated,
      // the label only needs centering — it stays perfectly upright.
      const lbl = dot.querySelector('.ring-label');
      if (lbl) lbl.style.transform = 'translateX(-50%)';
    });

    requestAnimationFrame(frame);
  })(performance.now());
}

/* ── HERO SPOTLIGHT (mouse-tracking radial glow) ── */
function initHeroSpotlight() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const spot = document.createElement('div');
  spot.style.cssText = [
    'position:absolute',
    'inset:0',
    'pointer-events:none',
    'z-index:1',
    'background:radial-gradient(700px circle at 50% 40%, rgba(201,168,76,0.045) 0%, transparent 65%)',
    'transition:background 0.15s ease'
  ].join(';');
  hero.appendChild(spot);

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    spot.style.background = `radial-gradient(700px circle at ${x}% ${y}%, rgba(201,168,76,0.07) 0%, transparent 65%)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    spot.style.background = 'radial-gradient(700px circle at 50% 40%, rgba(201,168,76,0.045) 0%, transparent 65%)';
  });
}

/* ── MAGNETIC CTA BUTTONS ── */
function initMagneticButtons() {
  document.querySelectorAll('.btn').forEach(btn => {
    let isHovered = false;

    btn.addEventListener('mouseenter', () => {
      isHovered = true;
      btn.style.transition = 'transform 0.08s ease';
    });

    btn.addEventListener('mousemove', e => {
      if (!isHovered) return;
      const r   = btn.getBoundingClientRect();
      const dx  = (e.clientX - (r.left + r.width  / 2)) * 0.22;
      const dy  = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      btn.style.transition = 'transform 0.55s cubic-bezier(0.25,1,0.5,1)';
      btn.style.transform  = 'translate(0, 0)';
    });
  });
}

/* ── SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'height:2px',
    'width:0',
    'z-index:99999',
    'pointer-events:none',
    'background:linear-gradient(90deg,#C9A84C 0%,#E8C96A 50%,#C9A84C 100%)',
    'transition:width 0.08s linear',
    'box-shadow:0 0 8px rgba(201,168,76,0.5)'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    bar.style.width = ((window.scrollY / docH) * 100).toFixed(2) + '%';
  }, { passive: true });
}

/* ── TYPING EFFECT ── */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = ['Securing Dreams.', 'Protecting Rights.', 'Building Trust.', 'Empowering Buyers.'];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 68);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 38);
    }
  }
  setTimeout(tick, 900);
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = el.dataset.target;
  const isPlus = target.includes('+'), isPct = target.includes('%');
  const num = parseFloat(target.replace(/[^0-9.]/g, ''));
  const duration = 2000, start = performance.now();
  const suffix = isPlus ? '+' : isPct ? '%' : '';
  const prefix = target.startsWith('₹') ? '₹' : '';
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(ease * num * 10) / 10;
    el.textContent = prefix + (Number.isInteger(val) ? val.toLocaleString('en-IN') : val) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
}

/* ── PROGRESS BARS ── */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { const t = e.target.dataset.width || '80'; setTimeout(() => { e.target.style.width = t + '%'; }, 200); io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

/* ── NAVBAR SCROLL EFFECT ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => { nav.classList.toggle('navbar-scrolled', window.scrollY > 50); }, { passive: true });
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

/* ── TILT EFFECT ── */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)'; });
  });
}

/* ── GOLD CURSOR TRAIL ── */
function initCursorTrail() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  const dots = [], NUM = 8;
  for (let i = 0; i < NUM; i++) {
    const d = document.createElement('div');
    d.style.cssText = `position:fixed;pointer-events:none;border-radius:50%;z-index:9999;transition:opacity 0.3s;opacity:0;background:#C9A84C;`;
    const s = (NUM - i) * 3;
    d.style.width = s + 'px'; d.style.height = s + 'px';
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }
  let mx = 0, my = 0, active = false;
  hero.addEventListener('mouseenter', () => { active = true; });
  hero.addEventListener('mouseleave', () => { active = false; dots.forEach(d => d.el.style.opacity = 0); });
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function trail() {
    let px = mx, py = my;
    dots.forEach((dot, i) => {
      dot.x += (px - dot.x) * (0.35 - i * 0.03);
      dot.y += (py - dot.y) * (0.35 - i * 0.03);
      dot.el.style.left = (dot.x - dot.el.offsetWidth / 2) + 'px';
      dot.el.style.top  = (dot.y - dot.el.offsetHeight / 2) + 'px';
      dot.el.style.opacity = active ? (1 - i / NUM) * 0.55 : 0;
      px = dot.x; py = dot.y;
    });
    requestAnimationFrame(trail);
  }
  trail();
}

/* ── GLOW CARDS ── */
function initGlowCards() {
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });
}

/* ── CARD STAGGER ANIMATION ── */
function initCardStagger() {
  const cards = document.querySelectorAll('.glow-card');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.97)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.25,1,0.5,1), transform 0.6s cubic-bezier(0.25,1,0.5,1)';
    io.observe(card);
  });
}

/* ── MEMBERSHIP TOGGLE ── */
function initMembershipToggle() {
  const btns = document.querySelectorAll('.plan-toggle-btn');
  btns.forEach(btn => { btn.addEventListener('click', () => { btns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
}

/* ── FLOATING LABELS ── */
function initFloatingLabels() {
  document.querySelectorAll('.float-input-group input,.float-input-group textarea').forEach(inp => {
    inp.addEventListener('focus', () => inp.closest('.float-input-group').classList.add('focused'));
    inp.addEventListener('blur', () => inp.closest('.float-input-group').classList.toggle('focused', inp.value.length > 0));
  });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── TEAM CARDS ── */
function initTeamCards() {
  const cards = document.querySelectorAll('.team-card');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
        }, i * 150);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(60px) scale(0.95)';
    card.style.transition = 'opacity 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)';
    io.observe(card);
  });
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initParticles();
  initOrbit();
  initTyping();
  initScrollReveal();
  initCounters();
  initProgressBars();
  initNavbar();
  initTilt();
  initCursorTrail();
  initGlowCards();
  initCardStagger();
  initTeamCards();
  initMembershipToggle();
  initFloatingLabels();
  initSmoothScroll();
  initHeroSpotlight();
  initMagneticButtons();
  initScrollProgress();
});