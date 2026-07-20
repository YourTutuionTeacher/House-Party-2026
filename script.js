/* =============================================================
   HOUSE PARTY 2026 — script.js
   Vanilla JS: countdown, particles, nav, modals, validation,
   Razorpay handoff, exit intent, FAQ, counters, scramble text.
============================================================= */

// -----------------------------------------------------------
// CONFIG — edit these values as needed
// -----------------------------------------------------------
const CONFIG = {
  // Event date/time this countdown targets (25 July 2026, 8 PM IST)
  eventDate: new Date('2026-07-25T20:00:00+05:30'),

  // ⚠️ PASTE YOUR RAZORPAY PAYMENT LINK HERE ⚠️
  // Replace the placeholder below with your real Razorpay Payment Link URL.
  // Example: 'https://rzp.io/l/abc123XYZ'
  razorpayPaymentLink: 'https://rzp.io/rzp/rt3lNpU',

  whatsappSupportNumber: '919999999999', // country code + number, no + or spaces

  // ⚠️ SUPABASE — paste your project details here to store registrations ⚠️
  // 1. Uncomment the supabase-js <script> tag near the bottom of index.html.
  // 2. Create a project at https://supabase.com, then paste its URL + anon key below.
  // 3. Create a `registrations` table (see README.md for the exact SQL + RLS policy).
  // If url/anonKey are left as-is, the form still works — it just saves to
  // localStorage only, and skips the Supabase insert.
  supabase: {
    url: 'https://lnqgtvybndiloxzsldtt.supabase.co',     // e.g. 'https://abcxyz.supabase.co'
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucWd0dnlibmRpbG94enNsZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMjc2MzAsImV4cCI6MjA5OTkwMzYzMH0.HE3R1BmoBQoDSxzjpIMwWppAgIrc3-XNlN9fRII4TJI',
    table: 'registrations',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });

  document.getElementById('year').textContent = new Date().getFullYear();

  initSupabase();
  initCountdown();
  initParticles();
  initScrollProgress();
  initNav();
  initStickyBar();
  initFaq();
  initCounters();
  initExitIntent();
  initScramble();
  initBuyForm();
});

