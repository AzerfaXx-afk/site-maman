// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            reg.update(); // Automatically check for code updates on refresh
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Force scroll to top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Advanced Storytelling Parallax & Slow Zoom for Hero
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    
    // Parallax effect on scroll
    heroTl.to('.hero-img', {
        yPercent: 30,
        ease: "none"
    }, 0);
    
    // Slow breathing zoom independent of scroll
    gsap.to('.hero-img', {
        scale: 1.1,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.fromTo('.fade-up', 
        { y: 40, autoAlpha: 0 },
        { 
            y: 0, 
            autoAlpha: 1, 
            duration: 1, 
            stagger: 0.15, 
            ease: "power3.out",
            delay: 0.2
        }
    );

    // 3. Reusable Reveal Animations
    const revealElements = [
        { selector: '.reveal-left', x: -50, y: 0 },
        { selector: '.reveal-right', x: 50, y: 0 },
        { selector: '.reveal-up', x: 0, y: 50 }
    ];

    revealElements.forEach(config => {
        gsap.utils.toArray(config.selector).forEach(element => {
            gsap.fromTo(element, 
                { x: config.x, y: config.y, autoAlpha: 0 },
                { 
                    x: 0, y: 0, autoAlpha: 1, 
                    duration: 1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    });

    // Scale reveals with staggers (for grids)
    gsap.utils.toArray('.techniques-grid').forEach(grid => {
        const items = grid.querySelectorAll('.reveal-scale');
        gsap.fromTo(items, 
            { scale: 0.9, autoAlpha: 0 },
            { 
                scale: 1, autoAlpha: 1, 
                duration: 0.8, 
                stagger: 0.15,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: grid,
                    start: "top 80%"
                }
            }
        );
    });

    // Individual scale reveals (images in details)
    gsap.utils.toArray('.detail-img-wrapper.reveal-scale').forEach(wrapper => {
        gsap.fromTo(wrapper,
            { scale: 0.95, autoAlpha: 0 },
            {
                scale: 1, autoAlpha: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 85%"
                }
            }
        )
    });

    // Storytelling Parallax for Detail Images
    gsap.utils.toArray('.detail-img-wrapper img').forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Storytelling Parallax for Contact Background
    gsap.to('.savoir-bg', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".savoir-plus",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Vertical Scroll Dot Logic Hooked into IntersectionObserver
    const sections = document.querySelectorAll('.section-scroll');
    const scrollDots = document.querySelectorAll('.scroll-dot');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                // Remove active class from all dots
                scrollDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('data-target') === currentId) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const bodyRef = document.body;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            bodyRef.classList.toggle('no-scroll');
        });

        const mobileLinks = document.querySelectorAll('.nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                bodyRef.classList.remove('no-scroll');
            });
        });
    }
});
