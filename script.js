/* ── Custom cursor ─────────────────────────────── */
const ring = document.getElementById('curRing');
const dot  = document.getElementById('curDot');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    if (dot)  dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    requestAnimationFrame(animCursor);
  })();
} else {
  if (ring) ring.style.display = 'none';
  if (dot)  dot.style.display  = 'none';
}

/* ── Nav scroll ────────────────────────────────── */
const nav = document.querySelector('[data-header]');
const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 60);
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

/* ── Burger menu ───────────────────────────────── */
const burger   = document.querySelector('[data-menu-button]');
const navLinks = document.querySelector('[data-nav-links]');
const navItems = [...document.querySelectorAll('.nav-links a')];

burger?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('is-open');
  burger.classList.toggle('is-open', !!open);
  document.body.classList.toggle('menu-open', !!open);
  burger.setAttribute('aria-expanded', String(!!open));
});
navItems.forEach(a => a.addEventListener('click', () => {
  navLinks?.classList.remove('is-open');
  burger?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  burger?.setAttribute('aria-expanded', 'false');
}));

/* ── Active nav highlight ──────────────────────── */
const sections = navItems
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navItems.forEach(a =>
      a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`)
    );
  });
}, { rootMargin: '-30% 0px -65% 0px', threshold: 0.05 });
sections.forEach(s => navObs.observe(s));

/* ── Typing animation ──────────────────────────── */
const roles  = ['Java Developer', 'Backend Learner', 'Android Builder', 'Problem Solver'];
const typedEl = document.getElementById('typedText');
let ri = 0, ci = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const word = roles[ri];
  if (deleting) {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    setTimeout(typeLoop, deleting ? 50 : 120);
  } else {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { setTimeout(() => { deleting = true; typeLoop(); }, 2200); }
    else setTimeout(typeLoop, 90);
  }
}
setTimeout(typeLoop, 800);

/* ── Project filter ────────────────────────────── */
const filterBtns = [...document.querySelectorAll('[data-filter]')];
const projCards  = [...document.querySelectorAll('[data-project]')];
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('is-active', b === btn));
    projCards.forEach(c => {
      const show = f === 'all' || c.dataset.project === f;
      c.classList.toggle('is-hidden', !show);
    });
  });
});

/* ── Scroll reveal (direction-aware) ──────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    const siblings = [...(e.target.parentElement?.querySelectorAll('[data-reveal]') ?? [])];
    const idx = siblings.indexOf(e.target);
    e.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ── Counter animation ─────────────────────────── */
function animCount(el) {
  const target  = parseInt(el.dataset.target, 10);
  const decimal = el.hasAttribute('data-decimal');
  const dur     = 1600;
  const start   = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = Math.round(ease * target);
    el.textContent = decimal ? (val / 10).toFixed(1) : val > 999 ? val : val;
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animCount(e.target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── Skill bar fill ────────────────────────────── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const fills = e.target.querySelectorAll('.sk-fill[data-w]');
    fills.forEach(f => { f.style.width = f.dataset.w + '%'; });
    barObs.unobserve(e.target);
  });
}, { threshold: 0.2 });
const barSection = document.querySelector('.skill-bars');
if (barSection) barObs.observe(barSection);

/* ── 3D card tilt ─────────────────────────────── */
document.querySelectorAll('.pc, .cc, .s-box').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Hero photo tilt ──────────────────────────── */
const photoWrap = document.getElementById('photoWrap');
if (photoWrap) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx * 6;
    const dy = (e.clientY - cy) / cy * 5;
    photoWrap.style.transform = `perspective(900px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  photoWrap.addEventListener('mouseleave', () => {
    photoWrap.style.transform = '';
  });
}

/* ── Magnetic neon buttons ────────────────────── */
document.querySelectorAll('.btn-neon, .nav-hire').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
    btn.style.transform = `translate(${dx}px,${dy}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── Glitch on nav hover ──────────────────────── */
navItems.forEach(a => {
  a.addEventListener('mouseenter', () => {
    a.style.textShadow = '2px 0 #00ff88, -2px 0 #ff3366';
    setTimeout(() => { a.style.textShadow = ''; }, 180);
  });
});
