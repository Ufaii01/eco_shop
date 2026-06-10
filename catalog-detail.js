// Pastikan kode nunggu HTML selesai loading
document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. LOGIKA GESER GAMBAR HERO DENGAN TOMBOL PANAH
    // ==========================================================================
    const trackImages = document.getElementById('img-track');
    const btnLeft = document.querySelector('.product-images__arrow--left');
    const btnRight = document.querySelector('.product-images__arrow--right');

    if (trackImages && btnLeft && btnRight) {
        // Fungsi menghitung jarak geser (lebar 1 gambar + jarak antar gambar)
        const getScrollAmount = () => {
            const slide = trackImages.querySelector('.product-images__slide');
            return slide ? slide.getBoundingClientRect().width + 18 : 500;
        };

        // Klik panah kanan
        btnRight.addEventListener('click', function() {
            trackImages.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // Klik panah kiri
        btnLeft.addEventListener('click', function() {
            trackImages.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 2. LOGIKA CAROUSEL BAWAH (YOU MAY ALSO LIKE) - DRAG MOUSE & SCROLLBAR
    // ==========================================================================
    const trackFan = document.querySelector('.carousel-fan');

    if (trackFan) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Klik mouse dan tahan
        trackFan.addEventListener('mousedown', (e) => {
            isDown = true;
            trackFan.style.cursor = 'grabbing';
            startX = e.pageX - trackFan.offsetLeft;
            scrollLeft = trackFan.scrollLeft;
        });

        // Mouse keluar dari area carousel
        trackFan.addEventListener('mouseleave', () => {
            isDown = false;
            trackFan.style.cursor = 'grab';
        });

        // Lepas klik mouse
        trackFan.addEventListener('mouseup', () => {
            isDown = false;
            trackFan.style.cursor = 'grab';
        });

        // Mouse digeser pas posisi ngeklik
        trackFan.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - trackFan.offsetLeft;
            const walk = (x - startX) * 2; // Naik turunin angka buat ngatur kecepatan seret
            trackFan.scrollLeft = scrollLeft - walk;
        });
    }

    // ==========================================================================
    // 3. LOGIKA CUSTOM PLAY/PAUSE VIDEO
    // ==========================================================================
    const video = document.getElementById('my-product-video');
    const playBtn = document.getElementById('custom-play-btn');

    if (video && playBtn) {
        playBtn.addEventListener('click', function() {
            video.play()
                .then(() => {
                    // Sembunyikan tombol lingkaran putih pas video jalan
                    playBtn.style.display = 'none';
                })
                .catch(error => {
                    console.error("Gagal memutar video:", error);
                    playBtn.style.display = 'none';
                });
        });

        // Munculkan kembali tombol putih jika user klik pause di kontrol bawaan
        video.addEventListener('pause', function() {
            playBtn.style.display = 'flex';
        });
        
        // Munculkan kembali tombol putih saat video tamat
        video.addEventListener('ended', function() {
            playBtn.style.display = 'flex';
        });
    }

    // ==========================================================================
    // 4. LOGIKA SIDEBAR NAVIGASI
    // ==========================================================================
    const hamburgerBtn = document.querySelector('.nav-left .hamburger');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (hamburgerBtn && closeBtn && sidebar && overlay) {
        function toggleSidebar() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
        
        hamburgerBtn.addEventListener('click', toggleSidebar);
        closeBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }
});

    const track = document.querySelector('.carousel-fan');

    if (track) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // FITUR DRAG PAKAI MOUSE (Klik, Tahan, Geser Kanan-Kiri)
        track.addEventListener('mousedown', (e) => {
          isDown = true;
          track.style.cursor = 'grabbing';
          startX = e.pageX - track.offsetLeft;
          scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
          isDown = false;
          track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
          isDown = false;
          track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - track.offsetLeft;
          const walk = (x - startX) * 2; // Naikkan angka ini kalau berasa kurang cepat gesernya
          track.scrollLeft = scrollLeft - walk;
        });
    }
