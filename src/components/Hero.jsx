import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Hero({ onOpenModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [video2Thumb, setVideo2Thumb] = useState('/assets/card-thumb-slide2.jpg');

  const video0Ref = useRef(null);
  const video1Ref = useRef(null);
  const transitionTimerRef = useRef(null);

  const slideData = [
    {
      thumb: 'https://res.cloudinary.com/s65vvowk/video/upload/v1789185713/fhfh.jpg',
      bgIndex: 0
    },
    {
      thumb: video2Thumb,
      bgIndex: 1
    }
  ];

  const clearTimer = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  };

  const goToSlide = useCallback((index) => {
    clearTimer();
    setCurrentSlide(index);

    if (index === 0) {
      setProgressWidth(0);
      if (video0Ref.current) {
        video0Ref.current.currentTime = 0;
        if (isPlaying) {
          video0Ref.current.play().catch(() => {});
        }
      }
      if (video1Ref.current) {
        video1Ref.current.pause();
      }
    } else {
      setProgressWidth(100);
      if (video1Ref.current) {
        video1Ref.current.currentTime = 0;
        if (isPlaying) {
          video1Ref.current.play().catch(() => {});
        }
      }
      if (video0Ref.current) {
        video0Ref.current.pause();
      }
    }
  }, [isPlaying]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % 2);
  }, [currentSlide, goToSlide]);

  // Video 0 Timeupdate and ended handlers
  useEffect(() => {
    const vid0 = video0Ref.current;
    if (!vid0) return;

    const handleTimeUpdate = () => {
      if (currentSlide === 0 && vid0.duration) {
        const pct = (vid0.currentTime / vid0.duration) * 100;
        setProgressWidth(Math.min(100, Math.max(0, pct)));
      }
    };

    const handleEnded = () => {
      if (currentSlide === 0 && isPlaying) {
        setProgressWidth(100);
        clearTimer();
        transitionTimerRef.current = setTimeout(() => {
          goToSlide(1);
        }, 350);
      }
    };

    vid0.addEventListener('timeupdate', handleTimeUpdate);
    vid0.addEventListener('ended', handleEnded);

    return () => {
      vid0.removeEventListener('timeupdate', handleTimeUpdate);
      vid0.removeEventListener('ended', handleEnded);
    };
  }, [currentSlide, isPlaying, goToSlide]);

  // Video 1 ended handler
  useEffect(() => {
    const vid1 = video1Ref.current;
    if (!vid1) return;

    const handleEnded = () => {
      if (currentSlide === 1 && isPlaying) {
        clearTimer();
        transitionTimerRef.current = setTimeout(() => {
          goToSlide(0);
        }, 350);
      }
    };

    const handleLoadedData = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid1, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (dataUrl && dataUrl.length > 100) {
          setVideo2Thumb(dataUrl);
        }
      } catch (e) {}
    };

    vid1.addEventListener('ended', handleEnded);
    vid1.addEventListener('loadeddata', handleLoadedData);

    return () => {
      vid1.removeEventListener('ended', handleEnded);
      vid1.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentSlide, isPlaying, goToSlide]);

  // Fallback timer in case video stalls or ends without event
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;

    if (currentSlide === 0) {
      const vid0 = video0Ref.current;
      const timeoutMs = (vid0 && vid0.duration && !isNaN(vid0.duration))
        ? (vid0.duration + 1.2) * 1000
        : 22000;
      transitionTimerRef.current = setTimeout(() => {
        if (isPlaying) goToSlide(1);
      }, timeoutMs);
    } else {
      const vid1 = video1Ref.current;
      const timeoutMs = (vid1 && vid1.duration && !isNaN(vid1.duration))
        ? (vid1.duration + 1) * 1000
        : 8500;
      transitionTimerRef.current = setTimeout(() => {
        if (isPlaying) goToSlide(0);
      }, timeoutMs);
    }

    return clearTimer;
  }, [currentSlide, isPlaying, goToSlide]);

  const togglePlayPause = () => {
    if (isPlaying) {
      clearTimer();
      setIsPlaying(false);
      if (video0Ref.current) video0Ref.current.pause();
      if (video1Ref.current) video1Ref.current.pause();
    } else {
      setIsPlaying(true);
      const activeVid = currentSlide === 0 ? video0Ref.current : video1Ref.current;
      if (activeVid) activeVid.play().catch(() => {});
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* Cinematic Backdrop Slides */}
      <div className="hero-backdrop">
        <div className="backdrop-image-wrapper">
          <video
            ref={video0Ref}
            autoPlay
            muted
            playsInline
            preload="auto"
            className={`backdrop-img backdrop-video slide-bg ${currentSlide === 0 ? 'active' : ''}`}
            id="heroBgVideo"
            data-bg-index="0"
          >
            <source src="https://res.cloudinary.com/s65vvowk/video/upload/v1789185713/fhfh.mp4" type="video/mp4" />
          </video>
          <div className={`slide-video-wrap slide-bg ${currentSlide === 1 ? 'active' : ''}`} data-bg-index="1">
            <video
              ref={video1Ref}
              muted
              playsInline
              preload="auto"
              className="backdrop-img backdrop-video"
              id="heroBgVideo3"
            >
              <source src="/assets/hero-video-3.mp4" type="video/mp4" />
            </video>
            <div className="slide-dark-gradient"></div>
          </div>
        </div>
      </div>

      {/* Foreground Floating Content */}
      <div className="hero-foreground container">
        <div className="hero-headline-block">
          <h1 className="hero-title">
            <span className="title-line">Experiences Powered</span>
            <span className="title-line">by <span className="keyword-gradient">Intelligence</span></span>
          </h1>

          <div className="hero-cta-wrapper">
            <button className="btn-get-in-touch" id="heroGetInTouchBtn" onClick={onOpenModal}>
              <span className="icon-circle">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <span className="btn-label">GET IN TOUCH</span>
            </button>
          </div>
        </div>

        {/* Bottom Right Floating Mini-Player Showcase Widget */}
        <div className="hero-showcase-widget" id="heroWidget">
          <div className="widget-preview-card" id="widgetPreviewCard">
            <img
              src={slideData[currentSlide]?.thumb || slideData[0].thumb}
              alt="Intelligence That Adapts"
              className="widget-card-image"
              id="widgetThumbImg"
            />
            <div className="widget-glass-sheen"></div>
          </div>

          {/* Sleek Slider Controls Capsule */}
          <div className="widget-controls-capsule">
            <div
              className={`slider-progress-capsule ${currentSlide === 0 ? 'active' : ''}`}
              data-index="0"
              id="slideIndicator0"
              onClick={() => {
                goToSlide(0);
                if (!isPlaying) setIsPlaying(true);
              }}
            >
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  id="progressFill0"
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
            </div>
            <button
              className={`slider-dot ${currentSlide === 1 ? 'active' : ''}`}
              data-index="1"
              id="slideDot1"
              aria-label="Slide 2"
              onClick={() => {
                goToSlide(1);
                if (!isPlaying) setIsPlaying(true);
              }}
            ></button>
            <button
              className="slider-dot"
              data-index="2"
              id="slideDot2"
              aria-label="Slide 3"
              onClick={() => {
                goToSlide(0);
                if (!isPlaying) setIsPlaying(true);
              }}
            ></button>
            <button
              className="btn-pause-toggle"
              id="playPauseBtn"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlayPause}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} id="playPauseIcon"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
