document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const contactForm = document.getElementById("contactForm");
  const siteHeader = document.querySelector(".site-header");
  const heroBg1 = document.querySelector(".hero-bg-1");
  const heroBg2 = document.querySelector(".hero-bg-2");
  const heroImages = [
    "https://distrokid.imgix.net/http%3A%2F%2Fgather.fandalism.com%2F555699--F224D231-EC64-498B-8402AFCFEA1A82E7--1618073139418--Burn.png?fm=jpg&q=75&w=800&s=822e4e0c3979c775978b6b8de00194e9",
    "https://distrokid.imgix.net/http%3A%2F%2Fgather.fandalism.com%2F555699--E4B8858A-8013-4B24-9D3C41B351573D38--1594626150467--tudoranghelinapianolullabies.jpg?fm=jpg&q=75&w=800&s=8f3a80d46378fb4578f976798d3cde9b",
    "https://distrokid.imgix.net/http%3A%2F%2Fgather.fandalism.com%2F555699--BBEBF5FE-92EE-47FE-83E4DD7E764ED7BB--1579469033701--TudorAnghelina6.png?fm=jpg&q=75&w=800&s=dd9c61e3014ddb47041055974a7fa557",
    "https://distrokid.imgix.net/http%3A%2F%2Fgather.fandalism.com%2F555699--38A2CEC1-528F-47E3-806ACD15D2A5CD92--1575044305380--Design1.png?fm=jpg&q=75&w=800&s=c0dc2ec3ad0d5d56d7892e3e806ba628"
  ];
  let heroIndex = 0;
  let showingFirstBg = true;
  
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
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
  
  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
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

  // Hero background slideshow with crossfade + blur
  if (heroBg1 && heroBg2 && heroImages.length) {
    const setBg = (el, url) => {
      el.style.backgroundImage = `url('${url}')`;
    };

    setBg(heroBg1, heroImages[heroIndex]);
    heroBg1.classList.add("is-visible");

    const rotateHeroBg = () => {
      const nextIndex = (heroIndex + 1) % heroImages.length;
      const incoming = showingFirstBg ? heroBg2 : heroBg1;
      const outgoing = showingFirstBg ? heroBg1 : heroBg2;

      setBg(incoming, heroImages[nextIndex]);
      incoming.classList.add("is-visible");
      outgoing.classList.remove("is-visible");

      showingFirstBg = !showingFirstBg;
      heroIndex = nextIndex;
    };

    // Prime the second layer then begin rotation
    setTimeout(() => rotateHeroBg(), 200);
    setInterval(rotateHeroBg, 7000);
  }
  
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
  
  // Add subtle animation to music cards on scroll
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
  
  // Current year in footer
  const yearSpan = document.querySelector(".footer-copyright p");
  if (yearSpan) {
    yearSpan.innerHTML = yearSpan.innerHTML.replace("2025", new Date().getFullYear());
  }
  
  // Add keyboard navigation for accessibility
  document.addEventListener("keydown", (e) => {
    // Close menu on Escape key
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      navToggle.focus();
    }
    
    // Navigate menu with arrow keys when open
    if (e.key === "ArrowDown" && document.body.classList.contains("nav-open")) {
      e.preventDefault();
      const firstLink = document.querySelector(".nav-links a");
      if (firstLink) firstLink.focus();
    }
  });
  
  // Initialize
  console.log("Tudor Anghelina website loaded successfully");
});
