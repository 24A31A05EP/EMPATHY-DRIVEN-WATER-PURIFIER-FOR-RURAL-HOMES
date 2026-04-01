/* ============================================
   MAIN.JS - Landing Page JavaScript
   AquaPure | Rural Water Purifier Platform
   ============================================ */

'use strict';

// ============================================
// NAVBAR – Scroll & Hamburger Toggle
// ============================================

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const overlay   = document.getElementById('overlay');

/** Adds/removes .scrolled class based on scroll position */
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/** Opens the mobile navigation drawer */
function openMobileNav() {
  mobileNav.classList.add('open');
  overlay.classList.add('show');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

/** Closes the mobile navigation drawer */
function closeMobileNav() {
  mobileNav.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Event Listeners
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run on load

hamburger.addEventListener('click', () => {
  if (mobileNav.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

overlay.addEventListener('click', closeMobileNav);

// Close mobile nav when a link is clicked
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

// ============================================
// SCROLL ANIMATION (Intersection Observer)
// ============================================

const animatedEls = document.querySelectorAll('.animate-on-scroll');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Staggered delay for sibling elements
      const delay = (entry.target.dataset.delay || 0) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add staggered delays to grid children
document.querySelectorAll('.services-grid .animate-on-scroll').forEach((el, i) => {
  el.dataset.delay = i;
});
document.querySelectorAll('.why-grid .animate-on-scroll').forEach((el, i) => {
  el.dataset.delay = i;
});

animatedEls.forEach(el => scrollObserver.observe(el));

// ============================================
// CONTACT FORM – Validation & Submission
// ============================================

const contactForm    = document.getElementById('contact-form');
const formSuccessMsg = document.getElementById('form-success-msg');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const phone   = document.getElementById('contact-phone').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const service = document.getElementById('contact-service').value;
    const btn     = document.getElementById('contact-submit-btn');

    // Basic validation
    if (!name || name.length < 2) {
      showFieldError('contact-name', 'Please enter your full name.');
      return;
    }
    if (!isValidPhone(phone)) {
      showFieldError('contact-phone', 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isValidEmail(email)) {
      showFieldError('contact-email', 'Please enter a valid email address.');
      return;
    }
    if (!service) {
      alert('Please select a service type.');
      return;
    }

    // Simulate submission
    btn.disabled = true;
    btn.textContent = 'Sending...';

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccessMsg) {
        formSuccessMsg.style.display = 'block';
      }
      btn.disabled = false;
      btn.textContent = 'Send Message 📨';

      // Save to localStorage (optional)
      const inquiry = { name, email, phone, service, date: new Date().toLocaleDateString() };
      const existing = JSON.parse(localStorage.getItem('aquapure_inquiries') || '[]');
      existing.push(inquiry);
      localStorage.setItem('aquapure_inquiries', JSON.stringify(existing));
    }, 1200);
  });
}

/** Briefly highlights an invalid field */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '#ef4444';
  field.focus();
  field.setAttribute('aria-invalid', 'true');
  setTimeout(() => {
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
  }, 2500);
  // Optionally show a tooltip-style alert
  alert(message);
}

// ============================================
// HELPER: Validators
// ============================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\+]?[\d\s\-]{10,15}$/.test(phone);
}

// ============================================
// NAV: Auth-aware button labels
// ============================================

(function updateNavAuthState() {
  const loggedInUser = localStorage.getItem('aquapure_logged_in');
  const navLoginBtn    = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');

  if (loggedInUser && navLoginBtn && navRegisterBtn) {
    const user = JSON.parse(loggedInUser);
    navLoginBtn.textContent = '👤 ' + (user.name.split(' ')[0] || 'My Account');
    navLoginBtn.href = 'dashboard.html';
    navRegisterBtn.textContent = 'Dashboard →';
    navRegisterBtn.href = 'dashboard.html';
  }
})();

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const suffix = el.dataset.suffix || '';
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

// Observe hero stats
const heroStats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent;
      const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '').replace(',', '').replace('.','');
      el.dataset.suffix = suffix;
      animateCounter(el, num);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

heroStats.forEach(el => statsObserver.observe(el));

// ============================================
// SERVICE CARDS – Keyboard Accessibility
// ============================================

document.querySelectorAll('.service-card[tabindex]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.querySelector('a')?.click();
    }
  });
});

console.log('%c💧 AquaPure Main JS Loaded', 'color:#0077b6; font-weight:bold; font-size:14px;');
