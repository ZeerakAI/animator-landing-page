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

  // Video click opens modal (handled by initVideoModal)
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
  const magneticRadius = 150; // Distance in pixels to start the magnetic effect
  const pullStrength = 0.4; // How strongly the button pulls (0-1)

  buttons.forEach(button => {
    let isInProximity = false;

    // Track mouse movement globally for proximity detection
    const handleGlobalMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      // Calculate distance from mouse to button center
      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < magneticRadius) {
        isInProximity = true;

        // Calculate pull strength based on distance (closer = stronger)
        const strength = (1 - distance / magneticRadius) * pullStrength;

        // Move button toward mouse
        gsap.to(button, {
          x: distanceX * strength,
          y: distanceY * strength,
          scale: 1 + (strength * 0.1),
          duration: 0.3,
          ease: 'power2.out'
        });
      } else if (isInProximity) {
        // Mouse left proximity zone, reset button
        isInProximity = false;
        gsap.to(button, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    };

    // Direct hover - stronger effect when directly on button
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.35,
        y: y * 0.35,
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });

    // Add global listener for proximity effect
    document.addEventListener('mousemove', handleGlobalMouseMove);
  });
};

/* ============================================
   SPLIT TEXT UTILITY
   ============================================ */
// Fallback if SplitType doesn't load
if (typeof SplitType === 'undefined') {
  console.warn('SplitType not loaded, text animations will be simplified');
}

/* ============================================
   VIDEO MODAL
   ============================================ */
const initVideoModal = () => {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalBackdrop = modal.querySelector('.modal-backdrop');
  const modalClose = modal.querySelector('.modal-close');
  const modalPrev = modal.querySelector('.modal-prev');
  const modalNext = modal.querySelector('.modal-next');
  const modalPlayBtn = modal.querySelector('.modal-play-btn');
  const progressBar = modal.querySelector('.progress-bar');
  const progressFilled = modal.querySelector('.progress-filled');
  const timeDisplay = modal.querySelector('.time-display');
  const modalCategory = modal.querySelector('.modal-category');
  const modalTitle = modal.querySelector('.modal-title');

  const showcaseItems = document.querySelectorAll('.showcase-item');
  let currentIndex = 0;

  const videoData = Array.from(showcaseItems).map(item => ({
    src: item.querySelector('source').src,
    category: item.querySelector('.showcase-category').textContent,
    title: item.dataset.title
  }));

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = () => {
    const percent = (modalVideo.currentTime / modalVideo.duration) * 100;
    progressFilled.style.width = `${percent}%`;
    timeDisplay.textContent = `${formatTime(modalVideo.currentTime)} / ${formatTime(modalVideo.duration || 0)}`;
  };

  const openModal = (index) => {
    currentIndex = index;
    const data = videoData[index];

    modalVideo.querySelector('source').src = data.src;
    modalVideo.load();
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-play after a brief delay
    setTimeout(() => {
      modalVideo.play();
      modalPlayBtn.classList.add('playing');
    }, 300);
  };

  const closeModal = () => {
    modalVideo.pause();
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalPlayBtn.classList.remove('playing');
    progressFilled.style.width = '0%';
  };

  const navigateVideo = (direction) => {
    modalVideo.pause();
    currentIndex = (currentIndex + direction + videoData.length) % videoData.length;
    const data = videoData[currentIndex];

    modalVideo.querySelector('source').src = data.src;
    modalVideo.load();
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;

    modalVideo.play();
    modalPlayBtn.classList.add('playing');
  };

  const togglePlay = () => {
    if (modalVideo.paused) {
      modalVideo.play();
      modalPlayBtn.classList.add('playing');
    } else {
      modalVideo.pause();
      modalPlayBtn.classList.remove('playing');
    }
  };

  // Click on showcase items to open modal
  showcaseItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      openModal(index);
    });
  });

  // Modal controls
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', () => navigateVideo(-1));
  modalNext.addEventListener('click', () => navigateVideo(1));
  modalPlayBtn.addEventListener('click', togglePlay);

  // Click on video to toggle play
  modalVideo.addEventListener('click', togglePlay);

  // Progress bar click to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    modalVideo.currentTime = percent * modalVideo.duration;
  });

  // Update progress bar
  modalVideo.addEventListener('timeupdate', updateProgress);
  modalVideo.addEventListener('loadedmetadata', updateProgress);

  // Video ended
  modalVideo.addEventListener('ended', () => {
    modalPlayBtn.classList.remove('playing');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        navigateVideo(-1);
        break;
      case 'ArrowRight':
        navigateVideo(1);
        break;
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
    }
  });
};

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', initVideoModal);
