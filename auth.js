function getUsers() {
  var raw = localStorage.getItem("ecomarket_users");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveUser(user) {
  var users = getUsers();
  users.push(user);
  localStorage.setItem("ecomarket_users", JSON.stringify(users));
}

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

function clearSession() {
  localStorage.removeItem("ecomarket_session");
  localStorage.removeItem("ecomarket_loggedIn");
  sessionStorage.removeItem("ecomarket_session");
  sessionStorage.removeItem("ecomarket_loggedIn");
}

function isLoggedIn() {
  return (
    localStorage.getItem("ecomarket_loggedIn") === "true" ||
    sessionStorage.getItem("ecomarket_loggedIn") === "true"
  );
}

function isNotEmpty(value) {
  return value.trim().length > 0;
}

function isValidName(value) {
  return value.trim().length >= 2;
}

function isValidPasswordLength(value) {
  return value.length >= 8;
}

function isTermsAccepted(checkbox) {
  return checkbox.checked === true;
}

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

function clearFieldError(inputEl) {
  var container = inputEl.closest(".input-group") || inputEl.closest(".terms-group");
  if (!container) return;

  var existing = container.querySelector(".field-error");
  if (existing) existing.remove();
  inputEl.classList.remove("input-invalid");
}

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

function clearFormBanner(form) {
  var existing = form.querySelector(".form-banner");
  if (existing) existing.remove();
}

function initLogin() {
  var form = document.querySelector(".auth-form");
  if (!form) return;

  var emailInput    = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var rememberBox   = document.getElementById("remember-me");

  if (!emailInput || !passwordInput) return;

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

    var email    = emailInput.value.trim();
    var password = passwordInput.value;
    var valid    = true;

    if (!isNotEmpty(email)) {
      showFieldError(emailInput, "Email address is required.");
      valid = false;
    } else if (!email.toLowerCase().endsWith("@gmail.com")) {
      showFieldError(emailInput, "Please enter a valid @gmail.com address.");
      valid = false;
    }

    if (!isNotEmpty(password)) {
      showFieldError(passwordInput, "Password is required.");
      valid = false;
    }

    if (!valid) return;

    var remember = rememberBox && rememberBox.checked;
    
    setSession({ name: "EcoShop User", email: email }, remember);

    showFormBanner(form, "Login successful! Redirecting to Home…", "success");

    setTimeout(function () {
      window.location.href = "home.html";
    }, 1300);
  });
}

function initRegister() {
  var form = document.querySelector(".auth-form");
  if (!form) return;

  var nameInput     = document.getElementById("fullname");
  var emailInput    = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var termsBox      = document.getElementById("privacy-policy");

  if (!nameInput || !emailInput || !passwordInput || !termsBox) return;

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
    var email    = emailInput.value.trim();
    var password = passwordInput.value;
    var valid    = true;

    if (!isNotEmpty(name)) {
      showFieldError(nameInput, "Full name is required.");
      valid = false;
    } else if (!isValidName(name)) {
      showFieldError(nameInput, "Please enter your full name (at least 2 characters).");
      valid = false;
    }

    if (!isNotEmpty(email)) {
      showFieldError(emailInput, "Email address is required.");
      valid = false;
    } else if (!email.toLowerCase().endsWith("@gmail.com")) {
      showFieldError(emailInput, "Registration requires a @gmail.com address.");
      valid = false;
    }

    if (!isNotEmpty(password)) {
      showFieldError(passwordInput, "Password is required.");
      valid = false;
    } else if (!isValidPasswordLength(password)) {
      showFieldError(passwordInput, "Password must be at least 8 characters long.");
      valid = false;
    }

    if (!isTermsAccepted(termsBox)) {
      showFieldError(termsBox, "You must accept the Terms of Service and Privacy Policy.");
      valid = false;
    }

    if (!valid) return;

    var newUser = {
      name:     name.trim(),
      email:    email.toLowerCase(),
      password: password,
    };
    saveUser(newUser);
    
    setSession(newUser, false);

    showFormBanner(form, "Account created! Redirecting to Home…", "success");

    setTimeout(function () {
      window.location.href = "home.html"; 
    }, 1500);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("fullname")) {
    initRegister();
  } else if (document.getElementById("email") && document.getElementById("password")) {
    initLogin();
  }
});