const API_URL = "https://<your-worker>.workers.dev"; // ganti dengan URL Worker kamu

async function loginUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('loginMessage');

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      message.style.color = 'green';
      message.textContent = 'Login berhasil!';
      // redirect ke dashboard misal index.html
      setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } else {
      message.style.color = 'red';
      message.textContent = data.message || 'Login gagal';
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Terjadi kesalahan jaringan';
    console.error(err);
  }
}

async function registerUser() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const message = document.getElementById('regMessage');

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      message.style.color = 'green';
      message.textContent = 'Registrasi berhasil!';
      setTimeout(() => { window.location.href = "login.html"; }, 1000);
    } else {
      message.style.color = 'red';
      message.textContent = data.message || 'Registrasi gagal';
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Terjadi kesalahan jaringan';
    console.error(err);
  }
}
