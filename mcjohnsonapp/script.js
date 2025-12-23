// ================================
// NAVIGATION & SECTION SWITCHING
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTokenInteraction();
    initCodeTabs();
    initAnimations();
    initCounters();
    initMobileMenu();
    initCookieBanner();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = link.getAttribute('data-section');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Closes mobile menu if open (ONLY check if it's actually open)
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
            }

            // Scrolls the new section to the top after it becomes visible
            const target = document.getElementById(targetSection);
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);

        });
    });
}

// ================================
// MOBILE MENU
// ================================

function initMobileMenu() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Single function to toggle sidebar
    function toggleSidebar(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.toggle('active');
        }

        if (sidebarToggle) {
        sidebarToggle.classList.toggle('active');
        }
    }

    // Both buttons do the same thing
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
                if (sidebarToggle) {
                    sidebarToggle.classList.remove('active');
                }
            }
        });
    }

    // Prevents sidebar clicks from closing it
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// ================================
// INTERACTIVE TOKEN DISPLAY
// ================================

function initTokenInteraction() {
    const tokenLogo = document.querySelector('.token-logo');
    const tokenParticles = document.getElementById('tokenParticles');
    
    if (!tokenLogo || !tokenParticles) return;

    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    // Mouse/Touch Events
    tokenLogo.addEventListener('mousedown', dragStart);
    tokenLogo.addEventListener('touchstart', dragStart);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    // Click to create particles
    tokenLogo.addEventListener('click', () => {
        createParticles(5);
    });

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - currentX;
            initialY = e.touches[0].clientY - currentY;
        } else {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
        }

        if (e.target === tokenLogo || tokenLogo.contains(e.target)) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        const maxX = 100;
        const maxY = 100;
        currentX = Math.max(-maxX, Math.min(maxX, currentX));
        currentY = Math.max(-maxY, Math.min(maxY, currentY));

        tokenLogo.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        
        // Spring back animation
        tokenLogo.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        tokenLogo.style.transform = 'translate(0, 0)';
        
        setTimeout(() => {
            tokenLogo.style.transition = '';
            currentX = 0;
            currentY = 0;
        }, 500);

        // Create particles on release
        createParticles(10);
    }

    function createParticles(count) {
        const container = tokenLogo.parentElement;
        const rect = tokenLogo.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 2 + Math.random() * 3;
            const size = 4 + Math.random() * 8;
            
            particle.style.cssText = `
                position: absolute;
                left: ${rect.left - containerRect.left + rect.width / 2}px;
                top: ${rect.top - containerRect.top + rect.height / 2}px;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, #8B5CF6, #7C3AED);
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
            `;
            
            tokenParticles.appendChild(particle);
            
            animateParticle(particle, angle, velocity);
        }
    }

    function animateParticle(particle, angle, velocity) {
        const startTime = Date.now();
        const duration = 1000;
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const distance = velocity * elapsed / 10;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance - (progress * progress * 100);
            
            const opacity = 1 - progress;
            const scale = 1 - progress * 0.5;
            
            particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(update);
        }
        
        update();
    }
}

// ================================
// CODE TABS
// ================================

function initCodeTabs() {
    const tabButtons = document.querySelectorAll('.code-tab');
    const tabPanels = document.querySelectorAll('.code-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('data-panel') === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ================================
// SCROLL ANIMATIONS
// ================================

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ================================
// COUNTER ANIMATIONS
// ================================

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    update();
}

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.startsWith('#/')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && target.classList.contains('section')) {
            // Use navigation system for sections
            const navLink = document.querySelector(`[data-section="${href.slice(1)}"]`);
            if (navLink) navLink.click();
        }
    });
});

// ================================
// PARALLAX EFFECT ON SCROLL
// ================================

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY;
    
    // Parallax for gradient orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        const currentTransform = orb.style.transform || 'translateY(0px)';
        const currentY = parseFloat(currentTransform.match(/translateY\(([-\d.]+)px\)/)?.[1] || 0);
        const newY = currentY - scrollDelta * speed;
        orb.style.transform = `translateY(${newY}px)`;
    });
    
    lastScrollY = scrollY;
});

// ================================
// TYPING ANIMATION FOR TERMINAL
// ================================

function typeInTerminal(element, text, speed = 50) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// ================================
// EASTER EGG: KONAMI CODE
// ================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const container = document.body;
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const token = document.createElement('div');
            token.textContent = '₿';
            token.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${20 + Math.random() * 40}px;
                color: #8B5CF6;
                pointer-events: none;
                z-index: 9999;
                animation: fall ${3 + Math.random() * 2}s linear forwards;
            `;
            
            container.appendChild(token);
            
            setTimeout(() => token.remove(), 5000);
        }, i * 100);
    }
    
    if (!document.getElementById('fall-animation')) {
        const style = document.createElement('style');
        style.id = 'fall-animation';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================
// PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
// ================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ================================
// COPY CONTRACT ADDRESS
// ================================

const contractLinks = document.querySelectorAll('.contract-address a');
contractLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const address = '0xE278e264eA19A6Fe78ad2667041561aA90f42E71';
        
        try {
            await navigator.clipboard.writeText(address);
            showNotification('Contract address copied!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ================================
// CURSOR EFFECTS (OPTIONAL)
// ================================

if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #8B5CF6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10001;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .miniapp-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// ================================
// HIDE/SHOW MOBILE MENU ON SCROLL
// ================================

let lastScrollTop = 0;
let scrollTimer = null;

window.addEventListener('scroll', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (!mobileMenuBtn) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear existing timer
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    // Scrolling down - hide button
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        mobileMenuBtn.classList.add('hidden');
    } 
    // Scrolling up - show button
    else if (scrollTop < lastScrollTop) {
        mobileMenuBtn.classList.remove('hidden');
    }
    
    // Show button after user stops scrolling for 500ms
    scrollTimer = setTimeout(() => {
        mobileMenuBtn.classList.remove('hidden');
    }, 500);
    
    lastScrollTop = scrollTop;
});

// ================================
// LAZY LOAD IMAGES
// ================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================
// NETWORK STATUS INDICATOR
// ================================

window.addEventListener('online', () => {
    showNotification('Connection restored');
});

window.addEventListener('offline', () => {
    showNotification('No internet connection');
});

// ================================
// CONSOLE MESSAGE
// ================================

console.log('%c🚀 McJohnson Wallet', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
console.log('%cYour keys. Your assets. Your control.', 'font-size: 14px; color: #A78BFA;');
console.log('%cInterested in building? Check out https://github.com/etsgoc/mcjohnson-sdk', 'font-size: 12px; color: #9CA3AF;');

// ================================
// EXPORT FOR POTENTIAL USE
// ================================

window.McJohnsonWebsite = {
    showNotification,
    createParticles: () => {
        const tokenLogo = document.querySelector('.token-logo');
        if (tokenLogo) {
            // Trigger particle creation
            tokenLogo.click();
        }
    }
};

// ================================
// COOKIE CONSENT BANNER
// ================================

function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const closeBtn = document.getElementById('closeCookies');

    if (!banner || !acceptBtn || !closeBtn) {
        return;
    }   
    
    // Check if user has already accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted) {
        // Show banner after 1 second
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }
    
    // Accept cookies
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('show');
        showNotification('Cookie preferences saved');
    });
    
    // Close banner (same as accept)
    closeBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('show');
    });
}
