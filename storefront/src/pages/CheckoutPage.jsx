import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/products';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { insforge } from '../lib/insforge';

export default function CheckoutPage() {
  const { cart, cartTotal, taxAmount, dispatch } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', address: '', apt: '', city: '', state: 'West Bengal', pin: '', phone: '', country: 'India' });
  const [billing, setBilling] = useState('same');
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const saveOrderToInsforge = async (paymentResponse) => {
    const orderNumber = 'CC-' + Date.now().toString().slice(-8);
    try {
      // Create order
      const { data: order, error: orderErr } = await insforge.from('orders').insert({
        order_number: orderNumber,
        status: 'paid',
        customer_email: form.email,
        customer_phone: form.phone,
        customer_name: `${form.firstName} ${form.lastName}`,
        shipping_address: { address: form.address, apt: form.apt, city: form.city, state: form.state, pin: form.pin, country: form.country },
        billing_address: billing === 'same' ? null : null,
        subtotal: cartTotal,
        tax_amount: taxAmount,
        total_amount: cartTotal,
        razorpay_payment_id: paymentResponse?.paymentId || null,
        razorpay_order_id: paymentResponse?.orderId || null,
      }).select().single();

      if (orderErr) throw orderErr;

      // Create order items
      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id.length > 10 ? item.id : null, // only UUID product IDs
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      await insforge.from('order_items').insert(items);

      // Create/update customer
      await insforge.from('customers').upsert({
        email: form.email,
        full_name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        default_address: { address: form.address, city: form.city, state: form.state, pin: form.pin },
      }, { onConflict: 'email' });

      return orderNumber;
    } catch (e) {
      console.warn('Failed to save order to InsForge:', e);
      return orderNumber;
    }
  };

  const handlePayNow = async () => {
    if (!form.email || !form.firstName || !form.address || !form.city || !form.pin || !form.phone) {
      showToast('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    const totalRupees = cartTotal / 100;
    initiateRazorpayPayment({
      amount: totalRupees,
      customerName: `${form.firstName} ${form.lastName}`,
      customerEmail: form.email,
      customerPhone: form.phone,
      onSuccess: async (response) => {
        const orderNum = await saveOrderToInsforge(response);
        showToast(`Order ${orderNum} placed successfully! 🎉`);
        dispatch({ type: 'CLEAR_CART' });
        setSubmitting(false);
      },
      onFailure: (err) => {
        showToast(err.reason || 'Payment failed');
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="page active">
      <div className="checkout-layout">
        <div className="checkout-left">
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', marginBottom: '2rem' }}>ChhumChhum</div>
          <div className="checkout-section">
            <div className="checkout-section-title">Contact</div>
            <div className="form-row single" style={{ marginBottom: '0.5rem' }}>
              <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <label className="form-check"><input type="checkbox" defaultChecked /> Email me with news and offers</label>
          </div>
          <div className="checkout-section">
            <div className="checkout-section-title">Delivery</div>
            <div className="form-row single">
              <select className="form-select" value={form.country} onChange={(e) => update('country', e.target.value)}>
                <option>India</option><option>United States</option><option>United Kingdom</option><option>UAE</option>
              </select>
            </div>
            <div className="form-row">
              <input className="form-input" placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              <input className="form-input" placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </div>
            <div className="form-row single"><input className="form-input" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} /></div>
            <div className="form-row single"><input className="form-input" placeholder="Apartment, suite, etc." value={form.apt} onChange={(e) => update('apt', e.target.value)} /></div>
            <div className="form-row triple">
              <input className="form-input" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <select className="form-select" value={form.state} onChange={(e) => update('state', e.target.value)}>
                <option>West Bengal</option><option>Karnataka</option><option>Maharashtra</option><option>Delhi</option><option>Tamil Nadu</option>
              </select>
              <input className="form-input" placeholder="PIN code" value={form.pin} onChange={(e) => update('pin', e.target.value)} />
            </div>
            <div className="form-row single"><input className="form-input" type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
            <label className="form-check"><input type="checkbox" /> Save this information for next time</label>
          </div>
          <div className="checkout-section">
            <div className="checkout-section-title">Payment</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: '1rem' }}>All transactions are secure and encrypted.</p>
            <div className="payment-option active">
              <div className="payment-radio"></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: '0.85rem' }}>Razorpay Secure</div></div>
              <div className="payment-pills">
                <div className="payment-pill">UPI</div><div className="payment-pill">Cards</div>
                <div className="payment-pill">Int'l</div><div className="payment-pill">Wallets</div>
                <div className="payment-pill" style={{ background: 'var(--charcoal)', color: 'white', borderColor: 'var(--charcoal)' }}>+17</div>
              </div>
            </div>
            <div className="payment-desc">You'll be redirected to Razorpay Secure to complete your purchase.</div>
          </div>
          <div className="checkout-section">
            <div className="checkout-section-title">Billing Address</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.2rem', border: billing === 'same' ? '1.5px solid var(--gold)' : '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="radio" name="billing" checked={billing === 'same'} onChange={() => setBilling('same')} style={{ accentColor: 'var(--gold)' }} /> Same as shipping address
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.2rem', border: billing === 'different' ? '1.5px solid var(--gold)' : '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="radio" name="billing" checked={billing === 'different'} onChange={() => setBilling('different')} style={{ accentColor: 'var(--gold)' }} /> Use a different billing address
              </label>
            </div>
          </div>
          <button className="add-to-cart" style={{ fontSize: '0.82rem', letterSpacing: '0.18em' }} onClick={handlePayNow} disabled={submitting}>
            {submitting ? 'Processing...' : 'Pay Now'}
          </button>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.72rem', color: 'var(--light)' }}>
            <a href="#" style={{ color: 'var(--light)' }}>Refund policy</a>
            <a href="#" style={{ color: 'var(--light)' }}>Privacy policy</a>
            <a href="#" style={{ color: 'var(--light)' }}>Terms of service</a>
          </div>
        </div>
        <div className="checkout-right">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="checkout-item">
              <div className="checkout-item-img">
                <div className={`checkout-item-img-inner ${item.colorClass}`}></div>
                <div className="checkout-item-badge">{item.quantity}</div>
              </div>
              <div className="checkout-item-info">
                <div className="checkout-item-name">{item.name}</div>
                <div className="checkout-item-meta">{item.size}</div>
              </div>
              <div className="checkout-item-price">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="discount-row">
            <input className="discount-input" type="text" placeholder="Discount code or gift card" />
            <button className="discount-btn">Apply</button>
          </div>
          <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1rem' }}></div>
          <div className="summary-line"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-line"><span>Shipping</span><span style={{ color: 'var(--light)' }}>Enter shipping address</span></div>
          <div className="summary-line total">
            <span>Total</span>
            <div style={{ textAlign: 'right' }}>
              <div>INR {formatPrice(cartTotal)}</div>
              <div className="summary-tax">Including {formatPrice(taxAmount)} in taxes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
