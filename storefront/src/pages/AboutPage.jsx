import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="page active">
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '6rem 2rem', textAlign: 'center' }}>
        <img src="/images/logo.jpeg" alt="ChhumChhum" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }} />
        <p style={{ maxWidth: '480px', fontSize: '1rem', lineHeight: 1.9, color: 'var(--mid)', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic' }}>
          Where heritage meets the contemporary. Each piece is a quiet conversation between the artisan's hand and the fabric's soul — meant to be felt, not explained.
        </p>
      </section>
      <Footer />
    </div>
  );
}
