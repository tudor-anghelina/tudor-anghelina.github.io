document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const contactForm = document.getElementById("contactForm");
  const siteHeader = document.querySelector(".site-header");
  const rootEl = document.documentElement;
  const currentYearElement = document.getElementById("current-year");
  const preloader = document.querySelector(".preloader");
  const formMessage = document.querySelector(".form-message");
  const revealOrder = [];
  const stageSequence = [];
  let headerEl = null;
  let preloaderCleared = false;
  const revealAnimations = [
    'animate__fadeInDown',
    'animate__fadeInUp',
    'animate__fadeInLeft',
    'animate__fadeInRight',
    'animate__zoomIn',
    'animate__lightSpeedInLeft',
    'animate__lightSpeedInRight',
    'animate__fadeIn'
  ];
  
  // --- REMOVED: Image Color Extraction Logic (was unused) ---
  
  // Page parallax background
  function initParallax() {
    let lastY = window.scrollY;
    let ticking = false;
    
    const update = () => {
      // Stronger parallax factor so motion is visible while scrolling
      rootEl.style.setProperty('--page-parallax', `${Math.round(lastY * -0.35)}px`);
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      lastY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    
    update();
  }

  function setRevealTargets() {
    headerEl = document.querySelector('header.site-header');
    if (headerEl) {
      headerEl.classList.add('staged-hide');
    }

    const selectors = [
      '.brand',
      '.nav-links a',
      '.hero .title',
      '.hero .subtitle',
      '.hero .hero-tagline',
      '.hero .hero-scroll',
      '#about .section-title',
      '.about-content',
      '#music .section-title',
      '.music-grid',
      '#contact .section-title',
      '.contact-container',
      '.social-links'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('will-reveal');
        revealOrder.push(el);
      });
    });

    document.querySelectorAll('section, footer').forEach(el => {
      el.classList.add('staged-hide');
      stageSequence.push(el);
    });
  }

  function playStageSequence() {
    stageSequence.forEach((el, idx) => {
      const effect = revealAnimations[Math.floor(Math.random() * revealAnimations.length)];
      setTimeout(() => {
        el.classList.remove('staged-hide');
        el.style.removeProperty('display');
        void el.offsetHeight; // force reflow
        el.classList.add('animate__animated', effect, 'animate__fast');
      }, idx * 500);
    });
  }

  function revealHeader() {
    if (!headerEl) {
      headerEl = document.querySelector('header.site-header');
    }
    if (!headerEl) return;
    const navWrap = headerEl.querySelector('.nav-wrap');
    headerEl.classList.remove('staged-hide');
    headerEl.removeAttribute('style');
    headerEl.style.display = 'block';
    const effect = 'animate__fadeInUpBig';
    void headerEl.offsetHeight; // reflow
    headerEl.classList.add('animate__animated', effect, 'animate__fast', 'revealed');

    if (navWrap) {
      navWrap.classList.remove('staged-hide');
      navWrap.removeAttribute('style');
      navWrap.style.display = 'flex';
      void navWrap.offsetHeight;
      navWrap.classList.add('animate__animated', effect, 'animate__fast', 'revealed');
    }
  }

  function playReveal() {
    // Only animate the nav-wrap if it's the desktop version (mobile is revealed later)
    if (window.innerWidth > 860) { 
        const navWrap = document.querySelector('.site-header .nav-wrap');
        if (navWrap) {
            const randomAnim = revealAnimations[Math.floor(Math.random() * revealAnimations.length)];
            setTimeout(() => {
                navWrap.classList.add('animate__animated', randomAnim, 'animate__faster');
                navWrap.classList.add('revealed');
            }, 1100);
        }
    }
    

    revealOrder.forEach((el, idx) => {
      const effect = revealAnimations[idx % revealAnimations.length];
      setTimeout(() => {
        el.classList.add('revealed');
        el.classList.add('animate__animated', effect, 'animate__faster');
      }, 240 + idx * 80);
    });
  }

  function clearPreloader() {
    if (preloaderCleared) return;
    preloaderCleared = true;
    document.body.classList.remove('is-preloading');
    document.body.classList.add('page-loaded');
    // Hide loader
    if (preloader) {
      preloader.classList.add('is-hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.remove();
      }, 200);
    }
    // Delay content reveal
    setTimeout(() => {
      revealHeader();
      setTimeout(playStageSequence, 400);
      setTimeout(playReveal, 400);
      setTimeout(() => {
        document.body.classList.remove('content-hidden');
      }, 600);
    }, 300);
  }
  
  // Mobile Navigation Toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }
  
  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
        document.body.style.overflow = "";
      }
    });
  });
  
  // Smooth Scrolling for anchor links (with fixed header offset)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Calculate offset to account for fixed header
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
      }
    });
  });
  
  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });
  
  // Contact Form Submission (Improved Validation UX)
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Validation and UX
      let isValid = true;
      const requiredFields = ['name', 'email', 'subject', 'message'];

      requiredFields.forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === "") {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });
      
      if (!isValid) {
          formMessage.style.display = 'block';
          formMessage.style.color = '#FF6B6B';
          formMessage.textContent = "Please fill in all required fields.";
          return;
      }
      
      // Clear message and show loading state
      formMessage.style.display = 'none';
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        formMessage.style.display = 'block';
        formMessage.style.color = '#1ED760';
        formMessage.textContent = "Thank you for your message! I'll get back to you soon.";
        contactForm.reset();
        
      } catch (error) {
        console.error("Form submission error:", error);
        formMessage.style.display = 'block';
        formMessage.style.color = '#FF6B6B';
        formMessage.textContent = "There was an error sending your message. Please try again.";
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Add animation to music cards on scroll (with staggered delay)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered delay is applied via CSS transition-delay in the card observer loop
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        // Stop observing once revealed
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);
  
  // Observe music cards
  document.querySelectorAll(".track-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    // Apply staggered delay via inline style
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Update current year in footer
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Add keyboard navigation for accessibility
  document.addEventListener("keydown", (e) => {
    // Close menu on Escape key
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
      document.body.style.overflow = "";
    }
  });
  
  // Initialize
  console.log("Tudor Anghelina website loaded successfully");
  
  // Initial setup
  document.body.classList.add('is-preloading');
  document.body.classList.add('content-hidden');
  setRevealTargets();
  
  // Final preloader clearing logic: rely on the inline script and window load event
  window.addEventListener('load', () => setTimeout(clearPreloader, 60)); 
  
  initParallax();
});
