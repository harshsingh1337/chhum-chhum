import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 6);
    setSearchResults(results);
  }, [searchQuery]);

  const handleSearchSelect = (product) => {
    navigate(`/product/${product.slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    }
  };

  return (
    <>
      <nav id="navbar" className={`navbar-v2 ${scrolled ? 'scrolled' : ''}`}>
        {/* Top Row: Logo Left — Nav Center — Icons Right */}
        <div className="nav-top-row">
          <div className="nav-top-left">
            <Link to="/" className="nav-brand-left">
              <img src="/images/logo.jpeg" alt="ChhumChhum" className="nav-logo-img" />
              <span className="nav-brand-text">ChhumChhum</span>
            </Link>
            <div
              className="nav-icon hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </div>
          </div>

          <div className="nav-top-right">
            <div className="nav-icon" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <Link to="/cart" className="nav-icon" style={{ position: 'relative' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
            </Link>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="nav-bottom-row">
          <Link to="/">Home</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/collections">New Arrivals</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      {/* Search Overlay */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`} ref={searchRef}>
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <svg className="search-form-icon" width="18" height="18" fill="none" stroke="#999" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search sarees by name, fabric, color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </form>
          {searchQuery.trim() && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="search-no-results">No sarees found for "{searchQuery}"</div>
              ) : (
                searchResults.map((p) => (
                  <div key={p.id} className="search-result-item" onClick={() => handleSearchSelect(p)}>
                    <div className="search-result-img">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <div className="search-result-placeholder" />}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-name">{p.name}</div>
                      <div className="search-result-meta">{p.fabric} · ₹{(p.price / 100).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobile-menu">
        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
        <Link to="/collections" onClick={() => setMobileOpen(false)}>Collections</Link>
        <Link to="/collections" onClick={() => setMobileOpen(false)}>New Arrivals</Link>
        <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
        <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart</Link>
      </div>

      {/* Overlay */}
      {(mobileOpen || searchOpen) && (
        <div className="overlay show" onClick={() => { setMobileOpen(false); setSearchOpen(false); }} />
      )}
    </>
  );
}
