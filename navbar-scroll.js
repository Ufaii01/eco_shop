document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar') || document.querySelector('.top-navbar');
    if (!navbar) return;

    function handleNavbarScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
});
