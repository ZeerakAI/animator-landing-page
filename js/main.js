/* ============================================
   KLYP LANDING PAGE - MAIN JAVASCRIPT
   GSAP Animations & Interactions
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize all modules
  initLenis();
  initNavigation();
  initHeroAnimations();
  initDemoSection();
  initHowItWorks();
  initFeaturesGrid();
  initShowcase();
  initFinalCTA();
  initMagneticButtons();
});

/* ============================================
   SMOOTH SCROLL - LENIS
   ============================================ */
let lenis;

const initLenis = () => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};

/* ============================================
   NAVIGATION
   ============================================ */
const initNavigation = () => {
  const nav = document.querySelector('.nav');
  
  // Scroll-based nav background
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'scrolled', targets: nav }
  });

  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
};

/* ============================================
   HERO ANIMATIONS
   ============================================ */
const initHeroAnimations = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Video container animation
  tl.to('.hero-video-container', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 0.5,
    ease: 'power3.out'
  });

  // Scroll indicator
  tl.to('.scroll-indicator', {
    opacity: 1,
    duration: 0.6
  }, '-=0.3');

  // Parallax effect on hero elements
  gsap.to('.gradient-orb-1', {
    y: -100,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.gradient-orb-2', {
    y: -50,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.hero-content', {
    y: -80,
    opacity: 0.3,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
};

/* ============================================
   ROTATING WORDS
   ============================================ */
const initRotatingWords = () => {
  const words = document.querySelectorAll('.rotating-word');
  let currentIndex = 0;

  const rotateWords = () => {
    words.forEach(word => word.classList.remove('active'));
    currentIndex = (currentIndex + 1) % words.length;
    words[currentIndex].classList.add('active');
  };

  setInterval(rotateWords, 2500);
};

/* ============================================
   DEMO SECTION
   ============================================ */
const initDemoSection = () => {
  const typewriterText = document.getElementById('typewriter');
  const terminalWrapper = document.getElementById('terminal-wrapper');
  const outputWrapper = document.getElementById('output-wrapper');
  const videoLoading = document.getElementById('video-loading');
  const videoResult = document.getElementById('video-result');
  
  const fullText = typewriterText.textContent;
  typewriterText.textContent = '';
  typewriterText.classList.add('typing');

  // Section title animation
  ScrollTrigger.create({
    trigger: '.demo',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.demo-header .section-tag', {
        opacity: 0,
        y: 20,
        duration: 0.6
      });
      
      if (typeof SplitType !== 'undefined') {
        const title = new SplitType('.demo-header .section-title', { types: 'chars, words' });
        gsap.from(title.chars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power4.out'
        });
      }
    },
    once: true
  });

  // Single scroll trigger for the entire demo sequence
  let demoPlayed = false;
  
  ScrollTrigger.create({
    trigger: '.demo-stage',
    start: 'top 65%',
    onEnter: () => {
      if (demoPlayed) return;
      demoPlayed = true;
      
      // STEP 1: Typewriter effect (terminal is centered and visible)
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          typewriterText.textContent += fullText[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
          
          // STEP 2: Wait a moment then hide terminal and show loading
          setTimeout(() => {
            // Hide the terminal
            terminalWrapper.classList.add('hidden');
            
            // Show the output container with loading
            outputWrapper.classList.add('visible');
            videoLoading.classList.add('active');
            
            // STEP 3: Show result animation after loading
            setTimeout(() => {
              videoLoading.classList.remove('active');
              videoResult.classList.add('active');
              
              // Trigger the scene animation
              animateDemoScene();
            }, 2500);
          }, 800);
        }
      }, 25);
    },
    once: true
  });
};

// Modern scene animation
const animateDemoScene = () => {
  const scene = document.querySelector('.result-scene');
  if (!scene) return;
  
  // Animate shapes
  gsap.from('.shape-circle', {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
  
  gsap.from('.shape-ring', {
    scale: 0,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  });
  
  // Animate icon
  gsap.from('.scene-icon', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: 'back.out(1.7)'
  });
  
  // Animate content
  gsap.from('.scene-content', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.6,
    ease: 'power2.out'
  });
  
  // Animate particles
  gsap.from('.scene-particles-new span', {
    scale: 0,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    delay: 0.8,
    ease: 'power2.out'
  });
};

/* ============================================
   HOW IT WORKS
   ============================================ */
const initHowItWorks = () => {
  // Header animation
  ScrollTrigger.create({
    trigger: '.how-it-works',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.hiw-header .section-tag', {
        opacity: 0,
        y: 20,
        duration: 0.6
      });
      
      if (typeof SplitType !== 'undefined') {
        const title = new SplitType('.hiw-header .section-title', { types: 'chars, words' });
        gsap.from(title.chars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power4.out',
          delay: 0.2
        });
      }
    },
    once: true
  });

  // Steps animation
  const steps = document.querySelectorAll('.hiw-step');
  
  steps.forEach((step, index) => {
    gsap.to(step, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      delay: index * 0.15
    });
  });

  // Connector line animation
  gsap.to('.connector-line path', {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: '.hiw-steps',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1
    }
  });
};

/* ============================================
   FEATURES GRID
   ============================================ */