// -----------------------------------------------------------
// COUNTDOWN TIMER
// -----------------------------------------------------------
function initCountdown() {
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  const navEl = document.getElementById('navCountdownText');

  function tick() {
    const now = new Date().getTime();
    const diff = CONFIG.eventDate.getTime() - now;

    if (diff <= 0) {
      [dEl, hEl, mEl, sEl].forEach(el => el && (el.textContent = '00'));
      if (navEl) navEl.textContent = "It's happening!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    if (navEl) navEl.textContent = `${days}d ${hours}h to go`;
  }

  tick();
  setInterval(tick, 1000);
}

// -----------------------------------------------------------
// FLOATING PARTICLES (lightweight, CSS-driven)
// -----------------------------------------------------------
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 18 : 34;
  const colors = ['rgba(168,85,247,0.5)', 'rgba(255,46,159,0.45)', 'rgba(255,255,255,0.35)'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 14 + 10;
    const delay = Math.random() * 10;
    p.style.animation = `particleFloat ${duration}s ease-in-out ${delay}s infinite`;
    container.appendChild(p);
  }

  // Inject keyframes once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translate(0,0); opacity: 0.2; }
      50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, -40px); opacity: 0.8; }
    }`;
  document.head.appendChild(style);
}

// -----------------------------------------------------------
// SCROLL PROGRESS BAR
// -----------------------------------------------------------
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

// -----------------------------------------------------------
// NAVBAR (mobile menu toggle + close on link click)
// -----------------------------------------------------------
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// -----------------------------------------------------------
// STICKY MOBILE BUY BAR (hide near footer)
// -----------------------------------------------------------
function initStickyBar() {
  const bar = document.getElementById('stickyBar');
  const footer = document.querySelector('footer');
  if (!bar || !footer) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle('hide', entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  observer.observe(footer);
}

// -----------------------------------------------------------
// FAQ ACCORDION
// -----------------------------------------------------------
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// -----------------------------------------------------------
// ANIMATED COUNTERS (trigger on scroll into view)
// -----------------------------------------------------------
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// -----------------------------------------------------------
// EXIT INTENT POPUP
// -----------------------------------------------------------
function initExitIntent() {
  let shown = sessionStorage.getItem('hp26_exit_shown') === '1';

  document.addEventListener('mouseout', (e) => {
    if (shown) return;
    if (e.clientY <= 0 && !document.getElementById('buyModal').classList.contains('active')) {
      showExitModal();
    }
  });

  // Mobile fallback: show once after a delay + scroll depth
  let mobileTimer = setTimeout(() => {
    if (!shown && window.scrollY > 400 && window.innerWidth < 768) {
      showExitModal();
    }
  }, 30000);

  function showExitModal() {
    shown = true;
    sessionStorage.setItem('hp26_exit_shown', '1');
    document.getElementById('exitModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    clearTimeout(mobileTimer);
  }
}

function closeExitModal() {
  document.getElementById('exitModal').classList.remove('active');
  if (!document.getElementById('buyModal').classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

// -----------------------------------------------------------
// TEXT SCRAMBLE EFFECT (signature detail — city names "decrypt")
// -----------------------------------------------------------
function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const finalText = el.dataset.scramble;
    let frame = 0;
    let interval = null;
    const card = el.closest('.city-card');

    function scramble() {
      let output = '';
      const revealCount = Math.floor((frame / 18) * finalText.length);
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealCount) output += finalText[i];
        else if (finalText[i] === ' ') output += ' ';
        else output += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = output;
      frame++;
      if (frame > 18) {
        clearInterval(interval);
        el.textContent = finalText;
      }
    }

    if (card) {
      card.addEventListener('mouseenter', () => {
        clearInterval(interval);
        frame = 0;
        interval = setInterval(scramble, 40);
      });
    }
  });
}

// -----------------------------------------------------------
// SUPABASE — optional backend for storing registrations
// -----------------------------------------------------------
let supabaseClient = null;

function initSupabase() {
  const { url, anonKey } = CONFIG.supabase;
  const isConfigured = url !== 'YOUR_SUPABASE_PROJECT_URL' && anonKey !== 'YOUR_SUPABASE_ANON_KEY';

  if (!isConfigured) return; // Not set up yet — form will just use localStorage.

  if (!window.supabase) {
    console.warn(
      'Supabase config found in CONFIG, but the supabase-js library is not loaded. ' +
      'Uncomment the <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2..."> tag in index.html.'
    );
    return;
  }

  supabaseClient = window.supabase.createClient(url, anonKey);
}

// Saves a registration to Supabase (if connected) and always caches a local
// copy so success.html can render a booking summary even without a backend.
async function saveRegistration(data) {
  try {
    localStorage.setItem('hp26_registration', JSON.stringify(data));
    const history = JSON.parse(localStorage.getItem('hp26_registrations') || '[]');
    history.push(data);
    localStorage.setItem('hp26_registrations', JSON.stringify(history));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }

  if (!supabaseClient) return { ok: true, backend: 'localStorage-only' };

  try {
    const { error } = await supabaseClient.from(CONFIG.supabase.table).insert([{
      full_name: data.fullName,
      city: data.city,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      current_location: data.currentLocation,
      message: data.message,
      agreed_to_terms: data.agreedToTerms,
      source: data.source,
      amount: data.amount,
      currency: data.currency,
      submitted_at: data.submittedAt,
    }]);

    if (error) {
      console.error('Supabase insert failed:', error);
      return { ok: false, backend: 'supabase', error };
    }
    return { ok: true, backend: 'supabase' };
  } catch (err) {
    console.error('Supabase insert threw an error:', err);
    return { ok: false, backend: 'supabase', error: err };
  }
}

// -----------------------------------------------------------
// BUY PASS MODAL — open/close
// -----------------------------------------------------------
let lastCtaSource = 'unknown';

function openBuyModal(source) {
  lastCtaSource = source || 'unknown';
  const modal = document.getElementById('buyModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const firstInput = document.getElementById('fullName');
  setTimeout(() => firstInput && firstInput.focus(), 300);
}

function closeBuyModal() {
  document.getElementById('buyModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click / Escape key
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

// -----------------------------------------------------------
// BUY FORM — validation + submit → localStorage → Razorpay
// -----------------------------------------------------------
function initBuyForm() {
  const form = document.getElementById('buyForm');
  if (!form) return;

  const validators = {
    fullName: (v) => v.trim().length >= 3 || 'Please enter your full name (min 3 characters).',
    city: (v) => v !== '' || 'Please select your city.',
    phone: (v) => /^[6-9]\d{9}$/.test(v.trim()) || 'Enter a valid 10-digit Indian mobile number.',
    whatsapp: (v) => /^[6-9]\d{9}$/.test(v.trim()) || 'Enter a valid 10-digit WhatsApp number.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    currentLocation: (v) => v.trim().length >= 2 || 'Please tell us your current location.',
    agreeTerms: (v, el) => el.checked || 'You must agree to the Terms & Privacy Policy to continue.',
  };

  function showError(name, message) {
    const field = form.querySelector(`[name="${name}"]`);
    const wrapper = field.closest('.form-field') || field.closest('.checkbox-field').parentElement;
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (wrapper && wrapper.classList) wrapper.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(name) {
    const field = form.querySelector(`[name="${name}"]`);
    const wrapper = field.closest('.form-field') || field.closest('.checkbox-field').parentElement;
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (wrapper && wrapper.classList) wrapper.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(name) {
    const field = form.querySelector(`[name="${name}"]`);
    const value = field.type === 'checkbox' ? field.checked : field.value;
    const result = validators[name](value, field);
    if (result === true) {
      clearError(name);
      return true;
    } else {
      showError(name, result);
      return false;
    }
  }

  // Live validation on blur/change
  Object.keys(validators).forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener(field.type === 'checkbox' ? 'change' : 'blur', () => validateField(name));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(validators).forEach(name => {
      if (!validateField(name)) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = form.querySelector('.invalid input, .invalid select, .form-error:not(:empty)');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Gather data
    const data = {
      fullName: form.fullName.value.trim(),
      city: form.city.value,
      phone: form.phone.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      email: form.email.value.trim(),
      currentLocation: form.currentLocation.value.trim(),
      message: form.message.value.trim(),
      agreedToTerms: form.agreeTerms.checked,
      source: lastCtaSource,
      amount: 399,
      currency: 'INR',
      submittedAt: new Date().toISOString(),
    };

    // Disable the submit button while we save, so it can't be double-clicked
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }

    await saveRegistration(data);

    proceedToPayment();
  });
}

// -----------------------------------------------------------
// PAYMENT HANDOFF (Razorpay)
// -----------------------------------------------------------
function proceedToPayment() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    // ⚠️ Replace CONFIG.razorpayPaymentLink at the top of this file with your
    // real Razorpay Payment Link. See README.md for step-by-step instructions.
    window.location.href = CONFIG.razorpayPaymentLink;
  }, 1400);
}

// -----------------------------------------------------------
// LEGAL MODAL (Privacy Policy / Terms)
// -----------------------------------------------------------
const LEGAL_CONTENT = {
  privacy: `
    <h4>Privacy Policy</h4>
    <p>This policy explains how House Party 2026 collects and uses your information when you register for a pass.</p>
    <h5>What we collect</h5>
    <ul>
      <li>Full name, city, phone &amp; WhatsApp number, email address, and current location.</li>
      <li>Any optional message you choose to share with us.</li>
    </ul>
    <h5>How we use it</h5>
    <ul>
      <li>To confirm your pass and process payment via Razorpay.</li>
      <li>To send your pass and the secret venue address by email and WhatsApp.</li>
      <li>To share important event updates (timing changes, entry instructions).</li>
    </ul>
    <h5>What we don't do</h5>
    <p>We never sell or rent your information to third parties. Your details are used only for ticketing and event communication, in line with applicable data protection law.</p>
    <h5>Data retention</h5>
    <p>Registration data is retained only as long as needed for the event and basic record-keeping, after which it is deleted on request.</p>
    <h5>Your rights</h5>
    <p>You can request access to, correction of, or deletion of your data at any time by contacting us via WhatsApp or email.</p>
  `,
  terms: `
    <h4>Terms &amp; Conditions</h4>
    <h5>Passes</h5>
    <ul>
      <li>Each pass is valid for one person, for the city selected at the time of purchase.</li>
      <li>Passes are non-transferable except as permitted in our FAQ (up to 48 hours before the event).</li>
      <li>Entry is strictly pass-holders only — no spot entry is available.</li>
    </ul>
    <h5>Payments</h5>
    <ul>
      <li>All payments are processed securely via Razorpay.</li>
      <li>Passes are non-refundable once purchased, except if the event is cancelled or rescheduled by the organizers.</li>
    </ul>
    <h5>Venue disclosure</h5>
    <p>The exact venue address is confidential and will be shared only with confirmed, paid guests closer to the event date.</p>
    <h5>Conduct</h5>
    <p>Organizers reserve the right to refuse entry to anyone behaving inappropriately or posing a safety risk, without refund.</p>
    <h5>Liability</h5>
    <p>Guests attend at their own risk. Organizers are not liable for personal injury, loss, or damage except where required by law.</p>
  `,
};

function openLegalModal(type) {
  const content = LEGAL_CONTENT[type];
  if (!content) return;
  document.getElementById('legalContent').innerHTML = content;
  const modal = document.getElementById('legalModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
  document.getElementById('legalModal').classList.remove('active');
  if (!document.getElementById('buyModal').classList.contains('active') &&
      !document.getElementById('exitModal').classList.contains('active')) {
    document.body.style.overflow = '';
  }
}
