import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { vercelImageUrl } from '../lib/vercelImage';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const img1 = product.images?.[0];
  const img2 = product.images?.[1] || img1;

  return (
    <div className="product-card fade-up" onClick={() => navigate(`/product/${product.slug}`)}>
      <div className="product-card-img">
        {img1 ? (
          <>
            <img className="img-1" src={vercelImageUrl(img1, { w: 600 })} alt={product.name} loading="lazy" />
            <img className="img-2" src={vercelImageUrl(img2, { w: 600 })} alt={product.name + ' alt'} loading="lazy" />
          </>
        ) : (
          <>
            <div className={`img-placeholder img-1 ${product.colorClass1 || 'saree-a'}`} />
            <div className={`img-placeholder img-2 ${product.colorClass2 || 'saree-f'}`} />
          </>
        )}
        {product.tag && <div className="product-card-tag">{product.tag}</div>}
        <div className="product-card-wishlist">
          <svg width="14" height="14" fill="none" stroke="#c97b7b" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>
      <div className="product-card-info">
        <div className="product-card-sub">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">{formatPrice(product.price)}</div>
      </div>
    </div>
  );
}
