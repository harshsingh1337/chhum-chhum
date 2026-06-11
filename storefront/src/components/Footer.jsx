import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-brand-title">ChhumChhum</div>
          <div className="footer-brand-sub">Fashion Label</div>
          <p className="footer-brand-desc">
            Luxury hand-painted sarees crafted for the modern Indian woman. Every piece is a work of art.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
              Newsletter
            </div>
            <div className="subscribe-row">
              <input className="subscribe-input" type="email" placeholder="Your email address" />
              <button className="subscribe-btn">→</button>
            </div>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Quick Links</div>
          <Link className="footer-link" to="/">Home</Link>
          <Link className="footer-link" to="/collections">Collections</Link>
          <Link className="footer-link" to="/collections">New Arrivals</Link>
          <Link className="footer-link" to="/">Celebrity Closet</Link>
          <Link className="footer-link" to="/">About Us</Link>
          <Link className="footer-link" to="/">Blog</Link>
        </div>
        <div>
          <div className="footer-col-title">Info</div>
          <Link className="footer-link" to="/">Privacy Policy</Link>
          <Link className="footer-link" to="/">Terms & Conditions</Link>
          <Link className="footer-link" to="/">Contact Us</Link>
          <Link className="footer-link" to="/">Shipping & Returns</Link>
          <Link className="footer-link" to="/">Custom Fit</Link>
          <Link className="footer-link" to="/">Refer & Earn</Link>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <div className="footer-contact-item">
            <span className="footer-contact-label">Address</span>
            930, Gali Pattal Wali, Maliwara<br />Chandni Chowk, Delhi 110006
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-label">Email</span>
            chhumchhum2202@gmail.com
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-label">WhatsApp / Call</span>
            +91 98118 80889
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025, ChhumChhum Fashion Label. All rights reserved.</div>
        <div className="footer-social">
          <div className="footer-social-icon" title="Instagram">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
          <div className="footer-social-icon" title="Pinterest">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
