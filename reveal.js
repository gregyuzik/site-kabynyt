(function () {
    'use strict';

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        // Scroll-reveal for .fade-up elements. If IntersectionObserver is
        // unavailable (very old browsers) or JS fails silently, the
        // @media(scripting:none) rule in styles.css already shows content.
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add('in');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
        } else {
            document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('in'); });
        }
    });
})();
