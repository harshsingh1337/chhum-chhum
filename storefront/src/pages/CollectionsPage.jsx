import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useInsforge';
import { allColors, allFabrics, allOccasions } from '../data/products';

export default function CollectionsPage() {
  const { products, loading } = useProducts();
  const [sortBy, setSortBy] = useState('best');
  const [priceMax, setPriceMax] = useState(600000);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  const toggle = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, sortBy, priceMax, selectedFabrics, selectedColors, selectedOccasions, selectedAvailability]);

  const filtered = products
    .filter((p) => p.price <= priceMax)
    .filter((p) => selectedFabrics.length === 0 || selectedFabrics.includes(p.fabric))
    .filter((p) => selectedColors.length === 0 || selectedColors.includes(p.color))
    .filter((p) => selectedOccasions.length === 0 || (p.occasion || []).some((o) => selectedOccasions.includes(o)))
    .filter((p) => selectedAvailability.length === 0 || selectedAvailability.includes(p.availability))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const activeFilters = selectedFabrics.length + selectedColors.length + selectedOccasions.length + selectedAvailability.length + (priceMax < 600000 ? 1 : 0);

  return (
    <div className="page active">
      <div className="page-banner">
        <div className="page-banner-label">ChhumChhum</div>
        <h1 className="page-banner-title">Sarees</h1>
        <div className="page-banner-count">{filtered.length} products</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 4rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
          {activeFilters > 0 && <button className="btn" style={{ fontSize: '0.65rem', padding: '0.3rem 0.8rem', marginRight: '0.5rem' }} onClick={() => { setSelectedFabrics([]); setSelectedColors([]); setSelectedOccasions([]); setSelectedAvailability([]); setPriceMax(600000); }}>Clear all</button>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Sort by:</span>
          <select className="form-select" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="best">Best selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <section style={{ padding: '2rem 4rem' }}>
        <div className="collection-page-layout">
          <div className="collection-sidebar">
            {/* Availability */}
            <div className="filter-group">
              <div className="filter-title">Availability</div>
              <div className="filter-options">
                {[['ready', 'Ready to Ship'], ['made_to_order', 'Made to Order']].map(([val, label]) => (
                  <label key={val} className="filter-option">
                    <input type="checkbox" checked={selectedAvailability.includes(val)} onChange={() => toggle(selectedAvailability, setSelectedAvailability, val)} />
                    {label} ({products.filter((p) => p.availability === val).length})
                  </label>
                ))}
              </div>
            </div>

            {/* Fabric */}
            <div className="filter-group">
              <div className="filter-title">Fabric</div>
              <div className="filter-options">
                {allFabrics.map((f) => (
                  <label key={f} className="filter-option">
                    <input type="checkbox" checked={selectedFabrics.includes(f)} onChange={() => toggle(selectedFabrics, setSelectedFabrics, f)} />
                    {f} ({products.filter((p) => p.fabric === f).length})
                  </label>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="filter-group">
              <div className="filter-title">Color</div>
              <div className="filter-options">
                {allColors.map((c) => (
                  <label key={c} className="filter-option">
                    <input type="checkbox" checked={selectedColors.includes(c)} onChange={() => toggle(selectedColors, setSelectedColors, c)} />
                    {c} ({products.filter((p) => p.color === c).length})
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="filter-group">
              <div className="filter-title">Occasion</div>
              <div className="filter-options">
                {allOccasions.map((o) => (
                  <label key={o} className="filter-option">
                    <input type="checkbox" checked={selectedOccasions.includes(o)} onChange={() => toggle(selectedOccasions, setSelectedOccasions, o)} />
                    {o} ({products.filter((p) => (p.occasion || []).includes(o)).length})
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="filter-title">Price Range</div>
              <div className="price-range">
                <input type="range" min="300000" max="600000" step="50000" value={priceMax} onChange={(e) => setPriceMax(parseInt(e.target.value))} />
                <div className="price-labels"><span>₹3,000</span><span>₹{(priceMax / 100).toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--light)' }}>Loading products...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--light)' }}>No products match your filters. <button className="btn" style={{ marginTop: '1rem' }} onClick={() => { setSelectedFabrics([]); setSelectedColors([]); setSelectedOccasions([]); setSelectedAvailability([]); setPriceMax(600000); }}>Clear filters</button></div>
            ) : (
              <div className="product-grid product-grid-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
