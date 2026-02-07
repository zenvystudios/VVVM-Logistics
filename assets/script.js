// ========================================
// GLOBALS
// ========================================
const html = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// Immediately signal that JS is working
document.documentElement.classList.add('js-loaded');

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      ScrollTrigger.refresh();
    }, 1000);
  }
});

// ========================================
// THEME & BRAND MODE
// ========================================
(function initTheme() {
  const THEME_KEY = 'vvvm-theme';
  const BRAND_KEY = 'brand-mode';

  // Restore theme
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  html.setAttribute('data-theme', savedTheme);

  // Restore brand mode
  if (localStorage.getItem(BRAND_KEY) === 'on') html.classList.add('brand-mode');

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('svg');

    themeToggle.addEventListener('click', () => {
      const THEMES = ['light', 'dark', 'brand'];
      const currentTheme = html.getAttribute('data-theme');
      const nextTheme = THEMES[(THEMES.indexOf(currentTheme) + 1) % THEMES.length];

      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
      updateIcon(nextTheme, icon);

      // Micro-feedback
      html.animate([{ opacity: 0.92 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    });

    // Initial icon
    updateIcon(savedTheme, icon);
  }

  // Brand mode toggle
  const brandToggle = document.getElementById('brandToggle');
  if (brandToggle) {
    brandToggle.addEventListener('click', () => {
      html.classList.toggle('brand-mode');
      localStorage.setItem(BRAND_KEY, html.classList.contains('brand-mode') ? 'on' : 'off');
    });
  }

  function updateIcon(theme, icon) {
    if (!icon) return;
    if (theme === 'dark') {
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
    } else if (theme === 'brand') {
      icon.innerHTML = `
        <rect x="3" y="3" width="18" height="18" rx="4"></rect>
        <path d="M7 12h10"></path>
        <path d="M12 7v10"></path>
      `;
    } else {
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  }
})();

// ========================================
// NAVBAR & MOBILE MENU
// ========================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
  });

  if (mobileToggle && navMenu) {
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
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();

// ========================================
// SCROLL PROGRESS BAR
// ========================================
(function initScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
    scrollProgress.classList.add('is-visible');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => scrollProgress.classList.remove('is-visible'), 600);
  }, { passive: true });
})();


// ========================================
// PREMIUM FLOATING PARALLAX ANIMATIONS
// ========================================
function initPremiumAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // =======================
  // Hero Section Floating
  // =======================
  const heroContent = document.querySelector('.hero-content');
  const heroButtons = document.querySelectorAll('.hero-content .cta-button');
  const heroTruck = document.getElementById('heroTruck');
  const heroImage = document.querySelector('.hero-image'); // optional image wrapper

  if (heroContent && !prefersReducedMotion) {
    // Hero content fade-in with stagger
    gsap.from(heroContent.children, {
      y: 40,
      autoAlpha: 0,
      duration: 1.2,
      stagger: 0.25,
      ease: 'power3.out'
    });

    // Hero buttons floating slightly
    heroButtons.forEach(btn => {
      gsap.fromTo(btn, 
        { y: 0 }, 
        { 
          y: -6, 
          duration: 2.5, 
          repeat: -1, 
          yoyo: true, 
          ease: "sine.inOut", 
          delay: Math.random() * 0.5
        }
      );
    });

    // Hero text parallax on scroll
    gsap.to(heroContent, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    // Optional hero image floating slightly
    if (heroImage) {
      gsap.to(heroImage, {
        y: -20,
        rotation: 0.5,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    // Truck drives across screen continuously
    if (heroTruck) {
      gsap.fromTo(heroTruck, 
        { left: '-20%' }, 
        { 
          left: '80%', 
          duration: 10, 
          ease: 'linear', 
          repeat: -1 
        }
      );
    }
  }

  // =======================
  // About Section
  // =======================
  const aboutSection = document.querySelector(".about-grid");
  if (aboutSection) {
    const image = aboutSection.querySelector(".about-image-wrapper");
    const content = aboutSection.querySelector(".about-content");

    gsap.set([image, content], { autoAlpha: 1, x: 0 });

    ScrollTrigger.create({
      trigger: aboutSection,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.from(image, { x: -60, autoAlpha: 0, duration: 1, ease: "power3.out" });
        gsap.from(content, { x: 60, autoAlpha: 0, duration: 1, ease: "power3.out", delay: 0.2 });
      }
    });

    // Floating subtle parallax on scroll
    gsap.to(image, {
      y: -15,
      scrollTrigger: {
        trigger: aboutSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4
      }
    });
    gsap.to(content, {
      y: -10,
      scrollTrigger: {
        trigger: aboutSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4
      }
    });
  }

  // =======================
  // About Stats Counter
  // =======================
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat, i) => {
    const target = parseInt(stat.dataset.target, 10);

    ScrollTrigger.create({
      trigger: stat.closest(".about-stats") || stat,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.fromTo(stat, { innerText: 0 }, {
          innerText: target,
          duration: 1.6,
          ease: "power3.out",
          snap: { innerText: 1 },
          delay: i * 0.2,
          onUpdate: () => stat.textContent = Math.floor(stat.innerText) + '+'
        });
      }
    });
  });

  // =======================
  // Timeline Items
  // =======================
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 50,
      autoAlpha: 0,
      duration: 1,
      delay: i * 0.2,
      ease: "power3.out"
    });
  });

  // =======================
  // Service Cards
  // =======================
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 85%', toggleActions: "play none none reverse" },
    y: 40,
    autoAlpha: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: "power4.out",
    onComplete: () => gsap.set('.service-card', { autoAlpha: 1, y: 0 })
  });

}

