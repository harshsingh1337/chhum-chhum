import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import Marquee from '../components/Marquee';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import Footer from '../components/Footer';
import { useProducts, useCollections } from '../hooks/useInsforge';

export default function HomePage() {
  const navigate = useNavigate();
  const { products, loading: pLoading } = useProducts();
  const { collections, loading: cLoading } = useCollections();

  // Best sellers: tagged products first, then others, max 4
  const bestSellers = [
    ...products.filter((p) => p.tag === 'Best Seller' || p.tag === 'New'),
    ...products.filter((p) => !p.tag),
  ].slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pLoading, cLoading]);

  return (
    <div className="page active">
      <HeroSlider onExplore={() => navigate('/collections')} />
      <Marquee />

      {/* Featured Collections */}
      <section>
        <div className="section-header-row">
          <div>
            <div className="section-label">Explore</div>
            <h2 className="section-title">Featured <em>Collections</em></h2>
          </div>
          <button className="btn" onClick={() => navigate('/collections')}>View All</button>
        </div>
        <div className="collections-scroll">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="section-header-row">
          <div>
            <div className="section-label">Most Loved</div>
            <h2 className="section-title">Best <em>Sellers</em></h2>
          </div>
        </div>
        <div className="product-grid product-grid-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Store Section */}
      <section className="store-section" style={{ padding: 0 }}>
        <div className="store-bg-pattern"></div>
        <div className="store-content">
          <div className="store-label">Visit Us</div>
          <h2 className="store-title">Our Studio &amp;<br />Flagship Store</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic', fontFamily: "'Cormorant Garamond',serif" }}>
            Where every drape tells a story
          </p>
          <div className="store-card">
            <div className="store-address">Delhi — 930, Gali Pattal Wali, Maliwara, Chandni Chowk, 110006</div>
            <button className="btn btn-gold" onClick={() => window.open('https://claude.ai/share/7fd41335-42a2-44b4-906d-7ba8d872cab5', '_blank')}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              View Direction
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