const initFeaturesGrid = () => {
  // Header animation
  ScrollTrigger.create({
    trigger: '.features',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.features-header .section-tag', {
        opacity: 0,
        y: 20,
        duration: 0.6
      });
      
      if (typeof SplitType !== 'undefined') {
        const title = new SplitType('.features-header .section-title', { types: 'chars, words' });
        gsap.from(title.chars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power4.out',
          delay: 0.2
        });
      }
    },
    once: true
  });

  // Cards staggered reveal
  const cards = document.querySelectorAll('.feature-card');
  
  cards.forEach((card, index) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      delay: index * 0.1
    });
  });

  // Hover 3D effect
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
};

/* ============================================
   SHOWCASE CAROUSEL
   ============================================ */
const initShowcase = () => {
  const items = document.querySelectorAll('.showcase-item');

  // Header animation
  ScrollTrigger.create({
    trigger: '.showcase',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.showcase-header .section-tag', {
        opacity: 0,
        y: 20,
        duration: 0.6
      });
      
      if (typeof SplitType !== 'undefined') {
        const title = new SplitType('.showcase-header .section-title', { types: 'chars, words' });
        gsap.from(title.chars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power4.out',
          delay: 0.2
        });
      }
    },
    once: true
  });

  // Items reveal animation
  items.forEach((item, index) => {
    gsap.to(item, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.showcase-carousel',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      delay: index * 0.1
    });
  });

  // Video playback functionality
  const setupVideoPlayback = () => {
    items.forEach(item => {
      const videoContainer = item.querySelector('.showcase-video');
      const video = item.querySelector('.showcase-video-player');
      const playButton = item.querySelector('.play-button');
      const playButtonSvg = playButton.querySelector('svg');
      
      if (!video || !playButton) return;

      // Seek video forward to show a visible frame as thumbnail
      let isFirstPlay = true;
      
      const setVideoThumbnail = () => {
        if (video.duration > 4) {
          video.currentTime = 4;
        }
      };
      
      video.addEventListener('loadedmetadata', setVideoThumbnail);
      // Also try immediately in case metadata is already loaded
      if (video.readyState >= 1) {
        setVideoThumbnail();
      }

      const playIconPath = 'M18 14 L34 24 L18 34 Z';
      const pauseIconPath = 'M16 14h6v20h-6zM26 14h6v20h-6z';
      
      // Reset to beginning when video ends
      video.addEventListener('ended', () => {
        isFirstPlay = true;
        setVideoThumbnail();
      });

      const updateButtonIcon = () => {
        const pathElement = playButtonSvg.querySelector('path');
        if (video.paused) {
          pathElement.setAttribute('d', playIconPath);
        } else {
          pathElement.setAttribute('d', pauseIconPath);
        }
      };

      const togglePlay = () => {
        if (video.paused) {
          // Pause all other videos
          document.querySelectorAll('.showcase-video-player').forEach(v => {
            if (v !== video) {
              v.pause();
              v.closest('.showcase-video').classList.remove('playing');
              const otherButton = v.closest('.showcase-video').querySelector('.play-button svg path');
              if (otherButton) {
                otherButton.setAttribute('d', playIconPath);
              }
            }
          });
          
          // Start from beginning on first play
          if (isFirstPlay) {
            video.currentTime = 0;
            isFirstPlay = false;
          }
          
          video.play();
          videoContainer.classList.add('playing');
        } else {
          video.pause();
          videoContainer.classList.remove('playing');
        }
        updateButtonIcon();
      };

      const overlay = videoContainer.querySelector('.video-play-overlay');

      // Click on play/pause button
      playButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePlay();
      });

      // Click on overlay (but not button)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          e.preventDefault();
          e.stopPropagation();
          togglePlay();
        }
      });

      // Click on video element itself to pause
      video.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePlay();
      });

      // Video ended
      video.addEventListener('ended', () => {
        videoContainer.classList.remove('playing');
        updateButtonIcon();
      });
    });
  };

  setupVideoPlayback();
};

/* ============================================
   FINAL CTA
   ============================================ */
const initFinalCTA = () => {
  ScrollTrigger.create({
    trigger: '.final-cta',
    start: 'top 70%',
    onEnter: () => {
      // Logo animation
      gsap.from('.cta-logo', {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

      // Title animation
      if (typeof SplitType !== 'undefined') {
        const title = new SplitType('.cta-title', { types: 'chars, words' });
        gsap.from(title.chars, {
          opacity: 0,
          y: 80,
          rotateX: -90,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power4.out',
          delay: 0.3
        });
      }

      // Subtitle
      gsap.from('.cta-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.6
      });

      // Button
      gsap.from('.final-cta .btn-primary', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.8
      });

      // Note
      gsap.from('.final-cta .cta-note', {
        opacity: 0,
        duration: 0.6,
        delay: 1
      });
    },
    once: true
  });
};

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('.magnetic-btn');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
};

/* ============================================
   SPLIT TEXT UTILITY
   ============================================ */
// Fallback if SplitType doesn't load
if (typeof SplitType === 'undefined') {
  console.warn('SplitType not loaded, text animations will be simplified');
}
