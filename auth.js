/* ============================================================
   auth.js — FontDale Authentication Module
   COMP6800 — Human and Computer Interaction

   Login Validations (no regex):
     1. Email field must not be empty
     2. Email must contain the "@" symbol
     3. Email must contain a "." after the "@"
     4. Password field must not be empty
     5. Password must be at least 8 characters long

   Register Validations (no regex):
     1. Full name must not be empty
     2. Full name must be at least 2 characters long
     3. Email must be valid (contains "@" and "." after "@")
     4. Password must be at least 8 characters long
     5. Terms & Conditions checkbox must be checked

   Storage: localStorage  (key: "fontdale_users")
   Session: localStorage  (key: "fontdale_session")
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     Utility helpers
  ---------------------------------------------------------- */

  /**
   * Read all registered users from localStorage.
   * Returns an array of { fullname, email, password } objects.
   */
  function getUsers() {
    var raw = localStorage.getItem('fontdale_users');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
  }

  /**
   * Persist the users array back to localStorage.
   */
  function saveUsers(users) {
    localStorage.setItem('fontdale_users', JSON.stringify(users));
  }

  /**
   * Start a session for a user.
   */
  function saveSession(user) {
    var session = { email: user.email, fullname: user.fullname };
    localStorage.setItem('fontdale_session', JSON.stringify(session));
  }

  /**
   * Show or hide an error message element.
   * @param {string} fieldId   – the id of the input that failed
   * @param {string} message   – error text (empty string clears error)
   */
  function setError(fieldId, message) {
    var errEl = document.getElementById(fieldId + '-error');
    var inputEl = document.getElementById(fieldId);
    if (!errEl || !inputEl) return;

    if (message) {
      errEl.textContent = message;
      errEl.style.display = 'block';
      inputEl.classList.add('input-error');
    } else {
      errEl.textContent = '';
      errEl.style.display = 'none';
      inputEl.classList.remove('input-error');
    }
  }

  /**
   * Clear all errors on a form.
   * @param {HTMLFormElement} form
   */
  function clearAllErrors(form) {
    var errors = form.querySelectorAll('.error-msg');
    errors.forEach(function (el) { el.textContent = ''; el.style.display = 'none'; });
    var inputs = form.querySelectorAll('.input-error');
    inputs.forEach(function (el) { el.classList.remove('input-error'); });
  }

  /**
   * Show a dismissable banner above the form button.
   * @param {string} bannerId – id of the <div class="auth-banner"> element
   * @param {string} type     – 'success' | 'error'
   * @param {string} text
   */
  function showBanner(bannerId, type, text) {
    var el = document.getElementById(bannerId);
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-banner auth-banner--' + type;
    el.style.display = 'block';
  }

  function hideBanner(bannerId) {
    var el = document.getElementById(bannerId);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  }


  /* ----------------------------------------------------------
     LOGIN FORM
  ---------------------------------------------------------- */
  var loginForm = document.getElementById('login-form');

  if (loginForm) {

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(loginForm);
      hideBanner('login-banner');

      var emailVal    = document.getElementById('email').value.trim();
      var passwordVal = document.getElementById('password').value;
      var valid       = true;

      /* Validation 1 — Email must not be empty */
      if (emailVal.length === 0) {
        setError('email', 'Email address is required.');
        valid = false;
      }
      /* Validation 2 — Email must contain "@" */
      else if (emailVal.indexOf('@') === -1) {
        setError('email', 'Email address must contain "@".');
        valid = false;
      }
      /* Validation 3 — Email must contain "." after "@" */
      else {
        var atPosition = emailVal.indexOf('@');
        var domainPart = emailVal.substring(atPosition + 1);
        if (domainPart.indexOf('.') === -1) {
          setError('email', 'Email address must contain a "." after "@".');
          valid = false;
        }
      }

      /* Validation 4 — Password must not be empty */
      if (passwordVal.length === 0) {
        setError('password', 'Password is required.');
        valid = false;
      }
      /* Validation 5 — Password must be at least 8 characters */
      else if (passwordVal.length < 8) {
        setError('password', 'Password must be at least 8 characters long.');
        valid = false;
      }

      if (!valid) return;

      /* Credential check against localStorage */
      var users        = getUsers();
      var emailLower   = emailVal.toLowerCase();
      var matchedUser  = null;

      for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === emailLower && users[i].password === passwordVal) {
          matchedUser = users[i];
          break;
        }
      }

      if (!matchedUser) {
        showBanner('login-banner', 'error', 'Incorrect email or password. Please try again.');
        return;
      }

      /* Successful login */
      saveSession(matchedUser);

      var submitBtn = loginForm.querySelector('.btn-submit');
      submitBtn.textContent = 'Signing in…';
      submitBtn.disabled    = true;

      showBanner('login-banner', 'success', 'Welcome back, ' + matchedUser.fullname + '! Redirecting…');

      setTimeout(function () {
        window.location.href = 'home.html';
      }, 1200);
    });

    /* Live clear on input */
    ['email', 'password'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { setError(id, ''); });
      }
    });
  }


  /* ----------------------------------------------------------
     REGISTER FORM
  ---------------------------------------------------------- */
  var registerForm = document.getElementById('register-form');

  if (registerForm) {

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(registerForm);
      hideBanner('register-banner');

      var fullnameVal  = document.getElementById('fullname').value.trim();
      var emailVal     = document.getElementById('email').value.trim();
      var passwordVal  = document.getElementById('password').value;
      var termsChecked = document.getElementById('privacy-policy').checked;
      var valid        = true;

      /* Validation 1 — Full name must not be empty */
      if (fullnameVal.length === 0) {
        setError('fullname', 'Full name is required.');
        valid = false;
      }
      /* Validation 2 — Full name must be at least 2 characters */
      else if (fullnameVal.length < 2) {
        setError('fullname', 'Full name must be at least 2 characters long.');
        valid = false;
      }

      /* Validation 3 — Email must be valid (contains "@" and "." after "@") */
      if (emailVal.length === 0) {
        setError('email', 'Email address is required.');
        valid = false;
      } else if (emailVal.indexOf('@') === -1) {
        setError('email', 'Email address must contain "@".');
        valid = false;
      } else {
        var atPos   = emailVal.indexOf('@');
        var domain  = emailVal.substring(atPos + 1);
        if (domain.indexOf('.') === -1) {
          setError('email', 'Email address must contain a "." after "@".');
          valid = false;
        }
      }

      /* Validation 4 — Password must be at least 8 characters */
      if (passwordVal.length === 0) {
        setError('password', 'Password is required.');
        valid = false;
      } else if (passwordVal.length < 8) {
        setError('password', 'Password must be at least 8 characters long.');
        valid = false;
      }

      /* Validation 5 — Terms & Conditions must be checked */
      if (!termsChecked) {
        setError('privacy-policy', 'You must agree to the Terms of Service and Privacy Policy.');
        valid = false;
      }

      if (!valid) return;

      /* Duplicate email check */
      var users      = getUsers();
      var emailLower = emailVal.toLowerCase();
      var duplicate  = false;

      for (var j = 0; j < users.length; j++) {
        if (users[j].email.toLowerCase() === emailLower) {
          duplicate = true;
          break;
        }
      }

      if (duplicate) {
        setError('email', 'An account with this email already exists.');
        return;
      }

      /* Save new user */
      var newUser = { fullname: fullnameVal, email: emailVal, password: passwordVal };
      users.push(newUser);
      saveUsers(users);

      /* Start session immediately */
      saveSession(newUser);

      var submitBtn = registerForm.querySelector('.btn-submit');
      submitBtn.textContent = 'Creating Account…';
      submitBtn.disabled    = true;

      showBanner('register-banner', 'success', 'Account created! Welcome to FontDale, ' + fullnameVal + '. Redirecting…');

      setTimeout(function () {
        window.location.href = 'home.html';
      }, 1500);
    });

    /* Live clear on input */
    ['fullname', 'email', 'password'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { setError(id, ''); });
      }
    });

    /* Live clear on checkbox change */
    var termsEl = document.getElementById('privacy-policy');
    if (termsEl) {
      termsEl.addEventListener('change', function () { setError('privacy-policy', ''); });
    }
  }

});
