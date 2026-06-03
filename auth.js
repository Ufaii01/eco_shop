/* ============================================================
   ECO MARKET — auth.js
   Handles Login & Register form validation and authentication.
   Storage: localStorage (users) + sessionStorage (session)
   No regex used — all validations are string-method based.
   ============================================================ */

/* ----------------------------------------------------------
   STORAGE HELPERS
   ---------------------------------------------------------- */

/**
 * Returns the full array of registered users from localStorage.
 * @returns {Array<{name: string, email: string, password: string}>}
 */
function getUsers() {
  var raw = localStorage.getItem("ecomarket_users");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Persists a new user object into localStorage.
 * @param {{name: string, email: string, password: string}} user
 */
function saveUser(user) {
  var users = getUsers();
  users.push(user);
  localStorage.setItem("ecomarket_users", JSON.stringify(users));
}

/**
 * Looks up a user by email (case-insensitive).
 * @param {string} email
 * @returns {object|undefined}
 */
function findUser(email) {
  var users = getUsers();
  var normalised = email.toLowerCase().trim();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === normalised) {
      return users[i];
    }
  }
  return undefined;
}

/**
 * Writes a session to localStorage (remember me) or sessionStorage.
 * @param {{name: string, email: string}} user
 * @param {boolean} remember
 */
function setSession(user, remember) {
  var payload = JSON.stringify({ name: user.name, email: user.email });
  if (remember) {
    localStorage.setItem("ecomarket_session", payload);
    localStorage.setItem("ecomarket_loggedIn", "true");
  } else {
    sessionStorage.setItem("ecomarket_session", payload);
    sessionStorage.setItem("ecomarket_loggedIn", "true");
  }
}

/**
 * Clears any active session from both storages.
 */
function clearSession() {
  localStorage.removeItem("ecomarket_session");
  localStorage.removeItem("ecomarket_loggedIn");
  sessionStorage.removeItem("ecomarket_session");
  sessionStorage.removeItem("ecomarket_loggedIn");
}

/**
 * Returns true if a session is currently active.
 * @returns {boolean}
 */
function isLoggedIn() {
  return (
    localStorage.getItem("ecomarket_loggedIn") === "true" ||
    sessionStorage.getItem("ecomarket_loggedIn") === "true"
  );
}


/* ----------------------------------------------------------
   VALIDATORS  (no regex — all string-method based)
   ---------------------------------------------------------- */

/**
 * Validation 1 — Field must not be empty or whitespace-only.
 * @param {string} value
 * @returns {boolean}
 */
function isNotEmpty(value) {
  return value.trim().length > 0;
}

/**
 * Validation 2 — Name must be at least 2 non-whitespace characters.
 * @param {string} value
 * @returns {boolean}
 */
function isValidName(value) {
  return value.trim().length >= 2;
}

/**
 * Validation 3 — Email must contain exactly one '@' with content on
 * both sides, and at least one '.' after the '@' that is not the
 * last character.  No regex used.
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  var str = value.trim();
  var atIndex = str.indexOf("@");

  // Must have '@' and at least one character before it
  if (atIndex < 1) return false;

  // Must not have a second '@'
  if (str.indexOf("@", atIndex + 1) !== -1) return false;

  var domain = str.slice(atIndex + 1);

  // Domain must exist and contain a '.'
  if (domain.length < 3) return false;
  var dotIndex = domain.lastIndexOf(".");
  if (dotIndex < 1) return false;

  // '.' must not be the last character
  if (dotIndex === domain.length - 1) return false;

  return true;
}

/**
 * Validation 4 — Password must be at least 8 characters.
 * @param {string} value
 * @returns {boolean}
 */
function isValidPasswordLength(value) {
  return value.length >= 8;
}

/**
 * Validation 5 (register) — Terms checkbox must be checked.
 * @param {HTMLInputElement} checkbox
 * @returns {boolean}
 */
function isTermsAccepted(checkbox) {
  return checkbox.checked === true;
}


/* ----------------------------------------------------------
   ERROR / SUCCESS UI HELPERS
   ---------------------------------------------------------- */

/**
 * Attaches an inline error message below a field's container.
 * @param {HTMLElement} inputEl   The input or checkbox element.
 * @param {string}      message   Error text to display.
 */
function showFieldError(inputEl, message) {
  clearFieldError(inputEl);
  var container = inputEl.closest(".input-group") || inputEl.closest(".terms-group");
  if (!container) return;

  var span = document.createElement("span");
  span.className = "field-error";
  span.setAttribute("role", "alert");
  span.textContent = message;
  container.appendChild(span);

  inputEl.classList.add("input-invalid");
}

/**
 * Removes any existing inline error for an input.
 * @param {HTMLElement} inputEl
 */
function clearFieldError(inputEl) {
  var container = inputEl.closest(".input-group") || inputEl.closest(".terms-group");
  if (!container) return;

  var existing = container.querySelector(".field-error");
  if (existing) existing.remove();
  inputEl.classList.remove("input-invalid");
}

/**
 * Shows a top-level form banner (success or error).
 * @param {HTMLElement} form
 * @param {string}      message
 * @param {"success"|"error"} type
 */
