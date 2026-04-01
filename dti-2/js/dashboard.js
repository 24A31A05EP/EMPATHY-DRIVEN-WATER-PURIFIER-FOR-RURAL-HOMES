/* ============================================
   DASHBOARD.JS - Dashboard Page JavaScript
   AquaPure | Rural Water Purifier Platform
   ============================================ */

'use strict';

// ============================================
// AUTH GUARD – Redirect if not logged in
// ============================================

const loggedInData = localStorage.getItem('aquapure_logged_in');

if (!loggedInData) {
  // Not logged in – redirect to login
  window.location.href = 'login.html';
}

const currentUser = JSON.parse(loggedInData || '{}');

// ============================================
// POPULATE USER INFO
// ============================================

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

function populateUserInfo() {
  const name = currentUser.name || 'User';
  const email = currentUser.email || '–';
  const phone = currentUser.phone || '–';
  const joined = currentUser.joined || 'Recently';
  const initials = getInitials(name);

  // Sidebar
  const sidebarUsername = document.getElementById('sidebar-username');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  if (sidebarUsername) sidebarUsername.textContent = name.split(' ')[0];
  if (sidebarAvatar) sidebarAvatar.textContent = initials;

  // Header
  const headerUsername = document.getElementById('header-username');
  const headerAvatar = document.getElementById('header-avatar');
  if (headerUsername) headerUsername.textContent = name.split(' ')[0];
  if (headerAvatar) headerAvatar.textContent = initials;

  // Welcome banner
  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName) welcomeName.textContent = name.split(' ')[0];

  // Profile card
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  const profileJoined = document.getElementById('profile-joined');
  const profileAvatar = document.getElementById('profile-avatar');

  if (profileName) profileName.textContent = name;
  if (profileEmail) profileEmail.textContent = email;
  if (profilePhone) profilePhone.textContent = phone;
  if (profileJoined) profileJoined.textContent = joined;
  if (profileAvatar) profileAvatar.textContent = initials;
}

populateUserInfo();

// ============================================
// SIDEBAR TOGGLE (Mobile)
// ============================================

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove('open');
    }
  });
}

// ============================================
// PANEL SWITCHING – Core Tab System
// ============================================

/** Map of sidebar link IDs → { panelId, breadcrumb } */
const NAV_MAP = {
  'nav-overview':       { panel: 'panel-overview',       crumb: 'Overview' },
  'nav-services-link':  { panel: 'panel-services',       crumb: 'My Services' },
  'nav-book':           { panel: null,                   crumb: null },   // opens modal instead
  'nav-history':        { panel: 'panel-history',        crumb: 'Service History' },
  'nav-profile':        { panel: 'panel-profile',        crumb: 'My Profile' },
  'nav-notifications':  { panel: 'panel-notifications',  crumb: 'Notifications' },
};

const breadcrumbEl = document.querySelector('.dash-breadcrumb span');

/** Show a panel and hide all others */
function showPanel(panelId) {
  document.querySelectorAll('.dash-panel').forEach(p => {
    p.style.display = p.id === panelId ? '' : 'none';
  });
}

/** Activate a sidebar link by ID and switch to its panel */
function activateNav(linkId) {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(l => l.classList.remove('active'));

  const linkEl = document.getElementById(linkId);
  if (linkEl) linkEl.classList.add('active');

  const conf = NAV_MAP[linkId];
  if (!conf) return;

  if (conf.panel) {
    showPanel(conf.panel);
    if (breadcrumbEl) breadcrumbEl.textContent = conf.crumb;

    // Populate dynamic panels on demand
    if (conf.panel === 'panel-history') renderHistory();
    if (conf.panel === 'panel-profile') renderProfilePanel();
    if (conf.panel === 'panel-notifications') renderNotifications();
  }

  // Close mobile sidebar
  if (sidebar) sidebar.classList.remove('open');
}

// Wire up all sidebar links
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const linkId = this.id;

    if (linkId === 'nav-book') {
      // Special case: just open the modal
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      openBookingModal('');
      if (sidebar) sidebar.classList.remove('open');
    } else {
      activateNav(linkId);
    }
  });
});

// ============================================
// RENDER: SERVICE HISTORY PANEL
// ============================================

