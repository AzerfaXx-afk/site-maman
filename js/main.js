// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => reg.update()).catch(err => console.log('SW failed: ', err));
    });
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, 0), 10));

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for Ultra Fluid Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // 2. Tie Lenis to GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // 4. Hero Storytelling Parallax
    gsap.to('.hero-bg', {
        yPercent: 30, // Move background slower than scroll
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } 
    });
    
    gsap.to('.hero-content', {
        yPercent: 40, opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Hero initial fade up
    gsap.fromTo('.fade-up', 
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // 5. Image Parallax Elements (About & Details)
    gsap.utils.toArray('.about-img, .detail-img-wrapper img').forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // 6. Reusable Section Reveals (Text coming in)
    const revealElements = [
        { selector: '.reveal-left', x: -50, y: 0 },
        { selector: '.reveal-right', x: 50, y: 0 },
        { selector: '.reveal-up', x: 0, y: 50 }
    ];

    revealElements.forEach(config => {
        gsap.utils.toArray(config.selector).forEach(element => {
            gsap.fromTo(element, 
                { x: config.x, y: config.y, autoAlpha: 0 },
                { x: 0, y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out",
                  scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
                }
            );
        });
    });

    // 7. Grid Staggers (Techniques)
    gsap.utils.toArray('.techniques-grid').forEach(grid => {
        const items = grid.querySelectorAll('.reveal-scale');
        gsap.fromTo(items, 
            { scale: 0.9, y: 50, autoAlpha: 0 },
            { scale: 1, y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
                scrollTrigger: { trigger: grid, start: "top 80%" }
            }
        );
    });

    // 8. Fluid Anchor Scrolling via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement, { offset: -80 }); // offset for navbar
                
                // Close mobile menu if open
                if (hamburger.classList.contains('active')) {
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

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Prevent native mini-infobar
        deferredPrompt = e;
        if(!localStorage.getItem('pwaPromptDismissed') && !isStandalone) {
            setTimeout(() => {
                if(installPrompt) installPrompt.classList.add('visible');
            }, 3000);
        }
    });

    if(btnInstall && closeInstall) {
        btnInstall.addEventListener('click', async () => {
            installPrompt.classList.remove('visible');
            if(deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }
        });
        closeInstall.addEventListener('click', () => {
            installPrompt.classList.remove('visible');
            localStorage.setItem('pwaPromptDismissed', 'true');
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
        if (!isPulling || isRefreshing) return;
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
        if (!isPulling || isRefreshing) return;
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
