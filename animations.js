// ============================================
// AWARD-WINNING ANIMATIONS
// Inspired by Awwwards-winning websites
// ============================================

(function () {
    'use strict';

    // Check if on homepage
    const isHomePage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/');

    // ============================================
    // SCROLL REVEAL ANIMATIONS (Homepage only)
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stagger children if has stagger class
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.08}s`;
                        child.classList.add('revealed');
                    });
                }
                // Stop observing once revealed
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // ============================================
    // SMOOTH CURSOR FOLLOWER
    // ============================================

    function initCursorFollower() {
        // Only on desktop
        if (window.matchMedia('(hover: none)').matches) return;

        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .card, input');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            });
        });
    }

    // ============================================
    // SMOOTH NUMBER COUNTER
    // ============================================

    function animateNumber(element, target, duration = 1000) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;

            if (element.dataset.type === 'percentage') {
                element.textContent = current.toFixed(2) + '%';
            } else if (element.dataset.type === 'gpa') {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // RIPPLE EFFECT ON BUTTONS
    // ============================================

    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ============================================
    // TILT EFFECT ON CARDS
    // ============================================

    function initTiltEffect() {
        const cards = document.querySelectorAll('.card, .calc-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // GLOW EFFECT ON MOUSE MOVE
    // ============================================

    function initGlowEffect() {
        const glowCards = document.querySelectorAll('.card, .calc-card, .stat');

        glowCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // ============================================
    // INITIALIZE ALL ANIMATIONS
    // ============================================

    function init() {
        // Only apply scroll reveal on homepage
        if (isHomePage) {
            const revealElements = document.querySelectorAll(
                '.card, .hero-content, .section-header'
            );
            revealElements.forEach(el => {
                el.classList.add('reveal');
                revealOnScroll.observe(el);
            });

            // Make card-grid stagger its children
            document.querySelectorAll('.card-grid').forEach(grid => {
                grid.classList.add('stagger-children');
                revealOnScroll.observe(grid);
            });
        }

        // Initialize effects on all pages
        initRippleEffect();
        initTiltEffect();
        initGlowEffect();

        // Desktop-only effects
        if (!window.matchMedia('(hover: none)').matches) {
            initCursorFollower();
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose animateNumber for calculator use
    window.animateNumber = animateNumber;

})();
