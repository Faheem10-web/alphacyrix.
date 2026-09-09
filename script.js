/**
 * AGENCY SERVICES — GLOBAL ROUTE NAVIGATION & SCROLL ENGINE
 * Global scroll-to-top reset on all route changes, Lenis smooth scroll, dynamic video switching & reveals
 */

// ==========================================================================
// 1. GLOBAL SCROLL RESTORATION RESET (Runs immediately before DOM render)
// ==========================================================================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Global helper to reset scroll position to top across native and smooth-scroll engines
function resetScrollToTop(immediate = true) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: immediate ? 'instant' : 'smooth'
  });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (window.__lenisInstance) {
    window.__lenisInstance.scrollTo(0, { immediate: immediate });
  }
}

// Ensure scroll is at 0 on initial script parse & beforeunload/pageshow (back-forward cache)
window.addEventListener('pageshow', (event) => {
  resetScrollToTop(true);
});

window.addEventListener('beforeunload', () => {
  resetScrollToTop(true);
});

document.addEventListener('DOMContentLoaded', () => {
  // Ensure top position on DOM ready
  resetScrollToTop(true);

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.service-card');
  const servicesContainer = document.querySelector('.services-container');
  const navButtons = document.querySelectorAll('.nav-btn');
  const cardVideos = document.querySelectorAll('.card-video');

  /* ==========================================================================
     2. LENIS SMOOTH SCROLL INITIALIZATION
     ========================================================================== */
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !isReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth momentum curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      smoothTouch: false,
    });

    window.__lenisInstance = lenisInstance;

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync scroll dynamics with Lenis scroll event
    lenisInstance.on('scroll', () => {
      handleScrollDynamics();
    });

    // Reset to top once Lenis is initialized
    lenisInstance.scrollTo(0, { immediate: true });
  }

  /* ==========================================================================
     3. GLOBAL ROUTE & INTERNAL LINK SCROLL RESET LISTENER
     ========================================================================== */
  // Intercept all internal anchor navigation and route changes
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // If navigating to another page or route without a specific hash anchor
    if (href.startsWith('/') || href.endsWith('.html') || (href.startsWith('http') && href.includes(window.location.host))) {
      // Store flag for next page load
      sessionStorage.setItem('shouldResetScroll', 'true');
    }
  });

  // Check if previous navigation flagged a scroll reset
  if (sessionStorage.getItem('shouldResetScroll') === 'true') {
    sessionStorage.removeItem('shouldResetScroll');
    resetScrollToTop(true);
  }

  // Handle SPA history navigation (popstate / pushState / replaceState)
  window.addEventListener('popstate', () => {
    resetScrollToTop(true);
  });

  /* ==========================================================================
     4. DESIGN SWITCHER WITH DYNAMIC VIDEO SOURCE SWITCHING
     ========================================================================== */
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const designId = btn.getAttribute('data-design');
      
      // 1. Update Active Button State
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. Update Container Design Mode
      if (servicesContainer) {
        servicesContainer.setAttribute('data-active-design', designId);
      }

      // 3. Reset scroll position to top smoothly on design switch
      resetScrollToTop(false);

      // 4. Switch Video Source between Design 1 and Design 2
      cardVideos.forEach(video => {
        let targetSrc = '';
        if (designId === '1') {
          targetSrc = video.getAttribute('data-video-d1');
        } else if (designId === '2') {
          targetSrc = video.getAttribute('data-video-d2');
        } else if (designId === '3') {
          targetSrc = video.getAttribute('data-video-d2') || video.getAttribute('data-video-d1');
        }

        if (targetSrc && video.getAttribute('src') !== targetSrc) {
          video.src = targetSrc;
          video.load();
          video.muted = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      });

      // 5. Smooth Height Equalization Re-sync
      setTimeout(() => {
        syncCardHeights();
        if (lenisInstance) {
          lenisInstance.resize();
        }
      }, 60);
    });
  });

  /* ==========================================================================
     5. DYNAMIC EQUAL HEIGHT SYNC (100% Locked Equal Height on Desktop & Tablet)
     ========================================================================== */
  function syncCardHeights() {
    if (window.innerWidth > 860 && cards.length > 0) {
      cards.forEach(card => {
        card.style.height = '520px';
        card.style.minHeight = '520px';
        card.style.maxHeight = '520px';
      });
    } else {
      cards.forEach(card => {
        card.style.height = 'auto';
        card.style.minHeight = 'auto';
        card.style.maxHeight = 'none';
      });
    }
  }

  syncCardHeights();
  window.addEventListener('resize', () => {
    syncCardHeights();
    if (lenisInstance) {
      lenisInstance.resize();
    }
  });

  /* ==========================================================================
     6. SCROLL ENTRANCE REVEAL (IntersectionObserver)
     ========================================================================== */
  if ('IntersectionObserver' in window && !isReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    cards.forEach(card => revealObserver.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-revealed'));
  }

  /* ==========================================================================
     7. STICKY CENTER EFFECT, CARD EXIT DYNAMICS & SUBTLE MEDIA PARALLAX
     ========================================================================== */
  function handleScrollDynamics() {
    if (isReducedMotion) return;

    const windowHeight = window.innerHeight;
    const centerY = windowHeight / 2;

    cards.forEach(card => {
      if (!card.classList.contains('is-revealed')) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distFromCenter = cardCenter - centerY;
      const normalizedDist = distFromCenter / (windowHeight / 2);

      // Sticky Center Focus (Within 25% of viewport center)
      if (Math.abs(normalizedDist) < 0.28) {
        card.classList.add('card-focused');
        card.classList.remove('card-passed');
      } else if (rect.bottom < centerY * 0.75) {
        // Card scrolled past center towards top exit
        card.classList.remove('card-focused');
        card.classList.add('card-passed');
      } else {
        card.classList.remove('card-focused');
        card.classList.remove('card-passed');
      }

      // Subtle Media Parallax (max 10-14px translation, scale 1 -> 1.025)
      if (window.innerWidth > 860 && rect.top < windowHeight && rect.bottom > 0) {
        const media = card.querySelector('.card-video, .card-img');
        if (media) {
          const parallaxOffset = Math.max(Math.min(-normalizedDist * 12, 14), -14);
          media.style.transform = `translateY(${parallaxOffset}px) scale(1.02)`;
        }
      }
    });
  }

  // Native scroll fallback listener if lenis is not active
  if (!lenisInstance) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollDynamics();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  handleScrollDynamics();

  /* ==========================================================================
     8. RELIABLE VIDEO AUTOPLAY INITIALIZATION
     ========================================================================== */
  cardVideos.forEach(video => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startOnInteraction = () => {
          video.play();
          window.removeEventListener('click', startOnInteraction);
          window.removeEventListener('scroll', startOnInteraction);
          window.removeEventListener('touchstart', startOnInteraction);
        };
        window.addEventListener('click', startOnInteraction);
        window.addEventListener('scroll', startOnInteraction);
        window.addEventListener('touchstart', startOnInteraction);
      });
    }
  });

  /* ==========================================================================
     9. ACTION PILL KEYBOARD ACCESSIBILITY
     ========================================================================== */
  const pills = document.querySelectorAll('.action-pill');
  pills.forEach(pill => {
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });
});