function renderHistory() {
  const listEl = document.getElementById('history-list');
  if (!listEl) return;

  const bookings = JSON.parse(localStorage.getItem('aquapure_bookings') || '[]');
  const myBookings = bookings.filter(b => b.userId === currentUser.id).reverse();

  if (myBookings.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:40px 0;color:var(--text-light);">
        <div style="font-size:2.5rem;margin-bottom:12px;">📋</div>
        <p style="font-size:1rem;font-weight:600;">No bookings yet</p>
        <p style="font-size:0.85rem;margin-top:6px;">Your service bookings will appear here once confirmed.</p>
      </div>`;
    return;
  }

  const statusColor = { Confirmed: '#059669', Pending: '#d97706', Cancelled: '#dc2626' };

  listEl.innerHTML = myBookings.map(b => `
    <div class="service-item">
      <div class="service-item-icon si-blue" style="font-size:1rem;">📅</div>
      <div class="service-item-info">
        <div class="service-item-name">${b.service}</div>
        <div class="service-item-desc">${formatDate(b.date)} · ${b.time || ''} · ${b.address || ''}</div>
      </div>
      <span style="font-size:0.78rem;font-weight:700;padding:4px 12px;border-radius:50px;background:${(statusColor[b.status] || '#aaa')}22;color:${statusColor[b.status] || '#888'};">
        ${b.status || 'Confirmed'}
      </span>
    </div>
  `).join('');
}

// Refresh history button
document.addEventListener('click', (e) => {
  if (e.target.id === 'refresh-history-btn') renderHistory();
});

// ============================================
// RENDER: FULL PROFILE PANEL
// ============================================

function renderProfilePanel() {
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '–'; };
  const name    = currentUser.name  || '–';
  const email   = currentUser.email || '–';
  const phone   = currentUser.phone || '–';
  const joined  = currentUser.joined || 'Recently';
  const initials = getInitials(name);

  setEl('profile-avatar-full', initials);
  setEl('profile-name-full',   name);
  setEl('profile-email-full',  email);
  setEl('profile-phone-full',  phone);
  setEl('profile-joined-full', joined);
  setEl('settings-name',  name);
  setEl('settings-email', email);
  setEl('settings-phone', phone);
}

// Change password (placeholder)
document.addEventListener('click', (e) => {
  if (e.target.id === 'change-password-btn') {
    showToast('Password change feature coming soon! 🚧');
  }
});

// Logout from profile panel
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-profile-btn') {
    const confirmed = confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    localStorage.removeItem('aquapure_logged_in');
    showToast('Signed out successfully 👋', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1400);
  }
});

// ============================================
// RENDER: NOTIFICATIONS PANEL
// ============================================

function renderNotifications() {
  const listEl = document.getElementById('notifications-list');
  if (!listEl) return;

  const bookings = JSON.parse(localStorage.getItem('aquapure_bookings') || '[]');
  const myBookings = bookings.filter(b => b.userId === currentUser.id).reverse();

  const staticNotifs = [
    { icon: '💧', title: 'Filter Change Reminder', desc: 'Your filter is due for replacement in 45 days.', time: '2 days ago' },
    { icon: '⭐', title: 'Rate Your Last Service', desc: 'How was your recent technician visit? Tap to rate.', time: '5 days ago' },
    { icon: '🎉', title: 'Welcome to AquaPure!', desc: 'Your account is verified. Enjoy clean water!', time: 'When you joined' },
  ];

  const bookingNotifs = myBookings.slice(0, 3).map(b => ({
    icon: '📅',
    title: `Booking Confirmed: ${b.service}`,
    desc: `Scheduled for ${formatDate(b.date)} at ${b.time || 'TBD'}.`,
    time: b.bookedAt || 'Recently',
  }));

  const allNotifs = [...bookingNotifs, ...staticNotifs];

  listEl.innerHTML = allNotifs.map(n => `
    <div class="service-item">
      <div class="service-item-icon" style="background:var(--light-bg);font-size:1.4rem;">${n.icon}</div>
      <div class="service-item-info">
        <div class="service-item-name">${n.title}</div>
        <div class="service-item-desc">${n.desc}</div>
      </div>
      <span style="font-size:0.73rem;color:var(--text-light);white-space:nowrap;">${n.time}</span>
    </div>
  `).join('');
}

// ============================================
// VIEW ALL SERVICES LINK → Go to Services panel
// ============================================

const viewAllServices = document.getElementById('view-all-services');
if (viewAllServices) {
  viewAllServices.addEventListener('click', (e) => {
    e.preventDefault();
    activateNav('nav-services-link');
  });
}

// Book New Service button inside Services panel
document.addEventListener('click', (e) => {
  if (e.target.id === 'book-service-panel-btn') openBookingModal('');
});

// ============================================
// EDIT PROFILE BUTTON → Go to Profile panel
// ============================================

const editProfileBtn = document.getElementById('edit-profile-btn');
if (editProfileBtn) {
  editProfileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    activateNav('nav-profile');
  });
}

// ============================================
// LOGOUT
// ============================================

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    // Confirm before logout
    const confirmed = confirm('Are you sure you want to sign out?');
    if (!confirmed) return;

    localStorage.removeItem('aquapure_logged_in');
    showToast('Signed out successfully. See you soon! 👋', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1400);
  });
}

// ============================================
// BOOKING MODAL
// ============================================

const bookingModal = document.getElementById('booking-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const bookServiceMainBtn = document.getElementById('book-service-main-btn');
const bookingForm = document.getElementById('booking-form');

/** Open the booking modal and optionally pre-select a service */
function openBookingModal(serviceName) {
  if (!bookingModal) return;

  // Set minimum date to today
  const dateInput = document.getElementById('modal-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Pre-select service if provided
  const serviceSelect = document.getElementById('modal-service');
  if (serviceSelect && serviceName) {
    for (let opt of serviceSelect.options) {
      if (opt.value === serviceName || opt.text === serviceName) {
        opt.selected = true;
        break;
      }
    }
  }

  bookingModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/** Close the booking modal */
function closeBookingModal() {
  if (!bookingModal) return;
  bookingModal.classList.remove('show');
  document.body.style.overflow = '';
}

// Event listeners for modal
if (bookServiceMainBtn) bookServiceMainBtn.addEventListener('click', () => openBookingModal(''));
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeBookingModal);

// Close on overlay click
if (bookingModal) {
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal?.classList.contains('show')) {
    closeBookingModal();
  }
});

// Make openBookingModal globally accessible (called from HTML onclick)
window.openBookingModal = openBookingModal;

// ============================================
// BOOKING FORM SUBMIT
// ============================================

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const service = document.getElementById('modal-service').value;
    const date = document.getElementById('modal-date').value;
    const time = document.getElementById('modal-time').value;
    const address = document.getElementById('modal-address').value.trim();

    if (!date) {
      showToast('Please select a preferred date.', 'error');
      return;
    }
    if (!address || address.length < 5) {
      showToast('Please enter your service address.', 'error');
      document.getElementById('modal-address').focus();
      return;
    }

    // Save booking to localStorage
    const booking = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      service,
      date,
      time,
      address,
      status: 'Confirmed',
      bookedAt: new Date().toLocaleString('en-IN')
    };

    const bookings = JSON.parse(localStorage.getItem('aquapure_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('aquapure_bookings', JSON.stringify(bookings));

    closeBookingModal();
    showToast(`✅ "${service}" booked for ${formatDate(date)}!`, 'success');

    // Reset form
    bookingForm.reset();
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast show';
  if (type === 'success') toast.classList.add('success');
  if (type === 'error') toast.classList.add('error');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ============================================
// NOTIFICATION BUTTON
// ============================================

const notifBtn = document.getElementById('notif-btn');

if (notifBtn) {
  notifBtn.addEventListener('click', () => {
    const bookings = JSON.parse(localStorage.getItem('aquapure_bookings') || '[]');
    const myBookings = bookings.filter(b => b.userId === currentUser.id);
    if (myBookings.length === 0) {
      showToast('No notifications. Book your first service!');
    } else {
      const latest = myBookings[myBookings.length - 1];
      showToast(`📅 Last booked: ${latest.service} on ${formatDate(latest.date)}`, 'success');
    }
  });
}

// ============================================
// HEADER USER CLICK – Profile overview
// ============================================

const headerUserBtn = document.getElementById('header-user-btn');

if (headerUserBtn) {
  headerUserBtn.addEventListener('click', () => {
    showToast(`Signed in as: ${currentUser.name} (${currentUser.email})`);
  });
}

// (viewAllServices, editProfileBtn, and nav-book are handled by the panel switching system above)

// ============================================
// WELCOMING GREETING BASED ON TIME
// ============================================

(function setGreeting() {
  const greetingEl = document.querySelector('.welcome-greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let emoji, text;

  if (hour < 12) {
    emoji = '🌅'; text = 'Good Morning';
  } else if (hour < 17) {
    emoji = '☀️'; text = 'Good Afternoon';
  } else if (hour < 20) {
    emoji = '🌇'; text = 'Good Evening';
  } else {
    emoji = '🌙'; text = 'Good Night';
  }

  greetingEl.textContent = `${emoji} ${text}, welcome back!`;
})();

// ============================================
// STAT COUNTER ANIMATION
// ============================================

function animateStatCounter(el, target, duration = 1200) {
  let current = 0;
  const step = target / (duration / 16);
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

// Animate stat cards on load
window.addEventListener('load', () => {
  const statVals = document.querySelectorAll('.stat-val');
  statVals.forEach(el => {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    el.dataset.suffix = suffix;
    el.textContent = '0' + suffix;
    setTimeout(() => animateStatCounter(el, parseFloat(num), 1000), 300);
  });
});

console.log('%c💧 AquaPure Dashboard JS Loaded', 'color:#0077b6; font-weight:bold; font-size:14px;');
console.log('%c👤 Logged in as: ' + (currentUser.name || 'Unknown'), 'color:#06d6a0; font-size:12px;');
