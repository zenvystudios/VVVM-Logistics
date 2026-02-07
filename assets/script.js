

        // ========================================
        // PRELOADER
        // ========================================
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            setTimeout(() => {
                loader.classList.add('hidden');
                initHeroAnimations();
                initAboutCounters();

                setTimeout(() => {
                  ScrollTrigger.refresh();
                }, 200);
            }, 1000);
        });

        // ========================================
        // REDUCED MOTION DETECTION
        // ========================================
        const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
        ).matches;


document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('brand-mode');
});

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // Restore saved brand mode
  const brandMode = localStorage.getItem('brand-mode');
  if (brandMode === 'on') {
    html.classList.add('brand-mode');
  }

  // Example toggle button
  const brandToggle = document.getElementById('brandToggle');
  if (!brandToggle) return;

  brandToggle.addEventListener('click', () => {
    html.classList.toggle('brand-mode');

    localStorage.setItem(
      'brand-mode',
      html.classList.contains('brand-mode') ? 'on' : 'off'
    );
  });
});

        
// ========================================
// THEME TOGGLE — LIGHT / DARK / BRAND
// ========================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const icon = themeToggle.querySelector('svg');

const THEMES = ['light', 'dark', 'brand'];

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

// Toggle handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];

    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateIcon(nextTheme);

    // Micro interaction feedback
    html.animate(
        [{ opacity: 0.92 }, { opacity: 1 }],
        { duration: 220, easing: 'ease-out' }
    );
});

// Icon updater
function updateIcon(theme) {
    if (theme === 'dark') {
        // ☀ Sun (Dark Mode Indicator)
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } 
    else if (theme === 'brand') {
        // ◼ Brand Mode — Command / Ops Icon
        icon.innerHTML = `
            <rect x="3" y="3" width="18" height="18" rx="4"></rect>
            <path d="M7 12h10"></path>
            <path d="M12 7v10"></path>
        `;
    } 
    else {
        // 🌙 Moon (Light Mode Indicator)
        icon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3
                     7 7 0 0 0 21 12.79z"></path>
        `;
    }
}


        // ========================================
        // NAVBAR & MOBILE MENU
        // ========================================
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Back to top visibility
            const backToTop = document.getElementById('backToTop');
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ========================================
        // GSAP ANIMATIONS
        // ========================================
        gsap.registerPlugin(ScrollTrigger);

        function initHeroAnimations() {

            if (prefersReducedMotion) {
                gsap.set('.hero-content > *', { autoAlpha: 1, y: 0 });
                return;
            }

            // Hero Text Fade In
            gsap.from('.hero-content > *', {
                y: 30,
                autoAlpha: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Truck Drive Animation
            gsap.fromTo('#heroTruck', 
                { left: '-20%' },
                { 
                    left: '80%', 
                    duration: 8, 
                    ease: 'none', 
                    repeat: -1,
                    delay: 0.5 
                }
            );
        }

        // Process Timeline Animation
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                autoAlpha: 0,
                duration: 0.8,
                delay: i * 0.2
            });
        });

        // Service Cards Stagger
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 85%', // Triggers a bit earlier (higher up) to be safe
                toggleActions: "play none none reverse" // Allows replay if scrolling up
            },
            y: 50,
            autoAlpha: 0, // Better than autoAlpha: 0 (handles visibility: hidden too)
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => {
                // Fallback: Force them visible if animation glitches
                gsap.set('.service-card', { autoAlpha: 1, y: 0 });
            }
        });

        // FORCE REFRESH: Call this after window load to fix layout shift issues
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });

// ========================================
// ABOUT SECTION — BULLETPROOF GSAP
// ========================================

window.addEventListener("load", () => {
  const aboutSection = document.querySelector(".about-grid");
  if (!aboutSection) return;

  const image = aboutSection.querySelector(".about-image-wrapper");
  const content = aboutSection.querySelector(".about-content");

  // 🔑 SAFETY: Ensure visible before ScrollTrigger
  gsap.set([image, content], { autoAlpha: 1, x: 0 });

  ScrollTrigger.create({
    trigger: aboutSection,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.from(image, {
        x: -60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out"
      });

      gsap.from(content, {
        x: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15
      });
    }
  });
});


// ========================================
// ABOUT STATS COUNTER — SCROLL-SAFE
// ========================================

function initAboutCounters() {
  gsap.registerPlugin(ScrollTrigger);

  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  stats.forEach((stat, index) => {
    const target = parseInt(stat.dataset.target, 10);
    stat.textContent = "0";

    ScrollTrigger.create({
      trigger: stat.closest(".about-stats") || stat,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 1.6,
            ease: "power3.out",
            snap: { innerText: 1 },
            delay: index * 0.15,
            onUpdate: () => {
              stat.textContent = Math.floor(stat.innerText) + '+';
            }
          }
        );
      }
    });
  });
}




/* ===============================
   GSAP PREMIUM FLEET FILTER
   Flip-based | Mobile Optimized
================================ */

gsap.registerPlugin(Flip);

const filterButtons = document.querySelectorAll(".filter-btn");
const fleetGrid = document.querySelector(".fleet-grid");
const fleetItems = gsap.utils.toArray(".fleet-item");

/* 🔹 Initial entrance animation */
gsap.from(fleetItems, {
  scrollTrigger: {
    trigger: fleetGrid,
    start: "top 80%",
  },
  y: 40,
  autoAlpha: 0,
  stagger: 0.08,
  duration: 0.6,
  ease: "power3.out",
});

/* 🔹 Filter click logic */
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) return;

    /* UI state */
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    /* Capture current layout */
    const state = Flip.getState(fleetItems);

    /* Show / hide items (NO display:block) */
    fleetItems.forEach((item) => {
      const category = item.dataset.category;

      if (filter === "all" || category === filter) {
        item.style.display = ""; // restore CSS grid behavior
      } else {
        item.style.display = "none";
      }
    });

    /* Animate layout change */
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      stagger: 0.05,
      absolute: false,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { autoAlpha: 0, scale: 0.95 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.in",
        }),
    });
  });
});

/* 🔹 Mobile tap optimization */
if ("ontouchstart" in window) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("touchstart", () => {
      btn.classList.add("tap");
      setTimeout(() => btn.classList.remove("tap"), 150);
    });
  });
}


        // ========================================
        // FORM HANDLING & TOAST
        // ========================================
        const enquiryForm = document.getElementById('enquiryForm');
        const toast = document.getElementById('toast');

        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Show Toast
            toast.classList.add('show');
            
            // Prepare WhatsApp Message
            const msg = `*New Enquiry*%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Service:* ${formData.service}%0A*Message:* ${formData.message}`;
            
            setTimeout(() => {
                window.open(`https://wa.me/919677079693?text=${msg}`, '_blank');
                toast.classList.remove('show');
                enquiryForm.reset();
            }, 2000);
        });

