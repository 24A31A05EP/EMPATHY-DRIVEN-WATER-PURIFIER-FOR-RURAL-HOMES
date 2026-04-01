/* ============================================
   AUTH.JS - Register & Login JavaScript
   AquaPure | Rural Water Purifier Platform
   ============================================ */

'use strict';

// ============================================
// HELPERS
// ============================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\+]?[\d\s\-]{10,15}$/.test(phone.trim());
}

function isValidName(name) {
  return name.trim().length >= 2;
}

/** Show/hide the error alert banner */
function showAlert(alertEl, msgEl, message, type = 'error') {
  alertEl.classList.remove('error', 'success', 'show');
  alertEl.classList.add(type, 'show');
  msgEl.textContent = message;
  // Auto-hide after 5s
  setTimeout(() => alertEl.classList.remove('show'), 5000);
}

/** Mark a field as valid/invalid visually */
function setFieldState(inputEl, msgEl, isValid, message = '') {
  inputEl.classList.remove('error', 'success-input');
  if (isValid) {
    inputEl.classList.add('success-input');
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'field-msg'; }
  } else {
    inputEl.classList.add('error');
    if (msgEl) { msgEl.textContent = message; msgEl.className = 'field-msg error'; }
  }
}

/** Password toggle (show/hide) */
function initPasswordToggle(toggleBtnId, inputId) {
  const btn = document.getElementById(toggleBtnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? '🙈' : '👁️';
    btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
}

/** Show loading spinner on button */
function setLoading(textEl, spinnerEl, isLoading, originalText = '') {
  if (isLoading) {
    textEl.style.display = 'none';
    spinnerEl.style.display = 'block';
  } else {
    textEl.style.display = 'inline';
    spinnerEl.style.display = 'none';
    if (originalText) textEl.textContent = originalText;
  }
}

// ============================================
// REGISTER PAGE
// ============================================

const registerForm = document.getElementById('register-form');

if (registerForm) {

  // Password toggles
  initPasswordToggle('toggle-reg-pass', 'reg-password');
  initPasswordToggle('toggle-confirm-pass', 'reg-confirm');

  const passInput = document.getElementById('reg-password');
  const strengthWrap = document.getElementById('password-strength');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const bar4 = document.getElementById('bar4');
  const strengthLabel = document.getElementById('strength-label');

  /** Calculate password strength (0–4) */
  function getPasswordStrength(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }

  /** Update strength bar UI */
  function updateStrengthUI(score) {
    const bars = [bar1, bar2, bar3, bar4];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const classes = ['', 'weak', 'medium', 'medium', 'strong'];

    bars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < score) bar.classList.add(classes[score]);
    });

    strengthLabel.textContent = labels[score] || 'Weak';
    strengthLabel.style.color =
      score <= 1 ? '#ef4444' :
        score === 2 ? '#ffd60a' :
          score === 3 ? '#06d6a0' : '#059669';
  }

  // Live password strength indicator
  if (passInput) {
    passInput.addEventListener('input', () => {
      const val = passInput.value;
      if (val.length > 0) {
        strengthWrap.classList.add('show');
        updateStrengthUI(getPasswordStrength(val));
      } else {
        strengthWrap.classList.remove('show');
      }
    });
  }

  // ---- REGISTER FORM SUBMIT ----
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameVal = document.getElementById('reg-name').value.trim();
    const emailVal = document.getElementById('reg-email').value.trim();
    const phoneVal = document.getElementById('reg-phone').value.trim();
    const passVal = document.getElementById('reg-password').value;
    const confirmVal = document.getElementById('reg-confirm').value;
    const termsEl = document.getElementById('reg-terms');

    const alertEl = document.getElementById('register-alert');
    const alertMsgEl = document.getElementById('register-alert-msg');
    const btnText = document.getElementById('reg-btn-text');
    const spinner = document.getElementById('reg-spinner');
    const submitBtn = document.getElementById('register-submit-btn');

    let isValid = true;

    // Validate Name
    if (!isValidName(nameVal)) {
      setFieldState(
        document.getElementById('reg-name'),
        document.getElementById('name-msg'),
        false, 'Name must be at least 2 characters.'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('reg-name'), document.getElementById('name-msg'), true);
    }

    // Validate Email
    if (!isValidEmail(emailVal)) {
      setFieldState(
        document.getElementById('reg-email'),
        document.getElementById('email-msg'),
        false, 'Enter a valid email address.'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('reg-email'), document.getElementById('email-msg'), true);
    }

    // Validate Phone
    if (!isValidPhone(phoneVal)) {
      setFieldState(
        document.getElementById('reg-phone'),
        document.getElementById('phone-msg'),
        false, 'Enter a valid phone number (10+ digits).'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('reg-phone'), document.getElementById('phone-msg'), true);
    }

    // Validate Password strength
    if (passVal.length < 6) {
      setFieldState(
        document.getElementById('reg-password'),
        document.getElementById('pass-msg'),
        false, 'Password must be at least 6 characters.'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('reg-password'), document.getElementById('pass-msg'), true);
    }

    // Validate Confirm Password
    if (passVal !== confirmVal) {
      setFieldState(
        document.getElementById('reg-confirm'),
        document.getElementById('confirm-msg'),
        false, 'Passwords do not match.'
      );
      isValid = false;
    } else if (confirmVal.length > 0) {
      setFieldState(document.getElementById('reg-confirm'), document.getElementById('confirm-msg'), true);
    }

    // Validate Terms
    if (!termsEl.checked) {
      const termsMsg = document.getElementById('terms-msg');
      termsMsg.textContent = 'You must agree to the Terms of Service.';
      termsMsg.className = 'field-msg error';
      isValid = false;
    } else {
      const termsMsg = document.getElementById('terms-msg');
      termsMsg.textContent = '';
      termsMsg.className = 'field-msg';
    }

    if (!isValid) return;

    // Check if email already registered
    const users = JSON.parse(localStorage.getItem('aquapure_users') || '[]');
    const exists = users.find(u => u.email.toLowerCase() === emailVal.toLowerCase());
    if (exists) {
      showAlert(alertEl, alertMsgEl, 'An account with this email already exists. Please sign in.');
      return;
    }

    // Simulate loading
    submitBtn.disabled = true;
    setLoading(btnText, spinner, true);

    setTimeout(() => {
      // Save user to localStorage
      const newUser = {
        id: Date.now(),
        name: nameVal,
        email: emailVal.toLowerCase(),
        phone: phoneVal,
        password: passVal, // NOTE: Plain text for demo only. Use hashing in production.
        joined: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      users.push(newUser);
      localStorage.setItem('aquapure_users', JSON.stringify(users));

      // Auto-login
      localStorage.setItem('aquapure_logged_in', JSON.stringify(newUser));

      setLoading(btnText, spinner, false, 'Create Account 🚀');
      submitBtn.disabled = false;

      showAlert(alertEl, alertMsgEl, `Welcome, ${nameVal}! Redirecting to your dashboard...`, 'success');

      // Redirect to dashboard
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    }, 1400);
  });
}

