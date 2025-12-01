document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const contactForm = document.getElementById("contactForm");
  const siteHeader = document.querySelector(".site-header");
  const heroBg = document.querySelector(".hero-bg");
  const soundWavesContainer = document.querySelector(".sound-waves");
  const currentYearElement = document.getElementById("current-year");
  
  // Generate Sound Waves
  function generateSoundWaves() {
    if (!soundWavesContainer) return;
    
    soundWavesContainer.innerHTML = ''; // Clear existing
    
    const numberOfBars = Math.floor(window.innerWidth / 12);
    const colorPalette = [
      'rgba(201, 168, 106, 0.7)', // Primary gold
      'rgba(138, 98, 64, 0.6)',   // Brown
      'rgba(241, 221, 170, 0.5)', // Light gold
      'rgba(44, 24, 16, 0.6)',    // Dark brown
      'rgba(255, 255, 255, 0.3)'  // White
    ];
    
    for (let i = 0; i < numberOfBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'wave-bar';
      
      // Random properties for natural look
      const height = 80 + Math.random() * 80;
      const delay = Math.random() * 2;
      const duration = 1.5 + Math.random() * 1.5;
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      
      bar.style.cssText = `
        --wave-color: ${colorPalette[colorIndex]};
        height: ${height}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${0.2 + Math.random() * 0.3};
      `;
      
      soundWavesContainer.appendChild(bar);
    }
  }
  
  // Extract colors from hero image
  async function extractColorsFromImage() {
    if (!heroBg) return;
    
    const imageUrl = heroBg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
    if (!imageUrl || imageUrl === 'none') return;
    
    try {
      const colors = await getImageColors(imageUrl);
      applyColorTheme(colors);
    } catch (error) {
      console.log('Using default colors:', error);
      applyDefaultColors();
    }
  }
  
  function getImageColors(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100; // Smaller for performance
        canvas.height = Math.floor((img.height / img.width) * 100);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Get average color
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          count++;
        }
        
        const avgColor = {
          r: Math.round(r / count),
          g: Math.round(g / count),
          b: Math.round(b / count)
        };
        
        // Convert to HSL for hue rotation
        const hsl = rgbToHSL(avgColor.r, avgColor.g, avgColor.b);
        
        resolve({
          dominant: avgColor,
          hue: hsl.h,
          palette: generateColorPalette(hsl)
        });
      };
      
      img.onerror = reject;
    });
  }
  
  function rgbToHSL(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  }
  
  function generateColorPalette(hsl) {
    const palette = [];
    const hue = hsl.h;
    
    // Generate complementary colors
    palette.push(`hsl(${hue}, 30%, 10%)`);    // Dark
    palette.push(`hsl(${hue}, 40%, 25%)`);    // Medium dark
    palette.push(`hsl(${hue}, 50%, 40%)`);    // Medium
    palette.push(`hsl(${(hue + 30) % 360}, 40%, 60%)`); // Complementary light
    palette.push(`hsl(${(hue + 60) % 360}, 30%, 75%)`); // Accent
    
    return palette;
  }
  
  function applyColorTheme(colors) {
    const root = document.documentElement;
    
    root.style.setProperty('--dominant-hue', colors.hue);
    
    // Apply colors to wave bars
    document.querySelectorAll('.wave-bar').forEach((bar, index) => {
      const colorIndex = index % colors.palette.length;
      bar.style.setProperty('--wave-color', colors.palette[colorIndex]);
    });
  }
  
  function applyDefaultColors() {
    const root = document.documentElement;
    root.style.setProperty('--dominant-hue', '30'); // Default gold hue
  }
  
  // Hero Background Loader
  function loadHeroBackground() {
    if (!heroBg) return;
    
    // Add loaded class to trigger animations
    setTimeout(() => {
      heroBg.classList.add('is-visible');
      
      // Extract colors from image
      extractColorsFromImage();
    }, 100);
  }
  
  // Interactive Wave Animation
  function addWaveInteractivity() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      
      // Update wave animation based on mouse position
      document.querySelectorAll('.wave-bar').forEach((bar, index) => {
        const distance = Math.abs((index / document.querySelectorAll('.wave-bar').length) - mouseX);
        const intensity = 1 - Math.min(distance * 2, 0.8);
        
        bar.style.animationDuration = `${1.5 + intensity * 1.5}s`;
        bar.style.opacity = `${0.2 + intensity * 0.3}`;
      });
    });
  }
  
  // Mobile Navigation Toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      
      // Prevent body scroll when menu is open
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }
  
  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    });
  });
  
  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
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
  
  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      if (!data.name || !data.email || !data.subject || !data.message) {
        alert("Please fill in all fields");
        return;
      }
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      try {
        // In a real application, you would send this to your backend
        // For now, we'll simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        alert("Thank you for your message! I'll get back to you soon.");
        contactForm.reset();
        
      } catch (error) {
        console.error("Form submission error:", error);
        alert("There was an error sending your message. Please try again.");
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Add animation to music cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);
  
  // Observe music cards
  document.querySelectorAll(".track-card").forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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
  
  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      generateSoundWaves();
    }, 250);
  });
  
  // Initialize
  console.log("Tudor Anghelina website loaded successfully");
  
  // Initial setup
  generateSoundWaves();
  loadHeroBackground();
  addWaveInteractivity();
  
  // Add subtle background music wave animation on scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY;
    
    // Update wave animation based on scroll speed
    const intensity = Math.min(Math.abs(scrollDelta) / 10, 2);
    document.querySelectorAll('.wave-bar').forEach(bar => {
      bar.style.animationDuration = `${2 / (1 + intensity)}s`;
    });
    
    lastScrollY = scrollY;
  });
});