/* ========================================
   BRAND MODE CONTROLLER
   ======================================== */

(function () {
    const STORAGE_KEY = 'vvvm-theme';

    const root = document.documentElement;

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    window.toggleBrandMode = function () {
        const current = root.getAttribute('data-theme');

        const next =
            current === 'brand'
                ? 'dark'
                : current === 'dark'
                ? 'light'
                : 'brand';

        root.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);

        // Micro feedback
        root.animate(
            [{ opacity: 0.92 }, { opacity: 1 }],
            { duration: 220, easing: 'ease-out' }
        );
    };
})();

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================

const scrollProgress = document.getElementById('scrollProgress');

let scrollTimeout;

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / docHeight) * 100;

  scrollProgress.style.width = `${progress}%`;
  scrollProgress.classList.add('is-visible');

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollProgress.classList.remove('is-visible');
  }, 600);
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });


// ========================================
// SMART NAVBAR — FIXED & STABLE
// ========================================

window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.getElementById("navbar");
  const navLinks = gsap.utils.toArray(".nav-link");

  if (!navbar || !navLinks.length) return;

  /* 🔹 NAV SHRINK */
  ScrollTrigger.create({
    start: 100,
    onEnter: () => navbar.classList.add("is-shrunk"),
    onLeaveBack: () => navbar.classList.remove("is-shrunk")
  });

  /* 🔹 SECTION AWARE LINKS */
  navLinks.forEach(link => {
    const id = link.getAttribute("href");

    // Only allow hash links
    if (!id || !id.startsWith("#")) return;

    const section = document.querySelector(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top+=120 top",     // accounts for fixed navbar
      end: "bottom-=120 top",
      onEnter: () => activate(link),
      onEnterBack: () => activate(link)
    });
  });

  function activate(activeLink) {
    navLinks.forEach(l => l.classList.remove("is-active"));
    activeLink.classList.add("is-active");
  }

  // Force recalculation after animations & loader
  ScrollTrigger.refresh();
});



// ========================================
// Navbar preview images on hover
// ========================================


document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 1024) return;

  const preview = document.getElementById("navPreview");
  const previewImg = preview.querySelector("img");
  const navLinks = document.querySelectorAll(".nav-link[data-preview]");

  let activeTween;

  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      const imgSrc = link.dataset.preview;
      if (!imgSrc) return;

      previewImg.src = imgSrc;

      if (activeTween) activeTween.kill();

      preview.classList.add("is-visible");

      activeTween = gsap.to(preview, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out"
      });
    });

    link.addEventListener("mouseleave", () => {
      if (activeTween) activeTween.kill();

      preview.classList.remove("is-visible");

      activeTween = gsap.to(preview, {
        opacity: 0,
        y: 10,
        duration: 0.25,
        ease: "power2.in"
      });
    });
  });
});

/* ==============================
   MAGNETIC CTA BUTTONS
================================ */

if (!("ontouchstart" in window)) {
  gsap.utils.toArray(".cta-button").forEach((btn) => {
    const strength = 0.35;

    btn.addEventListener("mouseenter", () => {
      btn.classList.add("is-hovered");
    });

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull
      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power3.out"
      });

      // Glow follows cursor
      btn.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      btn.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });

    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("is-hovered");

      // Soft elastic release
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });
}