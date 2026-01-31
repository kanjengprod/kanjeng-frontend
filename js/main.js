// main.js - minimal SPA engine & interaksi

console.log("JS loaded: halaman index");

// Contoh fungsi fetch data dari Worker API
async function fetchDashboardData() {
  try {
    // Ganti URL dengan URL backend Worker kamu
    const response = await fetch('https://<worker-backend-url>/api/dashboard');
    const data = await response.json();
    
    console.log("Data dashboard:", data);
    
    // Contoh tampilkan nama user
    const header = document.querySelector('header h1');
    if (header && data.userNama) {
      header.textContent = "Selamat datang, " + data.userNama;
    }
    
  } catch (err) {
    console.error("Gagal fetch data:", err);
  }
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
});
