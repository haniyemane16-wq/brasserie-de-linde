'use strict';

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

function updateActiveLink() {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
}

window.addEventListener('scroll', () => {
  updateNavbar(); updateActiveLink(); updateScrollTop();
}, { passive: true });
updateNavbar();

/* ===== MOBILE MENU ===== */
const toggle = document.getElementById('navToggle');
const navList = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  toggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
  navList.classList.remove('open');
  toggle.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

/* ===== REVEAL ON SCROLL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

/* ===== MENU TABS ===== */
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`${tab.dataset.menu}-panel`);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    }
  });
});

/* ===== FORM VALIDATION ===== */
const form = document.getElementById('reservatieForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

const validate = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: v => /^[\d\s\-+()]{8,}$/.test(v.trim()),
};

function showErr(id, msg) { const el = document.getElementById(`${id}-error`); if (el) el.textContent = msg; }
function clearErr(id) { const el = document.getElementById(`${id}-error`); if (el) el.textContent = ''; }

if (form) {
  form.naam.addEventListener('blur', () => showErr('naam', form.naam.value.trim().length < 2 ? 'Vul uw naam in.' : ''));
  form.telefoon.addEventListener('blur', () => showErr('telefoon', !validate.phone(form.telefoon.value) ? 'Vul een geldig telefoonnummer in.' : ''));
  form.email.addEventListener('blur', () => showErr('email', !validate.email(form.email.value) ? 'Vul een geldig e-mailadres in.' : ''));
  form.gasten.addEventListener('change', () => clearErr('gasten'));
  form.datum.addEventListener('change', () => clearErr('datum'));
  form.tijd.addEventListener('change', () => clearErr('tijd'));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    if (form.naam.value.trim().length < 2) { showErr('naam', 'Vul uw naam in.'); valid = false; } else clearErr('naam');
    if (!validate.phone(form.telefoon.value)) { showErr('telefoon', 'Vul een geldig nummer in.'); valid = false; } else clearErr('telefoon');
    if (!validate.email(form.email.value)) { showErr('email', 'Vul een geldig e-mailadres in.'); valid = false; } else clearErr('email');
    if (!form.gasten.value) { showErr('gasten', 'Selecteer aantal gasten.'); valid = false; } else clearErr('gasten');
    if (!form.datum.value) { showErr('datum', 'Selecteer een datum.'); valid = false; } else clearErr('datum');
    if (!form.tijd.value) { showErr('tijd', 'Selecteer een tijdstip.'); valid = false; } else clearErr('tijd');
    if (!form.akkoord.checked) { showErr('akkoord', 'Ga akkoord met de voorwaarden.'); valid = false; } else clearErr('akkoord');
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Verwerken...</span>';
    await new Promise(r => setTimeout(r, 1800));
    form.style.display = 'none';
    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior:'smooth', block:'center' });
  });
}

/* ===== DATE MIN ===== */
const datumInput = document.getElementById('datum');
if (datumInput) {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  datumInput.min = tomorrow.toISOString().split('T')[0];
  const max = new Date(); max.setDate(max.getDate() + 90);
  datumInput.max = max.toISOString().split('T')[0];
}

/* ===== SCROLL TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');
function updateScrollTop() { scrollTopBtn.classList.toggle('visible', window.scrollY > 400); }
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ===== COOKIE BANNER ===== */
const cookieBanner = document.getElementById('cookieBanner');
if (!localStorage.getItem('bdl_cookie')) setTimeout(() => cookieBanner.classList.add('visible'), 2000);
document.getElementById('cookieAccept')?.addEventListener('click', () => { localStorage.setItem('bdl_cookie','accepted'); cookieBanner.classList.remove('visible'); setTimeout(() => cookieBanner.remove(), 400); });
document.getElementById('cookieDecline')?.addEventListener('click', () => { localStorage.setItem('bdl_cookie','declined'); cookieBanner.classList.remove('visible'); setTimeout(() => cookieBanner.remove(), 400); });

/* ===== PARALLAX HERO ===== */
const heroImg = document.querySelector('.hero__img');
if (heroImg) window.addEventListener('scroll', () => {
  if (window.scrollY <= 0) {
    heroImg.style.transform = '';   // restore CSS animation at top
  } else if (window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.12}px)`;
  }
}, { passive:true });

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => { updateNavbar(); updateScrollTop(); });
