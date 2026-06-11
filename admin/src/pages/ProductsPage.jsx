import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { insforge } from '../lib/insforge';

const columns = [
  { key: 'name', label: 'Product', render: (v) => <strong>{v}</strong> },
  { key: 'brand', label: 'Brand' },
  { key: 'price', label: 'Price' },
  { key: 'fabric', label: 'Fabric' },
  { key: 'tag', label: 'Tag' },
  { key: 'active', label: 'Status', render: (v) => <span className={`status-badge ${v ? 'active-badge' : 'inactive-badge'}`}>{v ? 'Active' : 'Inactive'}</span> },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge.from('products').select('*').order('created_at', { ascending: true });
        if (!error && data) {
          setProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: '₹' + (p.price / 100).toLocaleString('en-IN'),
            fabric: p.fabric,
            tag: p.tag || '-',
            active: p.is_active,
          })));
        }
      } catch (e) {
        console.warn('Products fetch failed:', e);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="admin-btn primary" onClick={() => navigate('/products/new')}>+ Add Product</button>
      </div>
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Loading...</div>
      ) : (
        <DataTable columns={columns} data={products} onRowClick={(row) => navigate(`/products/${row.id}`)} />
      )}
    </div>
  );
}
