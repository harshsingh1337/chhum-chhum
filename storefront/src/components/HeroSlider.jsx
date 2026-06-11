import { useState, useEffect } from 'react';
import { vercelImageUrl } from '../lib/vercelImage';

const slides = [
  {
    image: '/images/hero-sec 1.png',
  },
  {
    image: '/images/hero-sec 2.png',
  },
  {
    image: '/images/hero-sec 3.png',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? 'active' : ''}`}
            style={{
            backgroundImage: `url("${vercelImageUrl(slide.image, { w: 1200 })}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}

      <div className="hero-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}