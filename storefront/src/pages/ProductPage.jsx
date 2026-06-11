import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useProduct } from '../hooks/useInsforge';
import { formatPrice, getRelatedProducts } from '../data/products';
import { vercelImageUrl } from '../lib/vercelImage';

const thumbVariants = [
  { filter: '' },
  { filter: '' },
  { filter: 'brightness(0.9)' },
  { filter: 'brightness(1.05)' },
];

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { showToast } = useToast();

  const { product, loading } = useProduct(slug);
  const related = getRelatedProducts(slug);

  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState('None');
  const [qty, setQty] = useState(1);
  const [openDetail, setOpenDetail] = useState('desc');

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
  }, [loading, slug]);

  if (loading) {
    return (
      <div className="page active" style={{ textAlign: 'center', padding: '8rem 2rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--light)' }}>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page active" style={{ textAlign: 'center', padding: '8rem 2rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem' }}>Product Not Found</h2>
        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/collections')}>Browse Collections</button>
      </div>
    );
  }

  const images = product.images || [];
  const thumbImages = images.length > 0 ? images : [null, null];

  function handleAddToCart() {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size: selectedSize,
        quantity: qty,
        colorClass: product.colorClass1,
        image: images[0] || null,
        slug: product.slug,
      },
    });
    showToast('Added to cart');
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate('/checkout');
  }

  function toggleDetail(id) {
    setOpenDetail(openDetail === id ? '' : id);
  }

  return (
    <div className="page active">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sarees', to: '/collections' },
        { label: product.name },
      ]} />

      <div className="product-layout">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="gallery-thumbs">
            {thumbImages.map((img, i) => (
              <div key={i} className={`gallery-thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                {img ? (
                  <img src={vercelImageUrl(img, { w: 300 })} alt={`View ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                ) : (
                  <div className={`gallery-thumb-inner ${i % 2 === 0 ? (product.colorClass1||'saree-a') : (product.colorClass2||'saree-f')}`} style={{ borderRadius: '2px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="gallery-main">
            {images[activeThumb] ? (
              <img className="gallery-main-inner" src={vercelImageUrl(images[activeThumb] || images[0], { w: 900 })} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
            ) : (
              <div className={`gallery-main-inner ${product.colorClass1||'saree-a'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
                <svg viewBox="0 0 80 180" fill="none" width="120" style={{ opacity: 0.2 }}><ellipse cx="40" cy="25" rx="18" ry="22" fill="#c97b7b" /><path d="M22 47 Q15 80 18 120 Q16 155 22 175 Q31 180 40 175 Q49 180 58 175 Q64 155 62 120 Q65 80 58 47 Q52 40 40 38 Q28 40 22 47Z" fill="#e8a0a0" /></svg>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <h1 className="product-title">{product.name}</h1>
          <div className="divider"></div>
          <div className="product-price">
            <span className="currency">₹ </span>
            {(product.price / 100).toLocaleString('en-IN')}
            <span style={{ fontSize: '0.75rem', color: 'var(--mid)', marginLeft: '0.5rem' }}>Taxes included</span>
          </div>

          <div className="size-label">Underskirt / Petticoat</div>
          <div className="size-options">
            {(product.sizes || ['None', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']).map((size) => (
              <button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
            ))}
          </div>

          <div className="qty-row">
            <div className="size-label" style={{ margin: 0 }}>Quantity</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <div className="qty-val">{qty}</div>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleBuyNow}>Buy it now</button>

          <div className="product-details">
            {[
              { id: 'desc', title: 'Description', content: product.description },
              { id: 'dim', title: 'Dimensions', content: product.dimensions },
              { id: 'care', title: 'Care Instructions', content: product.care },
              { id: 'custom', title: 'Customisations', content: product.customisation },
            ].map((detail) => (
              <div key={detail.id}>
                <div className="detail-row" onClick={() => toggleDetail(detail.id)}>
                  <span className="detail-row-title">{detail.title}</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: openDetail === detail.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <div className={`detail-content ${openDetail === detail.id ? 'open' : ''}`}>
                  {detail.content?.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="also-like">
        <div className="section-label">You May Also Like</div>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Related <em>Pieces</em></h2>
        <div className="also-like-scroll">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
