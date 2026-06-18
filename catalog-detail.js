document.addEventListener("DOMContentLoaded", function () {
    const trackImages = document.getElementById('img-track');
    const btnLeft = document.querySelector('.product-images__arrow--left');
    const btnRight = document.querySelector('.product-images__arrow--right');

    if (trackImages && btnLeft && btnRight) {
        const getScrollAmount = () => {
            const slide = trackImages.querySelector('.product-images__slide');
            return slide ? slide.getBoundingClientRect().width + 18 : 500;
        };
        
        btnRight.addEventListener('click', function() {
            trackImages.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        btnLeft.addEventListener('click', function() {
            trackImages.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }

    const trackFan = document.querySelector('.carousel-fan');

    if (trackFan) {
        let isDown = false;
        let startX;
        let scrollLeft;

        trackFan.addEventListener('mousedown', (e) => {
            isDown = true;
            trackFan.style.cursor = 'grabbing';
            startX = e.pageX - trackFan.offsetLeft;
            scrollLeft = trackFan.scrollLeft;
        });

        trackFan.addEventListener('mouseleave', () => {
            isDown = false;
            trackFan.style.cursor = 'grab';
        });

        trackFan.addEventListener('mouseup', () => {
            isDown = false;
            trackFan.style.cursor = 'grab';
        });

        trackFan.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - trackFan.offsetLeft;
            const walk = (x - startX) * 2; // Naik turunin angka buat ngatur kecepatan seret
            trackFan.scrollLeft = scrollLeft - walk;
        });
    }

    const video = document.getElementById('my-product-video');
    const playBtn = document.getElementById('custom-play-btn');

    if (video && playBtn) {
        playBtn.addEventListener('click', function() {
            video.play()
                .then(() => {
                    playBtn.style.display = 'none';
                })
                .catch(error => {
                    console.error("Gagal memutar video:", error);
                    playBtn.style.display = 'none';
                });
        });

        video.addEventListener('pause', function() {
            playBtn.style.display = 'flex';
        });
        
        video.addEventListener('ended', function() {
            playBtn.style.display = 'flex';
        });
    }

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
          const walk = (x - startX) * 2;
          track.scrollLeft = scrollLeft - walk;
        });
    }
