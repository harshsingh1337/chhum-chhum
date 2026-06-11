import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge.from('customers').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setCustomers(data.map(c => ({
            id: c.id,
            name: c.full_name || 'N/A',
            email: c.email,
            phone: c.phone || '-',
          })));
        }
      } catch (e) {
        console.warn('Customers fetch failed:', e);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Customers</h1>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="data-table-empty">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="3" className="data-table-empty">No customers yet</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
