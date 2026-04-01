/* ============================================
   SERVICES.JS – Services Page JavaScript
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
// SMOOTH SCROLLING (for anchor links on page)
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
  threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = (entry.target.dataset.delay || 0) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Stagger service cards
document.querySelectorAll('.services-grid-full .animate-on-scroll').forEach((el, i) => {
  el.dataset.delay = i;
});

// Stagger step cards
document.querySelectorAll('.steps-grid .step-card').forEach((el, i) => {
  el.classList.add('animate-on-scroll');
  el.dataset.delay = i;
});

animatedEls.forEach(el => scrollObserver.observe(el));

// Re-observe dynamically added animate-on-scroll elements (step cards)
document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

// ============================================
// FAQ ACCORDION – Close others on open
// ============================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => {
        if (other !== item && other.open) {
          other.removeAttribute('open');
        }
      });
    }
  });
});

// ============================================
// SERVICE CARDS – Keyboard Accessibility
// ============================================

document.querySelectorAll('.service-card-full[tabindex]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.querySelector('.svc-cta-btn')?.click();
    }
  });
});

// ============================================
// NAV: Auth-aware button labels
// ============================================

(function updateNavAuthState() {
  const loggedInUser  = localStorage.getItem('aquapure_logged_in');
  const navLoginBtn   = document.getElementById('nav-login-btn');
  const navRegisterBtn = document.getElementById('nav-register-btn');

  if (loggedInUser && navLoginBtn && navRegisterBtn) {
    try {
      const user = JSON.parse(loggedInUser);
      navLoginBtn.textContent = '👤 ' + (user.name?.split(' ')[0] || 'My Account');
      navLoginBtn.href = 'dashboard.html';
      navRegisterBtn.textContent = 'Dashboard →';
      navRegisterBtn.href = 'dashboard.html';
    } catch (err) {
      // Ignore parse errors gracefully
    }
  }
})();

// ============================================
// NAVBAR: Stays scrolled on this page (no hero behind)
// ============================================

// Force scrolled state immediately on services page so navbar is visible on bg-light hero
setTimeout(() => {
  if (window.scrollY === 0) {
    // Still add scrolled class for brand visibility when at top
    // (hero has dark background so keep white text; just ensure no issues)
  }
}, 0);

console.log('%c💧 AquaPure Services JS Loaded', 'color:#0077b6; font-weight:bold; font-size:14px;');
