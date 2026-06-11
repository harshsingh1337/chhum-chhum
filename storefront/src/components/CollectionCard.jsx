import { useNavigate } from 'react-router-dom';

export default function CollectionCard({ collection }) {
  const navigate = useNavigate();

  return (
    <div className="collection-card fade-up" onClick={() => navigate('/collections')}>
      {collection.image ? (
        <img className="collection-card-bg" src={collection.image} alt={collection.name} loading="lazy" style={{ objectFit: 'cover' }} />
      ) : (
        <div className={`collection-card-bg ${collection.colorClass || 'saree-a'}`}></div>
      )}
      <div className="collection-card-overlay">
        <div className="collection-card-name">{collection.name}</div>
        <div className="collection-card-count">{collection.productCount} pieces</div>
      </div>
    </div>
  );
}
