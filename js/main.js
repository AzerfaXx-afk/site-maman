// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => reg.update()).catch(err => console.log('SW failed: ', err));
    });
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, 0), 10));

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    gsap.to('.hero-img', {
        scale: 1.15,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Hero initial fade up
    gsap.fromTo('.fade-up', 
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // 3. Reusable Reveal Animations
    const revealElements = [
        { selector: '.reveal-left', x: -50, y: 0 },
        { selector: '.reveal-right', x: 50, y: 0 },
        { selector: '.reveal-up', x: 0, y: 50 }
    ];

    revealElements.forEach(config => {
        gsap.utils.toArray(config.selector).forEach(element => {
            let triggerEl = element;
            if (element.closest('.reveal-group')) {
                triggerEl = element.closest('.reveal-group');
            }
            gsap.fromTo(element, 
                { x: config.x, y: config.y, autoAlpha: 0 },
                { x: 0, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out",
                  scrollTrigger: { trigger: triggerEl, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        });
    });

    // 3.5 Parallax Backgrounds
    gsap.utils.toArray('.parallax-section').forEach(section => {
        const bg = section.querySelector('.parallax-bg');
        if (bg) {
            gsap.to(bg, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom", 
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });

    // 4. Grid Staggers (Techniques)
    gsap.utils.toArray('.techniques-grid').forEach(grid => {
        const items = grid.querySelectorAll('.reveal-scale');
        gsap.fromTo(items, 
            { scale: 0.9, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
                scrollTrigger: { trigger: grid, start: "top 80%" }
            }
        );
    });

    // Individual scale reveals (images in details)
    gsap.utils.toArray('.detail-img-wrapper.reveal-scale').forEach(wrapper => {
        gsap.fromTo(wrapper,
            { scale: 0.95, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: wrapper, start: "top 85%" }
            }
        );
    });

    // 4.5 Mobile Auto-Hover for Technique Cards (Using GSAP for reliability)
    gsap.utils.toArray('.technique-card').forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 75%",
            end: "bottom 25%",
            toggleClass: "mobile-active"
        });
    });

    // 5. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Close mobile menu if open
                if (hamburger && hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // 9. Scroll Dot Observer
    const sections = document.querySelectorAll('.section-scroll');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const observerOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                scrollDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('data-target') === currentId) dot.classList.add('active');
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // 10. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // 11. Custom PWA Install Prompt
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    let deferredPrompt;
    const installPrompt = document.getElementById('installPrompt');
    const btnInstall = document.getElementById('btnInstall');
    const closeInstall = document.getElementById('closeInstall');

    // Show the custom toast automatically if not already installed
    if (!isStandalone && installPrompt) {
        setTimeout(() => {
            installPrompt.classList.add('visible');
        }, 3000);
    }

    // Capture the native Chrome install prompt event to use it later
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent native mini-infobar
        deferredPrompt = e;
    });

    if(btnInstall && closeInstall) {
        btnInstall.addEventListener('click', async () => {
            installPrompt.classList.remove('visible');
            if(deferredPrompt) {
                // Native prompt on Android / Desktop
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            } else {
                // Manual instructions fallback (e.g. for iOS Safari)
                alert("Sur iPhone/iPad : Appuyez sur l'icône de Partage en bas de l'écran ⍈, puis choisissez 'Sur l'écran d'accueil' ➕.");
            }
        });
        
        closeInstall.addEventListener('click', () => {
            // Only hides the prompt. Reappears upon page refresh!
            installPrompt.classList.remove('visible');
        });
    }

    // 12. Snapchat-style Pull to Refresh logic
    const appWrapper = document.getElementById('app-wrapper');
    const ptrLogoWrapper = document.querySelector('.ptr-logo-wrapper');
    const ptrLogo = document.querySelector('.ptr-logo');
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let isRefreshing = false;
    const DISTANCE_TO_REFRESH = 120;

    document.addEventListener('touchstart', (e) => {
        if (window.scrollY <= 10) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isPulling || isRefreshing || !ptrLogoWrapper || !appWrapper) return;
        currentY = e.touches[0].clientY;
        const dragDistance = currentY - startY;

        if (dragDistance > 0 && window.scrollY <= 0) {
            e.preventDefault(); // Disable native scroll while pulling down at top
            const pullY = Math.min(dragDistance * 0.45, DISTANCE_TO_REFRESH + 30);
            
            // Drag the ENTIRE app view down!
            gsap.set(appWrapper, { y: pullY }); 
            
            // Logo appears and scales up from the wood background
            let progress = pullY / DISTANCE_TO_REFRESH;
            progress = Math.min(progress, 1); // Cap at 1 for upright logo
            const rotation = progress * 360;
            gsap.set(ptrLogoWrapper, { scale: 0.4 + (progress * 0.6), opacity: progress });
            gsap.set(ptrLogo, { rotation: rotation });
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isPulling || isRefreshing || !ptrLogoWrapper || !appWrapper) return;
        isPulling = false;
        const dragDistance = currentY - startY;

        if (dragDistance * 0.45 >= DISTANCE_TO_REFRESH && window.scrollY <= 0) {
            isRefreshing = true;
            // The refresh animation: Logo spins fast and pops
            gsap.to(ptrLogoWrapper, { scale: 1.2, duration: 0.4, ease: "back.out(2)" });
            gsap.to(ptrLogo, { rotation: "+=1080", duration: 1.2, ease: "power2.inOut" });
            
            // Site Aspiration (Suck-in effect)
            gsap.to(appWrapper, { 
                y: DISTANCE_TO_REFRESH - 20, 
                scale: 0.9, 
                opacity: 0, 
                filter: "blur(10px)",
                duration: 0.6, 
                ease: "power3.inOut" 
            });

            // Trigger actual reload after aspiration
            setTimeout(() => { window.location.reload(); }, 800);
        } else if (dragDistance > 0 && window.scrollY <= 0) {
            // Cancel pull
            gsap.to(appWrapper, { y: 0, duration: 0.4, ease: "power3.out" });
            gsap.to(ptrLogoWrapper, { scale: 0.4, opacity: 0, duration: 0.3 });
        }
    });

});
