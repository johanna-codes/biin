// ============================
// INTERNATIONALIZATION (i18n)
// ============================

let currentLanguage = localStorage.getItem('language') || 'es';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all translated elements
    updatePageTranslations();
    
    // Update active button
    updateLanguageButtons();
}

function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ============================
// EVENT LISTENERS
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    setLanguage(currentLanguage);
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Language selector
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // Smooth scroll for nav links
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu
                if (navLinks && menuToggle) {
                    navLinks.classList.remove('mobile-active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const contactSection = document.getElementById('contacto');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu
                if (navLinks && menuToggle) {
                    navLinks.classList.remove('mobile-active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.section, .tracker-content, .garage-card, .avatar-card');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Initialize horizontal scrollers
    setupHorizontalScroll('products-cards');
    setupHorizontalScroll('about-cards');
    setupHorizontalScroll('resources-cards');
    // Initialize dots indicators
    initScrollDots('products-cards');
    initScrollDots('about-cards');
    initScrollDots('resources-cards');
});

// ============================
// UTILITY FUNCTIONS
// ============================

function getCurrentLanguage() {
    return currentLanguage;
}

function translate(key) {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    return key;
}

// Horizontal scroll helper: connects prev/next buttons to a scrolling container
function setupHorizontalScroll(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const prev = document.querySelector(`.scroll-btn.prev[data-target="${containerId}"]`);
    const next = document.querySelector(`.scroll-btn.next[data-target="${containerId}"]`);

    const scrollAmount = container.clientWidth || 600;

    if (prev) {
        prev.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    if (next) {
        next.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
}

// Create and wire dots indicators for a horizontal scroller
function initScrollDots(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // create dots wrapper
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'scroll-dots';

    const items = Array.from(container.children);
    if (items.length <= 1) return;

    items.forEach((item, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = idx;
        dot.addEventListener('click', () => {
            // scroll to the item
            container.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
    });

    // insert dots after container
    container.insertAdjacentElement('afterend', dotsWrap);

    const dotElements = Array.from(dotsWrap.children);

    function updateActive() {
        const center = container.scrollLeft + container.clientWidth / 2;
        let activeIdx = 0;
        let minDist = Infinity;
        items.forEach((it, i) => {
            const itCenter = it.offsetLeft + it.clientWidth / 2;
            const dist = Math.abs(itCenter - center);
            if (dist < minDist) { minDist = dist; activeIdx = i; }
        });
        dotElements.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }

    // initial state
    updateActive();

    let resizeTimer;
    container.addEventListener('scroll', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateActive, 80);
    });
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateActive, 120);
    });
}
