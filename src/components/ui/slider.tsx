import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Building2, Award, Globe } from 'lucide-react';
import Button from './Button';

const slidesData = [
  { id: 1, 
    bg: 'https://i.postimg.cc/bv6pwHHx/Whats-App-Image-2025-09-10-at-20-18-04-251b45bb.jpg', 
    text: 'Welcome to EngNext',
    desc: 'Bridging the gap between talented Engineering students and industry leaders. Your gateway to exceptional job opportunities.' },
  { id: 2, 
    bg: 'https://i.postimg.cc/gJXFk90p/474564388-1645851299349445-6805054092875662533-n.jpg', 
    text: 'Engineering Futures',
    desc: 'Empowering the next generation of innovators through unmatched professional connections.'
   },
  { id: 3, 
    bg: 'https://i.postimg.cc/nhpJKw3K/Whats-App-Image-2025-09-10-at-20-18-05-d16c7e81.jpg', 
    text: 'Talent Meets Opportunity',
    desc: 'Bringing skilled engineering students face-to-face with industry trailblazers for meaningful job positions.'
   },
];

const Slider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setIndex((prevIndex) => (prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1));
    }, 6000);

    return () => resetTimeout();
  }, [index]);

  const prevSlide = () => {
    setIndex(index === 0 ? slidesData.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex(index === slidesData.length - 1 ? 0 : index + 1);
  };

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex);
  };

  return (
    <div className="modern-slider group">
      <div className="slider-container">
        <div
          className="slides-wrapper"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slidesData.map((slide, i) => (
            <div
              key={slide.id}
              className={`slide ${i === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              {/* Gradient Overlays */}
              <div className="gradient-overlay-primary"></div>
              <div className="gradient-overlay-secondary"></div>
              
              {/* Animated Background Elements */}
              <div className="floating-elements">
                <div className="floating-circle circle-1"></div>
                <div className="floating-circle circle-2"></div>
                <div className="floating-circle circle-3"></div>
              </div>

              {/* Content */}
              <div className="slide-content">
                <div className="content-wrapper">
                  <div className="slide-number">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <div className="slide-progress">
                      <div className="progress-bar" style={{ 
                        width: i === index ? '100%' : '0%',
                        transition: i === index ? 'width 6s linear' : 'none'
                      }}></div>
                    </div>
                  </div>
                  
                  <h1 className="slide-title">
                    {slide.text.split(' ').map((word, wordIndex) => (
                      <span 
                        key={wordIndex}
                        className="word"
                        style={{ animationDelay: `${wordIndex * 0.1}s` }}
                      >
                        {word}
                      </span>
                    ))}
                  </h1>
                  
                  <p className="slide-description text-white">
                    {slide.desc.split(' ').map((word, wordIndex) => (
                      <span 
                        key={wordIndex}
                        className="word"
                        style={{ animationDelay: `${wordIndex * 0.1}s` }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>

                  <div className="cta-buttons">
                  <Link to="/login">
                    <Button size="lg" className="btn-primary">
                    Get Started <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" className="btn-secondary">
                    Learn More <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="nav-arrow prev-arrow"
          aria-label="Previous Slide"
        >
          <div className="arrow-bg"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="nav-arrow next-arrow"
          aria-label="Next Slide"
        >
          <div className="arrow-bg"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Modern Pagination Dots */}
        <div className="pagination-container">
          <div className="pagination-dots">
            {slidesData.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`pagination-dot ${index === i ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className="dot-inner"></div>
                <div className="dot-progress">
                  <svg className="progress-ring" width="40" height="40">
                    <circle
                      className="progress-ring-circle"
                      cx="20"
                      cy="20"
                      r="16"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <circle
                      className="progress-ring-progress"
                      cx="20"
                      cy="20"
                      r="16"
                      fill="transparent"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      strokeDashoffset={i === index ? 0 : 2 * Math.PI * 16}
                      style={{
                        transition: i === index ? 'stroke-dashoffset 6s linear' : 'none',
                      }}
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Slide Thumbnails */}
        <div className="thumbnail-strip">
          {slidesData.map((slide, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`thumbnail ${index === i ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className="thumbnail-overlay"></div>
              <span className="thumbnail-number">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .modern-slider {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slides-wrapper {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide {
          position: relative;
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Gradient Overlays */
        .gradient-overlay-primary {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.5) 0%,
            rgba(30, 41, 59, 0.4) 50%,
            rgba(15, 23, 42, 0.6) 100%
          );
          z-index: 1;
        }

        .gradient-overlay-secondary {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 70%,
            rgba(59, 130, 246, 0.3) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 20%,
            rgba(147, 51, 234, 0.3) 0%,
            transparent 50%
          );
          z-index: 2;
        }

        /* Floating Animation Elements */
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          overflow: hidden;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
          animation: float 20s infinite linear;
        }

        .circle-1 {
          width: 200px;
          height: 200px;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: -75px;
          animation-delay: -7s;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: -50px;
          left: 50%;
          animation-delay: -14s;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        /* Content Styling */
        .slide-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1200px;
          padding: 0 2rem;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
        }

        .slide-number {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        .slide-progress {
          width: 60px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 1px;
        }

        .slide-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          color: white;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .slide.active .word {
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
          transform: translateY(50px);
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .word {
          display: inline-block;
          margin-right: 0.3em;
        }

        .slide-description {
          max-width: 600px;
        }

        .slide-description p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
          font-weight: 300;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          position: relative;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }

        .btn-primary .btn-bg {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1d4ed8, #7c3aed);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .btn-primary:hover .btn-bg {
          left: 0;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Navigation Arrows */
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(20px);
          color: white;
          cursor: pointer;
          z-index: 4;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }

        .modern-slider:hover .nav-arrow {
          opacity: 1;
        }

        .prev-arrow {
          left: 2rem;
        }

        .next-arrow {
          right: 2rem;
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-50%) scale(1.1);
        }

        .arrow-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-arrow:hover .arrow-bg {
          opacity: 1;
        }

        /* Pagination */
        .pagination-container {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
        }

        .pagination-dots {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .pagination-dot {
          position: relative;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot-inner {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .pagination-dot.active .dot-inner {
          background: white;
          transform: scale(1.5);
        }

        .dot-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .progress-ring-circle {
          transition: stroke-dashoffset 0.3s ease;
        }

        .progress-ring-progress {
          transform: rotate(-90deg);
          transform-origin: 20px 20px;
        }

        /* Thumbnail Strip */
        .thumbnail-strip {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 4;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-slider:hover .thumbnail-strip {
          opacity: 1;
          transform: translateX(0);
        }

        .thumbnail {
          position: relative;
          width: 80px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail.active {
          border-color: white;
          transform: scale(1.1);
        }

        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          transition: opacity 0.3s ease;
        }

        .thumbnail:hover .thumbnail-overlay {
          opacity: 0.2;
        }

        .thumbnail.active .thumbnail-overlay {
          opacity: 0;
        }

        .thumbnail-number {
          position: relative;
          z-index: 2;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-slider {
            height: 70vh;
            min-height: 500px;
          }

          .slide-content {
            padding: 0 1rem;
          }

          .content-wrapper {
            align-items: center;
            text-align: center;
          }

          .cta-buttons {
            justify-content: center;
          }

          .nav-arrow {
            width: 50px;
            height: 50px;
          }

          .prev-arrow {
            left: 1rem;
          }

          .next-arrow {
            right: 1rem;
          }

          .thumbnail-strip {
            display: none;
          }

          .pagination-container {
            bottom: 1rem;
          }
        }

        @media (max-width: 480px) {
          .slide-title {
            font-size: 2rem;
          }

          .slide-description p {
            font-size: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            padding: 0.875rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Slider;