// Initialize after window load
window.addEventListener('load', () => {
  initPremiumAnimations();
  ScrollTrigger.refresh();
});


// ========================================
// NAVBAR SECTION HIGHLIGHT & SHRINK
// ========================================
(function initSmartNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = gsap.utils.toArray(".nav-link");
  if (!navbar || !navLinks.length) return;

  ScrollTrigger.create({
    start: 100,
    onEnter: () => navbar.classList.add("is-shrunk"),
    onLeaveBack: () => navbar.classList.remove("is-shrunk")
  });

  navLinks.forEach(link => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return;

    const section = document.querySelector(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top+=120 top",
      end: "bottom-=120 top",
      onEnter: () => activate(link),
      onEnterBack: () => activate(link)
    });
  });

  function activate(activeLink) {
    navLinks.forEach(l => l.classList.remove("is-active"));
    activeLink.classList.add("is-active");
  }
})();

// ========================================
// NAVBAR IMAGE PREVIEWS
// ========================================
(function initNavPreviews() {
  if (window.innerWidth < 1024) return;
  const preview = document.getElementById("navPreview");
  if (!preview) return;

  const previewImg = preview.querySelector("img");
  let activeTween;

  document.querySelectorAll(".nav-link[data-preview]").forEach(link => {
    link.addEventListener("mouseenter", () => {
      if (!link.dataset.preview) return;
      previewImg.src = link.dataset.preview;

      if (activeTween) activeTween.kill();
      preview.classList.add("is-visible");

      activeTween = gsap.to(preview, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });
    });

    link.addEventListener("mouseleave", () => {
      if (activeTween) activeTween.kill();
      preview.classList.remove("is-visible");
      activeTween = gsap.to(preview, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" });
    });
  });
})();

// ========================================
// MAGNETIC CTA BUTTONS
// ========================================
(function initCTA() {
  if ("ontouchstart" in window) return;

  gsap.utils.toArray(".cta-button").forEach(btn => {
    const strength = 0.35;

    btn.addEventListener("mouseenter", () => btn.classList.add("is-hovered"));

    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });

      btn.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      btn.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });

    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("is-hovered");
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    });
  });
})();

// ========================================
// FORM HANDLING & TOAST
// ========================================
(function initForm() {
  const form = document.getElementById('enquiryForm');
  const toast = document.getElementById('toast');
  if (!form || !toast) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };

    toast.classList.add('show');

    const msg = `*New Enquiry*%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Service:* ${formData.service}%0A*Message:* ${formData.message}`;

    setTimeout(() => {
      window.open(`https://wa.me/919677079693?text=${msg}`, '_blank');
      toast.classList.remove('show');
      form.reset();
    }, 2000);
  });
})();

// ========================================
// TRACKING WIDGET INTERACTION
// ========================================
(function initTracking() {
    const trackBtn = document.querySelector('.tracking-btn');
    if(trackBtn) {
        trackBtn.addEventListener('click', () => {
            const input = document.querySelector('.tracking-input');
            const id = input.value.trim();
            if(!id) {
                input.style.borderColor = 'red';
                setTimeout(() => input.style.borderColor = 'var(--color-border)', 2000);
                return;
            }
            // Simulate search
            trackBtn.innerHTML = 'Searching...';
            setTimeout(() => {
                alert(`Tracking info for ${id}: In Transit (Chennai -> Bangalore)`);
                trackBtn.innerHTML = 'Track';
            }, 1500);
        });
    }
})();

document.getElementById('calc-btn').addEventListener('click', () => {
    const l = parseFloat(document.getElementById('calc-l').value) || 0;
    const w = parseFloat(document.getElementById('calc-w').value) || 0;
    const h = parseFloat(document.getElementById('calc-h').value) || 0;
    const q = parseFloat(document.getElementById('calc-q').value) || 1;

    if (l && w && h) {
        const cbm = ((l * w * h) / 1000000) * q;
        const resultDiv = document.getElementById('calc-result');
        resultDiv.querySelector('span').innerText = cbm.toFixed(3);
        resultDiv.classList.remove('hidden');
        setTimeout(() => resultDiv.classList.add('show'), 10);
    }
});

// Text Scramble Effect
const letters = "ABCDEFGHIJKLMNOPQRS";

document.querySelectorAll(".section-title").forEach(target => {
    target.onmouseover = event => {
        let iteration = 0;
        const originalText = event.target.dataset.value || event.target.innerText;
        
        if(!event.target.dataset.value) event.target.dataset.value = originalText;

        clearInterval(event.target.interval);

        event.target.interval = setInterval(() => {
            event.target.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * 20)];
                })
                .join("");

            if(iteration >= originalText.length){ 
                clearInterval(event.target.interval);
            }

            iteration += 1 / 3;
        }, 30);
    }
});

// =============================
// EXIT INTENT POPUP
// =============================
(function() {
    const popup = document.getElementById('exit-popup');
    const closeBtn = document.querySelector('.close-popup');
    let popupShown = false;

    if (!popup || !closeBtn) return; // Safety check

    // Listen for mouse leaving viewport from top
    document.addEventListener('mouseout', (e) => {
        // Only trigger if moving out from top and popup not shown
        if (!popupShown && e.clientY <= 0) {
            popup.classList.add('active');
            popupShown = true;
        }
    });

    // Close button
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Optional: Close on clicking outside the popup
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.remove('active');
    });
})();