// ============================================
// LOGIN PAGE
// ============================================

const loginForm = document.getElementById('login-form');

if (loginForm) {

  // Password toggle
  initPasswordToggle('toggle-login-pass', 'login-password');

  // Redirect if already logged in
  if (localStorage.getItem('aquapure_logged_in')) {
    window.location.href = 'dashboard.html';
  }

  // ---- LOGIN FORM SUBMIT ----
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailVal = document.getElementById('login-email').value.trim();
    const passVal = document.getElementById('login-password').value;

    const alertEl = document.getElementById('login-alert');
    const alertMsgEl = document.getElementById('login-alert-msg');
    const btnText = document.getElementById('login-btn-text');
    const spinner = document.getElementById('login-spinner');
    const submitBtn = document.getElementById('login-submit-btn');

    let isValid = true;

    // Validate Email
    if (!isValidEmail(emailVal)) {
      setFieldState(
        document.getElementById('login-email'),
        document.getElementById('login-email-msg'),
        false, 'Enter a valid email address.'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('login-email'), document.getElementById('login-email-msg'), true);
    }

    // Validate Password
    if (passVal.length < 1) {
      setFieldState(
        document.getElementById('login-password'),
        document.getElementById('login-pass-msg'),
        false, 'Please enter your password.'
      );
      isValid = false;
    } else {
      setFieldState(document.getElementById('login-password'), document.getElementById('login-pass-msg'), true);
    }

    if (!isValid) return;

    // Loading
    submitBtn.disabled = true;
    setLoading(btnText, spinner, true);

    setTimeout(() => {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem('aquapure_users') || '[]');
      const user = users.find(u =>
        u.email.toLowerCase() === emailVal.toLowerCase() && u.password === passVal
      );

      if (!user) {
        setLoading(btnText, spinner, false, 'Sign In 🚀');
        submitBtn.disabled = false;

        alertEl.classList.remove('success');
        showAlert(alertEl, alertMsgEl, 'Invalid email or password. Please try again.');

        // Shake the form inputs
        ['login-email', 'login-password'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.animation = 'none';
            el.style.borderColor = '#ef4444';
            setTimeout(() => { el.style.borderColor = ''; }, 2000);
          }
        });
        return;
      }

      // Save logged-in state
      localStorage.setItem('aquapure_logged_in', JSON.stringify(user));

      setLoading(btnText, spinner, false, 'Sign In 🚀');
      submitBtn.disabled = false;

      showAlert(alertEl, alertMsgEl, `Welcome back, ${user.name.split(' ')[0]}! Redirecting...`, 'success');

      // Redirect to dashboard
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1300);
    }, 1200);
  });
}

console.log('%c💧 AquaPure Auth JS Loaded', 'color:#0077b6; font-weight:bold; font-size:14px;');
