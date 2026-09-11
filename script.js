/**
 * ALPHACYRIX — Interactive Engine & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 18);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const setActiveNav = () => {
    const sections = [...document.querySelectorAll('section[id], footer[id]')];
    let currentId = 'hero';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  };

  setActiveNav();
  window.addEventListener('scroll', setActiveNav, { passive: true });

  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 2. Billboard Screen Slider & Showcase Widget Sync
  const bgSlides = document.querySelectorAll('.slide-bg');
  const heroBgVideo = document.getElementById('heroBgVideo');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');

  const widgetThumbImg = document.getElementById('widgetThumbImg');
  const slideIndicator0 = document.getElementById('slideIndicator0');
  const progressFill0 = document.getElementById('progressFill0');
  const slideDot1 = document.getElementById('slideDot1');
  const slideDot2 = document.getElementById('slideDot2');

  const slideData = [
    {
      thumb: 'assets/card-thumb-savant.jpg',
      bgIndex: 0
    },
    {
      thumb: 'assets/card-thumb-slide2.jpg',
      bgIndex: 1
    }
  ];

  const heroBgVideo3 = document.getElementById('heroBgVideo3');
  if (heroBgVideo3) {
    heroBgVideo3.addEventListener('loadeddata', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(heroBgVideo3, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (dataUrl && dataUrl.length > 100) {
          slideData[1].thumb = dataUrl;
          if (currentSlide === 1 && widgetThumbImg) {
            widgetThumbImg.src = dataUrl;
          }
        }
      } catch (e) {}
    });
  }

  let currentSlide = 0;
  let isPlaying = true;
  let slideInterval = null;

  function goToSlide(index) {
    const allSlides = document.querySelectorAll('.slide-bg');
    if (allSlides.length > 0) {
      allSlides.forEach((slide, i) => {
        const isActive = (i === index);
        slide.classList.toggle('active', isActive);
        const vid = slide.tagName === 'VIDEO' ? slide : slide.querySelector('video');
        if (vid) {
          if (isActive && isPlaying) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        }
      });
    }

    if (index === 0) {
      if (progressFill0) progressFill0.style.width = '70%';
      if (slideDot1) slideDot1.classList.remove('active');
    } else if (index === 1) {
      if (progressFill0) progressFill0.style.width = '0%';
      if (slideDot1) slideDot1.classList.add('active');
    }

    if (slideData[index] && widgetThumbImg) {
      widgetThumbImg.src = slideData[index].thumb;
    }

    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slideData.length;
    goToSlide(nextIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, 5000);
    isPlaying = true;
    if (playPauseIcon) {
      playPauseIcon.className = 'fa-solid fa-pause';
    }
    const currentSlideEl = document.querySelectorAll('.slide-bg')[currentSlide];
    if (currentSlideEl) {
      const vid = currentSlideEl.tagName === 'VIDEO' ? currentSlideEl : currentSlideEl.querySelector('video');
      if (vid) vid.play().catch(() => {});
    }
  }

  function stopAutoplay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
    isPlaying = false;
    if (playPauseIcon) {
      playPauseIcon.className = 'fa-solid fa-play';
    }
    document.querySelectorAll('.backdrop-video').forEach(v => v.pause());
  }

  if (slideIndicator0) {
    slideIndicator0.addEventListener('click', () => {
      goToSlide(0);
      if (isPlaying) startAutoplay();
    });
  }

  if (slideDot1) {
    slideDot1.addEventListener('click', () => {
      goToSlide(1);
      if (isPlaying) startAutoplay();
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  startAutoplay();

  // 3. Modals & Notifications
  const projectModal = document.getElementById('projectModal');
  const openProjectModalBtn = document.getElementById('openProjectModalBtn');
  const heroGetInTouchBtn = document.getElementById('heroGetInTouchBtn');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const projectModalForm = document.getElementById('projectModalForm');

  function openModal() {
    if (projectModal) projectModal.classList.add('active');
  }

  function closeModal() {
    if (projectModal) projectModal.classList.remove('active');
  }

  if (openProjectModalBtn) openProjectModalBtn.addEventListener('click', openModal);
  if (heroGetInTouchBtn) heroGetInTouchBtn.addEventListener('click', openModal);
  if (closeProjectModal) closeProjectModal.addEventListener('click', closeModal);

  if (projectModal) {
    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) closeModal();
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  if (projectModalForm) {
    projectModalForm.addEventListener('submit', e => {
      e.preventDefault();
      closeModal();
      projectModalForm.reset();
      showToast('Project brief submitted! Our team will contact you within 24 hours.');
    });
  }

  // 4. Hero Scroll Down Indicator Click Action
  const heroScrollIndicator = document.getElementById('heroScrollIndicator');
  if (heroScrollIndicator) {
    heroScrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('work') || document.querySelector('section:not(.hero-section)');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
      }
    });
  }
});
