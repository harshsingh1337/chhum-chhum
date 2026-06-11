import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/products';

export default function CartPage() {
  const { cart, dispatch, cartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [termsChecked, setTermsChecked] = useState(false);

  const handleRemove = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id, size: item.size } });
    showToast('Item removed');
  };

  const handleQtyChange = (item, delta) => {
    if (item.quantity + delta === 0) {
      handleRemove(item);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, size: item.size, quantity: item.quantity + delta } });
    }
  };

  const handleCheckout = () => {
    if (!termsChecked) { showToast('Please agree to terms & conditions'); return; }
    navigate('/checkout');
  };

  return (
    <div className="page active">
      <div className="cart-layout">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 400 }}>Your Cart</h1>
          <Link to="/collections" style={{ fontSize: '0.75rem', color: 'var(--mid)', textDecoration: 'underline' }}>Continue shopping</Link>
        </div>
        <table className="cart-table">
          <thead><tr><th>Product</th><th style={{ textAlign: 'center' }}>Quantity</th><th>Total</th></tr></thead>
          <tbody>
            {cart.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--light)' }}>Your cart is empty</td></tr>
            ) : cart.map((item) => (
              <tr key={`${item.id}-${item.size}`}>
                <td className="cart-item-td">
                  <div className="cart-item-row">
                    <div className="cart-item-img"><div className={`cart-item-img-inner ${item.colorClass}`}></div></div>
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">{formatPrice(item.price)}</div>
                      <div className="cart-item-meta">Underskirt/Petticoat: {item.size}</div>
                      <div className="cart-item-remove" onClick={() => handleRemove(item)}>Remove</div>
                    </div>
                  </div>
                </td>
                <td className="cart-item-td" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <div className="qty-control" style={{ display: 'inline-flex' }}>
                    <button className="qty-btn" onClick={() => handleQtyChange(item, -1)}>−</button>
                    <div className="qty-val">{item.quantity}</div>
                    <button className="qty-btn" onClick={() => handleQtyChange(item, 1)}>+</button>
                  </div>
                </td>
                <td className="cart-item-td" style={{ textAlign: 'right', verticalAlign: 'middle' }}>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cart-bottom">
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Order special instructions</div>
            <div className="cart-notes"><textarea placeholder="Add a note to your order..."></textarea></div>
          </div>
          <div className="cart-summary-box">
            <label className="terms-check">
              <input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} />
              I agree to the <a href="#" style={{ color: 'var(--charcoal)', fontWeight: 500 }}>terms and conditions</a>
            </label>
            <div className="cart-total-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="cart-total-row" style={{ fontSize: '0.72rem', color: 'var(--light)', marginBottom: '1rem' }}>
              <span>Taxes included. Shipping calculated at checkout.</span>
            </div>
            <div className="cart-total-row final"><span>Estimated Total</span><span>{formatPrice(cartTotal)}</span></div>
            <button className="add-to-cart" style={{ marginTop: '1rem' }} onClick={handleCheckout}>Check out</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
