// ================================
// CONFIG
// ================================

// Pakai domain utama (lebih aman dari CORS & deploy)
const API_URL = "https://untungbersama.us";

// ================================
// LOGIN
// ================================

async function loginUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const message = document.getElementById("loginMessage");

  if (!email || !password) {
    message.style.color = "red";
    message.textContent = "Email dan password wajib diisi";
    return;
  }

  message.style.color = "#555";
  message.textContent = "Memproses login...";

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent = "Login berhasil! Mengalihkan...";

      setTimeout(() => {
        // nanti bisa diganti ke /dashboard
        window.location.href = "/";
      }, 1200);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Login gagal";
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = "Terjadi kesalahan jaringan";
    console.error("LOGIN ERROR:", err);
  }
}

// ================================
// REGISTER
// ================================

async function registerUser() {
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();
  const message = document.getElementById("regMessage");

  if (!email || !password) {
    message.style.color = "red";
    message.textContent = "Email dan password wajib diisi";
    return;
  }

  if (password.length < 6) {
    message.style.color = "red";
    message.textContent = "Password minimal 6 karakter";
    return;
  }

  message.style.color = "#555";
  message.textContent = "Mendaftarkan akun...";

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent =
        "Registrasi berhasil! Mengalihkan ke login...";

      // 🔥 REDIRECT OTOMATIS KE LOGIN
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Registrasi gagal";
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = "Terjadi kesalahan jaringan";
    console.error("REGISTER ERROR:", err);
  }
}
