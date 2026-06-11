import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { insforge } from '../lib/insforge';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState({ name: '', brand: 'ChhumChhum', price: '', slug: '', description: '', dimensions: '', care: '', customisation: '', fabric: 'Organza', tag: '', availability: 'ready', color_class_1: 'saree-a', color_class_2: 'saree-f' });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function fetch() {
      try {
        const { data, error } = await insforge.from('products').select('*').eq('id', id).single();
        if (!error && data) {
          setForm({
            name: data.name || '',
            brand: data.brand || 'ChhumChhum',
            price: String((data.price || 0) / 100),
            slug: data.slug || '',
            description: data.description || '',
            dimensions: data.dimensions || '',
            care: data.care_instructions || '',
            customisation: data.customisation_info || '',
            fabric: data.fabric || 'Organza',
            tag: data.tag || '',
            availability: data.availability || 'ready',
            color_class_1: data.color_class_1 || 'saree-a',
            color_class_2: data.color_class_2 || 'saree-f',
          });
        }
      } catch (e) {
        console.warn('Fetch product failed:', e);
      }
      setLoading(false);
    }
    fetch();
  }, [id, isNew]);

  const update = (field, value) => {
    const newForm = { ...form, [field]: value };
    if (field === 'name') newForm.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(newForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { alert('Name and price are required'); return; }
    setSaving(true);
    const payload = {
      name: form.name,
      brand: form.brand,
      price: Math.round(parseFloat(form.price) * 100),
      slug: form.slug,
      description: form.description,
      dimensions: form.dimensions,
      care_instructions: form.care,
      customisation_info: form.customisation,
      fabric: form.fabric,
      tag: form.tag || null,
      availability: form.availability,
      color_class_1: form.color_class_1,
      color_class_2: form.color_class_2,
    };

    try {
      if (isNew) {
        const { error } = await insforge.from('products').insert(payload);
        if (error) throw error;
        alert('Product created!');
      } else {
        const { error } = await insforge.from('products').update(payload).eq('id', id);
        if (error) throw error;
        alert('Product updated!');
      }
      navigate('/products');
    } catch (e) {
      alert('Error: ' + (e.message || 'Failed to save'));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    try {
      await insforge.from('products').delete().eq('id', id);
      navigate('/products');
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  if (loading) return <div className="admin-page" style={{ padding: '3rem', color: '#999' }}>Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isNew ? 'Add Product' : 'Edit Product'}</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!isNew && <button className="admin-btn" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={handleDelete}>Delete</button>}
          <button className="admin-btn" onClick={() => navigate('/products')}>Cancel</button>
          <button className="admin-btn primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-section">
          <h3 className="form-section-title">Basic Info</h3>
          <label className="admin-label">Name</label>
          <input className="admin-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Product name" />
          <label className="admin-label">Slug</label>
          <input className="admin-input" value={form.slug} onChange={(e) => update('slug', e.target.value)} />
          <div className="admin-form-row">
            <div><label className="admin-label">Brand</label><input className="admin-input" value={form.brand} onChange={(e) => update('brand', e.target.value)} /></div>
            <div><label className="admin-label">Price (₹)</label><input className="admin-input" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="25500" /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-label">Fabric</label>
              <select className="admin-select" value={form.fabric} onChange={(e) => update('fabric', e.target.value)}>
                <option>Organza</option><option>Diamond Chiffon</option><option>Chinon</option><option>Pure Silk</option><option>Linen</option>
              </select>
            </div>
            <div><label className="admin-label">Tag</label>
              <select className="admin-select" value={form.tag} onChange={(e) => update('tag', e.target.value)}>
                <option value="">None</option><option>Best Seller</option><option>New</option><option>Custom</option>
              </select>
            </div>
          </div>
          <label className="admin-label">Availability</label>
          <select className="admin-select" value={form.availability} onChange={(e) => update('availability', e.target.value)}>
            <option value="ready">Ready to Ship</option><option value="made_to_order">Made to Order</option>
          </select>
        </div>
        <div className="form-section">
          <h3 className="form-section-title">Details</h3>
          <label className="admin-label">Description</label>
          <textarea className="admin-textarea" rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} />
          <label className="admin-label">Dimensions</label>
          <textarea className="admin-textarea" rows="3" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} />
          <label className="admin-label">Care Instructions</label>
          <textarea className="admin-textarea" rows="2" value={form.care} onChange={(e) => update('care', e.target.value)} />
          <label className="admin-label">Customisation Info</label>
          <textarea className="admin-textarea" rows="2" value={form.customisation} onChange={(e) => update('customisation', e.target.value)} />
        </div>
        <div className="form-section">
          <h3 className="form-section-title">Images</h3>
          <div className="image-upload-area">
            <div className="image-upload-placeholder">
              <span>📷</span>
              <p>Drag & drop images or click to upload</p>
              <small>Uploads to InsForge Storage</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
