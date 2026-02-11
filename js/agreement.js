// FILE: agreement.js - VERSI SULTAN PRECISION FINAL v11.7
const USER_DATA = {
    nama: sessionStorage.getItem('sultan_member_nama') || "MEMBER",
    userId: sessionStorage.getItem('sultan_user_id') || "USR-UNKNOWN",
    ip_address: "Captured Via System",
    // Ambil status dari data eligibility yang sudah di-load sebelumnya
    mavro_agreement: (LATEST_MAVRO_DATA && LATEST_MAVRO_DATA.isAgreed === 1) ? 1 : 0,
    timestamp: new Date().toISOString()
};

const USER_REF = "USER_REF_123"; // Reference ID untuk Google Script

(function() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('btn_submit');
    const btnDownload = document.getElementById('btn_download');
    const chk = document.getElementById('final_check');
    const scrollBox = document.getElementById('legal_scroll_box');
    const form = document.getElementById('draggable_form');
    
    const isSigned = (USER_DATA.mavro_agreement == 1);
    
    // Populate user data
    document.getElementById('user_nama').textContent = USER_DATA.nama;
    document.getElementById('user_id').textContent = USER_DATA.userId;
    document.getElementById('user_ip').textContent = USER_DATA.ip_address || 'Captured Via System';
    document.getElementById('user_nama_sig').textContent = USER_DATA.nama;
    document.getElementById('user_id_sig').textContent = USER_DATA.userId;
    
    function terbilang(n) {
        const kata = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if (n < 12) return kata[n];
        if (n < 20) return terbilang(n - 10) + " Belas";
        if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
        return String(n);
    }

    function formatTanggalLengkap(isoDate) {
        if (!isoDate || isoDate === "") return { hari:"Sabtu", tgl:"Tiga", bln:"Januari", thn:"Dua Ribu Dua Puluh Enam", short:"03-01-2026" };
        const dObj = new Date(isoDate);
        const monthArr = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const dayArr = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return {
            hari: dayArr[dObj.getDay()],
            tgl: terbilang(dObj.getDate()),
            bln: monthArr[dObj.getMonth()],
            thn: "Dua Ribu Dua Puluh Enam",
            short: String(dObj.getDate()).padStart(2, '0') + "-" + String(dObj.getMonth() + 1).padStart(2, '0') + "-" + dObj.getFullYear()
        };
    }

    function init() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width; 
        canvas.height = rect.height;
        ctx.strokeStyle = "#000000"; 
        ctx.lineWidth = 3; 
        ctx.lineCap = "round";

        const dataTgl = formatTanggalLengkap(USER_DATA.timestamp);
        
        document.getElementById('txt_hari').innerText = dataTgl.hari;
        document.getElementById('txt_tgl').innerText = dataTgl.tgl;
        document.getElementById('txt_bln').innerText = dataTgl.bln;
        document.getElementById('txt_thn').innerText = dataTgl.thn;
        document.getElementById('tgl_sig_p1').innerText = dataTgl.short;
        document.getElementById('tgl_sig_p2').innerText = dataTgl.short;

        if (isSigned) {
            document.getElementById('overlay_sultan_sah').style.display = "flex";
            btn.disabled = true;
            btn.innerText = "✓ PROGRAM MAVRO TELAH AKTIF";
            btn.className = "w-full py-4 rounded-2xl font-black text-[12px] btn-sultan-disabled";
            chk.checked = true; 
            chk.disabled = true;
            btnDownload.style.display = "flex";
        }
    }

    // Draggable form
    let isDragging = false, offsetX, offsetY;
    document.getElementById('form_header').onmousedown = function(e) { 
        isDragging = true; 
        offsetX = e.clientX - form.getBoundingClientRect().left; 
        offsetY = e.clientY - form.getBoundingClientRect().top; 
        form.style.position = 'absolute'; 
        form.style.margin = '0'; 
    };
    document.onmousemove = function(e) { 
        if (!isDragging) return; 
        form.style.left = (e.clientX - offsetX) + 'px'; 
        form.style.top = (e.clientY - offsetY) + 'px'; 
    };
    document.onmouseup = function() { isDragging = false; };
    
    // Signature pad
    let drawing = false, hasDrawn = false;
    function getPos(e) { 
        const rect = canvas.getBoundingClientRect(); 
        const clientX = e.touches ? e.touches[0].clientX : e.clientX; 
        const clientY = e.touches ? e.touches[0].clientY : e.clientY; 
        return { x: clientX - rect.left, y: clientY - rect.top }; 
    }
    
    if (!isSigned) {
        canvas.addEventListener('mousedown', (e) => { 
            init(); 
            drawing = true; 
            hasDrawn = true; 
            ctx.beginPath(); 
            let p = getPos(e); 
            ctx.moveTo(p.x, p.y); 
        });
        canvas.addEventListener('mousemove', (e) => { 
            if(drawing){ 
                let p = getPos(e); 
                ctx.lineTo(p.x, p.y); 
                ctx.stroke(); 
            } 
        });
        window.addEventListener('mouseup', () => drawing = false);
        canvas.addEventListener('touchstart', (e) => { 
            init(); 
            drawing = true; 
            hasDrawn = true; 
            ctx.beginPath(); 
            let p = getPos(e); 
            ctx.moveTo(p.x, p.y); 
            e.preventDefault(); 
        });
        canvas.addEventListener('touchmove', (e) => { 
            if(drawing){ 
                let p = getPos(e); 
                ctx.lineTo(p.x, p.y); 
                ctx.stroke(); 
            } 
            e.preventDefault(); 
        });
    }
    
    window.resetPad = () => { 
        if(!isSigned){ 
            ctx.clearRect(0,0,canvas.width,canvas.height); 
            hasDrawn = false; 
        } 
    };
    
    // Download PDF Function
    window.downloadAgreementPDF = function() {
        Swal.fire({
            title: 'Generating PDF...',
            html: 'Menyiapkan Akta Persetujuan Sultan...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // SIMULASI - Ganti dengan google.script.run untuk GAS
        setTimeout(() => {
            Swal.close();
            Swal.fire({ 
                icon: 'info', 
                title: 'DEMO MODE', 
                text: 'Fitur download PDF akan aktif saat terintegrasi dengan Google Apps Script.', 
                confirmButtonColor: '#059669' 
            });
        }, 2000);
        
        /*
        // UNTUK INTEGRASI GAS:
        google.script.run.withSuccessHandler(function(res) {
            Swal.close();
            if (res.success) {
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,' + res.base64;
                link.download = res.fileName;
                link.click();
                Swal.fire({ icon: 'success', title: 'DOWNLOAD BERHASIL', text: 'Dokumen telah tersimpan.', confirmButtonColor: '#059669' });
            } else {
                Swal.fire('Gagal', res.message, 'error');
            }
        }).generateAgreementPDF(USER_REF);
        */
    };

    window.submitData = async function() {
        // 1. Validasi: Apakah sudah tanda tangan atau belum centang?
        if(isSigned) return;
        if(!chk.checked || !hasDrawn) { 
            Swal.fire({ 
                icon: 'error', 
                title: 'Maaf !', 
                html: '<b>Dokumen ini harus anda Signatured dan Checkbox harus dicentang.</b>', 
                confirmButtonColor: '#059669' 
            }); 
            return; 
        }
        
        // 2. Tampilkan Loading ala Sultan
        Swal.fire({ 
            title: 'Menyimpan ke Cloud...', 
            html: 'Sedang mengamankan sertifikat persetujuan Anda',
            allowOutsideClick: false, 
            didOpen: () => Swal.showLoading() 
        });
        
        // 3. Ambil IP Address User untuk Audit Trail Firestore
        let userIp = "0.0.0.0";
        try { 
            const response = await fetch('https://api.ipify.org?format=json'); 
            const data = await response.json(); 
            userIp = data.ip; 
        } catch (err) { console.warn("Gagal mengambil IP, menggunakan default."); }
        
        // 4. PROSES KIRIM KE WORKER (FIRESTORE)
        try {
            const response = await fetch('/api/member/save-agreement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ref: USER_REF,                 // ID unik member
                    signature: canvas.toDataURL(), // Gambar Tanda Tangan (Base64)
                    ip: userIp                     // Alamat IP
                })
            });

            const res = await response.json();

            if (res.success) {
                // 5. Jika Berhasil Simpan
                Swal.fire({ 
                    icon: 'success', 
                    title: 'VERIFIED', 
                    text: 'Persetujuan berhasil disimpan di Cloud Firestore.',
                    confirmButtonColor: '#059669' 
                }).then(() => { 
                    // Update status lokal agar menu terbuka
                    if(typeof IS_MAVRO_UNLOCKED !== 'undefined') IS_MAVRO_UNLOCKED = true;
                    
                    // Refresh halaman agreement agar muncul overlay "SAH"
                    if(typeof changePageSultan === "function") {
                        changePageSultan('user_agreement');
                    }

                    // Munculkan prompt unlock login (opsional)
                    setTimeout(() => { 
                        if(typeof window.promptLoginUnlock === "function") {
                            window.promptLoginUnlock();
                        }
                    }, 1200);
                }); 
            } else {
                throw new Error(res.message || "Gagal menyimpan ke server");
            }

        } catch (error) {
            // 6. Jika Terjadi Kesalahan (Server mati / Route belum ada)
            Swal.fire({
                icon: 'error',
                title: 'Koneksi Gagal',
                text: 'Terjadi kesalahan: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    };