function showFormBanner(form, message, type) {
  var existing = form.querySelector(".form-banner");
  if (existing) existing.remove();

  var banner = document.createElement("div");
  banner.className = "form-banner form-banner--" + type;
  banner.setAttribute("role", "alert");
  banner.textContent = message;

  var submitBtn = form.querySelector(".btn-submit");
  form.insertBefore(banner, submitBtn);
}

/**
 * Removes the top-level form banner.
 * @param {HTMLElement} form
 */
function clearFormBanner(form) {
  var existing = form.querySelector(".form-banner");
  if (existing) existing.remove();
}


/* ----------------------------------------------------------
   LOGIN PAGE  —  5 Validations
   ---------------------------------------------------------- */

function initLogin() {
  var form = document.querySelector(".auth-form");
  if (!form) return;

  var emailInput    = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var rememberBox   = document.getElementById("remember-me");

  if (!emailInput || !passwordInput) return;

  // Clear field errors live as the user types
  emailInput.addEventListener("input", function () {
    clearFieldError(emailInput);
    clearFormBanner(form);
  });
  passwordInput.addEventListener("input", function () {
    clearFieldError(passwordInput);
    clearFormBanner(form);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormBanner(form);

    var email    = emailInput.value;
    var password = passwordInput.value;
    var valid    = true;

    /* --- Validation 1: Email must not be empty --- */
    if (!isNotEmpty(email)) {
      showFieldError(emailInput, "Email address is required.");
      valid = false;
    }
    /* --- Validation 2: Email must be properly formatted --- */
    else if (!isValidEmail(email)) {
      showFieldError(emailInput, "Please enter a valid email address (e.g. name@domain.com).");
      valid = false;
    }

    /* --- Validation 3: Password must not be empty --- */
    if (!isNotEmpty(password)) {
      showFieldError(passwordInput, "Password is required.");
      valid = false;
    }
    /* --- Validation 4: Password must be at least 8 characters --- */
    else if (!isValidPasswordLength(password)) {
      showFieldError(passwordInput, "Password must be at least 8 characters long.");
      valid = false;
    }

    if (!valid) return;

    /* --- Validation 5: Credentials must match a registered account --- */
    var user = findUser(email);
    if (!user || user.password !== password) {
      showFormBanner(form, "Incorrect email or password. Please try again.", "error");
      return;
    }

    // ✓ All validations passed — create session and redirect
    var remember = rememberBox && rememberBox.checked;
    setSession(user, remember);

    showFormBanner(form, "Login successful! Redirecting…", "success");

    setTimeout(function () {
      window.location.href = "home.html";
    }, 1300);
  });
}


/* ----------------------------------------------------------
   REGISTER PAGE  —  5 Validations
   ---------------------------------------------------------- */

function initRegister() {
  var form = document.querySelector(".auth-form");
  if (!form) return;

  var nameInput     = document.getElementById("fullname");
  var emailInput    = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var termsBox      = document.getElementById("privacy-policy");

  if (!nameInput || !emailInput || !passwordInput || !termsBox) return;

  // Clear field errors live as the user types
  [nameInput, emailInput, passwordInput].forEach(function (input) {
    input.addEventListener("input", function () {
      clearFieldError(input);
      clearFormBanner(form);
    });
  });
  termsBox.addEventListener("change", function () {
    clearFieldError(termsBox);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormBanner(form);

    var name     = nameInput.value;
    var email    = emailInput.value;
    var password = passwordInput.value;
    var valid    = true;

    /* --- Validation 1: Full name must be at least 2 characters --- */
    if (!isNotEmpty(name)) {
      showFieldError(nameInput, "Full name is required.");
      valid = false;
    } else if (!isValidName(name)) {
      showFieldError(nameInput, "Please enter your full name (at least 2 characters).");
      valid = false;
    }

    /* --- Validation 2: Email must be properly formatted --- */
    if (!isNotEmpty(email)) {
      showFieldError(emailInput, "Email address is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, "Please enter a valid email address (e.g. name@domain.com).");
      valid = false;
    }
    /* --- Validation 3: Email must not already be registered --- */
    else if (findUser(email)) {
      showFieldError(emailInput, "An account with this email already exists. Try logging in.");
      valid = false;
    }

    /* --- Validation 4: Password must be at least 8 characters --- */
    if (!isNotEmpty(password)) {
      showFieldError(passwordInput, "Password is required.");
      valid = false;
    } else if (!isValidPasswordLength(password)) {
      showFieldError(passwordInput, "Password must be at least 8 characters long.");
      valid = false;
    }

    /* --- Validation 5: Terms of Service checkbox must be checked --- */
    if (!isTermsAccepted(termsBox)) {
      showFieldError(termsBox, "You must accept the Terms of Service and Privacy Policy.");
      valid = false;
    }

    if (!valid) return;

    // ✓ All validations passed — save user and redirect to login
    saveUser({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: password,
    });

    showFormBanner(form, "Account created! Redirecting to login…", "success");

    setTimeout(function () {
      window.location.href = "Login.HTML";
    }, 1500);
  });
}


/* ----------------------------------------------------------
   BOOTSTRAP — detect page and initialise correct flow
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  // Register page has a 'fullname' field; login page does not.
  if (document.getElementById("fullname")) {
    initRegister();
  } else if (document.getElementById("email") && document.getElementById("password")) {
    initLogin();
  }
});
