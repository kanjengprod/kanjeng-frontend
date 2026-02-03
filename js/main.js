/**
 * ============================================
 * 🏆 UNTUNG BERSAMA - MAIN JAVASCRIPT
 * Simple Version (No SweetAlert2)
 * ============================================
 */

console.log('🚀 Untung Bersama System - Loaded');

// ================================
// CONFIG
// ================================
// Pakai domain utama (lebih aman dari CORS & deploy)
const API_URL = "https://untungbersama.us";

// ================================
// LOGIN
// ================================
async function loginUser(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const loginId = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const message = document.getElementById("loginMessage");

  if (!loginId || !password) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Username/Email dan password wajib diisi";
      message.style.display = "block";
    }
    return false;
  }

  if (message) {
    message.style.color = "#555";
    message.textContent = "Memproses login...";
    message.style.display = "block";
  }

  // Show loading spinner
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "block";

  // Disable button
  const btn = document.getElementById("loginBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "MEMVERIFIKASI...";
  }

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: loginId,  // bisa username atau email
        password: password 
      })
    });

    const data = await res.json();

    if (data.success) {
      if (message) {
        message.style.color = "green";
        message.textContent = "Login berhasil! Mengalihkan...";
      }

      // Simpan token jika ada
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      setTimeout(() => {
        // Redirect ke URL yang diberikan server atau ke root
        window.location.href = data.redirectUrl || "/";
      }, 1200);
    } else {
      if (message) {
        message.style.color = "red";
        message.textContent = data.message || "Login gagal";
      }

      // Re-enable button
      if (btn) {
        btn.disabled = false;
        btn.textContent = "MASUK SEKARANG";
      }
      if (spinner) spinner.style.display = "none";
    }
  } catch (err) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Terjadi kesalahan jaringan";
    }
    console.error("LOGIN ERROR:", err);

    // Re-enable button
    if (btn) {
      btn.disabled = false;
      btn.textContent = "MASUK SEKARANG";
    }
    if (spinner) spinner.style.display = "none";
  }

  return false;
}

// ================================
// REGISTER
// ================================
async function registerUser(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();
  const message = document.getElementById("regMessage");

  if (!email || !password) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Email dan password wajib diisi";
      message.style.display = "block";
    }
    return false;
  }

  if (!email.includes('@')) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Email tidak valid";
      message.style.display = "block";
    }
    return false;
  }

  if (password.length < 6) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Password minimal 6 karakter";
      message.style.display = "block";
    }
    return false;
  }

  if (message) {
    message.style.color = "#555";
    message.textContent = "Mendaftarkan akun...";
    message.style.display = "block";
  }

  // Show loading spinner
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "block";

  // Disable button
  const btn = document.getElementById("registerBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "MENDAFTAR...";
  }

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      if (message) {
        message.style.color = "green";
        message.textContent = "Registrasi berhasil! Mengalihkan ke login...";
      }

      // 🔥 REDIRECT OTOMATIS KE LOGIN
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      if (message) {
        message.style.color = "red";
        message.textContent = data.message || "Registrasi gagal";
      }

      // Re-enable button
      if (btn) {
        btn.disabled = false;
        btn.textContent = "DAFTAR SEKARANG";
      }
      if (spinner) spinner.style.display = "none";
    }
  } catch (err) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Terjadi kesalahan jaringan";
    }
    console.error("REGISTER ERROR:", err);

    // Re-enable button
    if (btn) {
      btn.disabled = false;
      btn.textContent = "DAFTAR SEKARANG";
    }
    if (spinner) spinner.style.display = "none";
  }

  return false;
}

// ================================
// AUTO EVENT BINDING
// ================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 DOM Ready - Auto-binding forms...');

  // LOGIN FORM
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log('✅ Login form found');
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      loginUser(e);
      return false;
    });

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        if (e.target.type !== 'submit') {
          e.preventDefault();
          loginUser(e);
        }
      });
    }
  }

  // REGISTER FORM
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    console.log('✅ Register form found');
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      registerUser(e);
      return false;
    });

    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
      registerBtn.addEventListener('click', function(e) {
        if (e.target.type !== 'submit') {
          e.preventDefault();
          registerUser(e);
        }
      });
    }
  }

  console.log('✅ All event listeners initialized');
});

console.log('✅ Main.js loaded successfully');
