// ==========================================================================
// STICKY NAVBAR — Scroll-based color transition (shared across all pages)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    // Supports both .navbar (catalog, cart, checkout, catalog-detail)
    // and .top-navbar (index/home page)
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

    // Apply correct state immediately on load (e.g. user refreshed mid-page)
    handleNavbarScroll();
});
