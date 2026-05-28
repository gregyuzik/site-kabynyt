/**
 * Kabynyt Website — Phosphor Icon Replacement
 * Replaces emoji in card-ico, pl-ico, wn-icon, feature-icon, and highlight-icon
 * elements with inline Phosphor SVGs rendered with gradient strokes.
 *
 * Icons: Phosphor 2.1.1 Regular weight (256×256 viewBox, stroke-based)
 * See: https://phosphoricons.com
 *
 * All SVG strings are hardcoded constants from the icons table below, never
 * user-supplied. We still parse them via DOMParser + adoptNode rather than
 * assigning to .innerHTML — it's structurally safer and keeps the code under
 * the project CSP's `script-src 'self'` posture.
 */
(function () {
    'use strict';

    const STROKE = 'fill="none" stroke="cC" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"';

    const icons = {
        '✨': {
            svg: '<path d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z" ' + STROKE + '/><line x1="176" y1="16" x2="176" y2="64" ' + STROKE + '/><line x1="224" y1="72" x2="224" y2="104" ' + STROKE + '/><line x1="152" y1="40" x2="200" y2="40" ' + STROKE + '/><line x1="208" y1="88" x2="240" y2="88" ' + STROKE + '/>',
            g: ['#c073ff', '#af52de']
        },
        '📊': {
            svg: '<line x1="40" y1="64" x2="40" y2="192" ' + STROKE + '/><line x1="72" y1="64" x2="72" y2="192" ' + STROKE + '/><line x1="104" y1="64" x2="104" y2="192" ' + STROKE + '/><line x1="136" y1="64" x2="136" y2="192" ' + STROKE + '/><line x1="168" y1="64" x2="168" y2="192" ' + STROKE + '/><line x1="200" y1="64" x2="200" y2="192" ' + STROKE + '/>',
            g: ['#5be0a8', '#34c759']
        },
        '📦': {
            svg: '<polyline points="32.7 76.92 128 129.08 223.3 76.92" ' + STROKE + '/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" ' + STROKE + '/><line x1="128" y1="129.09" x2="128" y2="232" ' + STROKE + '/>',
            g: ['#7ad8ff', '#5ac8fa']
        },
        '☁️': {
            svg: '<path d="M80,128a80,80,0,1,1,80,80H72A56,56,0,1,1,85.92,97.74" ' + STROKE + '/>',
            g: ['#5ac8fa', '#007aff']
        },
        '🏠': {
            svg: '<path d="M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54a8,8,0,0,1,2.62,5.92V208a8,8,0,0,1-8,8H160A8,8,0,0,1,152,208Z" ' + STROKE + '/>',
            g: ['#ffb04a', '#ff9500']
        },
        '📸': {
            svg: '<path d="M208,208H48a16,16,0,0,1-16-16V80A16,16,0,0,1,48,64H80L96,40h64l16,24h32a16,16,0,0,1,16,16V192A16,16,0,0,1,208,208Z" ' + STROKE + '/><circle cx="128" cy="132" r="36" ' + STROKE + '/>',
            g: ['#ff6b6b', '#ff453a']
        },
        '🔎': {
            svg: '<circle cx="116" cy="116" r="84" ' + STROKE + '/><line x1="175.39" y1="175.39" x2="224" y2="224" ' + STROKE + '/>',
            g: ['#5ac8fa', '#007aff']
        },
        '✏️': {
            svg: '<path d="M96,216H40a8,8,0,0,1-8-8V152a8,8,0,0,1,2.34-5.66l112-112a8,8,0,0,1,11.32,0l56,56a8,8,0,0,1,0,11.32l-112,112A8,8,0,0,1,96,216Z" ' + STROKE + '/><line x1="216" y1="216" x2="40" y2="216" ' + STROKE + '/><line x1="184" y1="72" x2="216" y2="40" ' + STROKE + '/><line x1="120" y1="80" x2="176" y2="136" ' + STROKE + '/>',
            g: ['#a8a8ac', '#8e8e93']
        },
        '📥': {
            svg: '<path d="M184,128h40a8,8,0,0,1,8,8v64a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V136a8,8,0,0,1,8-8H72" ' + STROKE + '/><line x1="128" y1="24" x2="128" y2="128" ' + STROKE + '/><polyline points="80 80 128 128 176 80" ' + STROKE + '/><circle cx="188" cy="168" r="12"/>',
            g: ['#5ac8fa', '#007aff']
        },
        '🎨': {
            svg: '<path d="M128,192a24,24,0,0,1,24-24h46.21a24,24,0,0,0,23.4-18.65A96.48,96.48,0,0,0,224,127.17c-.45-52.82-44.16-95.7-97-95.17a96,96,0,0,0-95,96c0,41.81,26.73,73.44,64,86.61A24,24,0,0,0,128,192Z" ' + STROKE + '/><circle cx="128" cy="76" r="12"/><circle cx="84" cy="100" r="12"/><circle cx="84" cy="156" r="12"/><circle cx="172" cy="100" r="12"/>',
            g: ['#d6a86a', '#a2845e']
        },
        '❤️': {
            svg: '<path d="M128,224S24,168,24,102A54,54,0,0,1,128,76h0A54,54,0,0,1,232,102C232,168,128,224,128,224Z" ' + STROKE + '/>',
            g: ['#ff6b8a', '#ff2d55']
        },
        '⭐': {
            svg: '<path d="M132.35,40.43l25.74,52.11a4.94,4.94,0,0,0,3.74,2.71l57.61,8.34a5,5,0,0,1,2.79,8.55L180.56,152a4.92,4.92,0,0,0-1.43,4.42l9.84,57.13a5,5,0,0,1-7.28,5.27l-51.52-27a5,5,0,0,0-4.66,0l-51.52,27a5,5,0,0,1-7.28-5.27L76.55,156.4A4.92,4.92,0,0,0,75.12,152L33.45,112.14a5,5,0,0,1,2.79-8.55l57.61-8.34a4.94,4.94,0,0,0,3.74-2.71l25.74-52.11A5,5,0,0,1,132.35,40.43Z" ' + STROKE + '/>',
            g: ['#ffd84a', '#ffcc00']
        },
        '🏷️': {
            svg: '<path d="M42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32a8,8,0,0,1,0,11.31L153,237.66a8,8,0,0,1-11.31,0Z" ' + STROKE + '/><circle cx="84" cy="84" r="12"/>',
            g: ['#c993ff', '#af52de']
        },
        '🔍': {
            svg: '<path d="M34.1,61.38A8,8,0,0,1,40,48H216a8,8,0,0,1,5.92,13.38L152,136v58.65a8,8,0,0,1-3.56,6.66l-32,21.33A8,8,0,0,1,104,216V136Z" ' + STROKE + '/>',
            g: ['#7d7bfa', '#5856d6']
        },
        '🗑️': {
            svg: '<line x1="215.99" y1="56" x2="40" y2="56.01" ' + STROKE + '/><line x1="104" y1="104" x2="104" y2="168" ' + STROKE + '/><line x1="152" y1="104" x2="152" y2="168" ' + STROKE + '/><path d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" ' + STROKE + '/><path d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" ' + STROKE + '/>',
            g: ['#8a8a90', '#636366']
        },
        '🔐': {
            svg: '<rect x="40" y="88" width="176" height="128" rx="8" ' + STROKE + '/><circle cx="128" cy="152" r="12"/><path d="M88,88V56a40,40,0,0,1,80,0V88" ' + STROKE + '/>',
            g: ['#5be0a8', '#34c759']
        },
        '💰': {
            svg: '<line x1="128" y1="80" x2="128" y2="88" ' + STROKE + '/><line x1="128" y1="168" x2="128" y2="176" ' + STROKE + '/><path d="M108,156h28a16,16,0,0,0,0-32H120a16,16,0,0,1,0-32h28" ' + STROKE + '/><circle cx="128" cy="128" r="96" ' + STROKE + '/>',
            g: ['#ffd84a', '#f4b942']
        },
        '🌐': {
            svg: '<circle cx="128" cy="128" r="96" ' + STROKE + '/><path d="M168,128c0,64-40,96-40,96s-40-32-40-96,40-96,40-96S168,64,168,128Z" ' + STROKE + '/><line x1="37.46" y1="96" x2="218.54" y2="96" ' + STROKE + '/><line x1="37.46" y1="160" x2="218.54" y2="160" ' + STROKE + '/>',
            g: ['#5ac8fa', '#007aff']
        },
        '⚡': {
            svg: '<polygon points="96 240 112 160 48 136 160 16 144 96 208 120 96 240" ' + STROKE + '/>',
            g: ['#ffcc00', '#ff9500']
        },
        '👑': {
            svg: '<path d="M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146.28,77.42a28,28,0,1,0-36.56,0L86.91,128.74l-26.79-33a28,28,0,1,0-31.14,10.18l16.18,97.11A16,16,0,0,0,60.94,216H195.06a16,16,0,0,0,15.78-13L227,105.95A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80Zm196,12a12,12,0,1,1,12-12A12,12,0,0,1,220,92Z"/>',
            g: ['#FFD700', '#FFB300']
        },
        '✉️': {
            svg: '<rect x="32" y="48" width="192" height="160" rx="8" ' + STROKE + '/><polyline points="224 56 128 144 32 56" ' + STROKE + '/>',
            g: ['#a8a8ac', '#8e8e93']
        }
    };

    let idCounter = 0;
    const MAX_MUTATIONS = 10;
    const parser = new DOMParser();
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function buildSvg(icon, size) {
        size = size || 22;
        const id = 'ig' + (++idCounter);
        const ref = 'url(#' + id + ')';
        const inner = icon.svg.replace(/cC/g, ref);
        const markup =
            '<svg xmlns="' + SVG_NS + '" width="' + size + '" height="' + size +
            '" viewBox="0 0 256 256" fill="' + ref + '" aria-hidden="true">' +
            '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0%" stop-color="' + icon.g[0] + '"/>' +
            '<stop offset="100%" stop-color="' + icon.g[1] + '"/>' +
            '</linearGradient></defs>' +
            '<rect width="256" height="256" fill="none"/>' +
            inner + '</svg>';
        const doc = parser.parseFromString(markup, 'image/svg+xml');
        return document.importNode(doc.documentElement, true);
    }

    function replaceEmoji() {
        const targets = document.querySelectorAll('.feature-icon, .card-ico, .pl-ico, .wn-icon, .highlight-icon, .spotlight-icon');
        targets.forEach(function (el) {
            if (el.querySelector('svg')) return;
            const text = el.textContent.trim();
            if (icons[text]) {
                let size = 22;
                if (el.classList.contains('pl-ico')) size = 18;
                else if (el.classList.contains('feature-icon')) size = 24;
                else if (el.classList.contains('wn-icon')) size = 26;
                else if (el.classList.contains('highlight-icon')) size = 26;
                else if (el.classList.contains('spotlight-icon')) size = 34;
                el.textContent = '';
                el.appendChild(buildSvg(icons[text], size));
            }
        });

        document.querySelectorAll('[data-icon="crown"]').forEach(function (el) {
            if (el.querySelector('svg')) return;
            const label = el.textContent.replace(/^[\s👑]+/, '').trim();
            el.textContent = ' ' + label;
            el.insertBefore(buildSvg(icons['👑'], 14), el.firstChild);
        });

        document.querySelectorAll('[data-icon="envelope"]').forEach(function (el) {
            if (el.querySelector('svg')) return;
            const label = el.textContent.replace(/^[\s✉️]+/, '').trim();
            el.textContent = ' ' + label;
            el.insertBefore(buildSvg(icons['✉️'], 16), el.firstChild);
        });
    }

    let running = false;
    function safeReplace() {
        if (running) return;
        running = true;
        replaceEmoji();
        running = false;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeReplace);
    } else {
        safeReplace();
    }

    let pending = null;
    let mutationCount = 0;
    const observer = new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () {
            pending = null;
            safeReplace();
            if (++mutationCount >= MAX_MUTATIONS) {
                observer.disconnect();
            }
        }, 100);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.kabynytIcons = { replace: replaceEmoji, build: buildSvg, icons: icons };
})();
