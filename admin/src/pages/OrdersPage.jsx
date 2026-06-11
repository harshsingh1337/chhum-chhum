import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { insforge } from '../lib/insforge';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setOrders(data.map(o => ({
            id: o.order_number || o.id.slice(0, 12),
            customer: o.customer_name || 'N/A',
            email: o.customer_email,
            total: '₹' + ((o.total_amount || 0) / 100).toLocaleString('en-IN'),
            status: o.status,
            payment: o.razorpay_payment_id || '-',
            date: o.created_at?.split('T')[0] || '',
          })));
        }
      } catch (e) {
        console.warn('Orders fetch failed:', e);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment ID</th><th>Date</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="data-table-empty">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="data-table-empty">No orders yet</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 500 }}>{o.id}</td>
                <td>{o.customer}<br /><small style={{ color: '#999' }}>{o.email}</small></td>
                <td>{o.total}</td>
                <td><StatusBadge status={o.status} /></td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{o.payment}</td>
                <td style={{ color: '#999' }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
