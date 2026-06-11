import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@chhumchhum.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  // For demo: skip auth when InsForge isn't running
  const handleDemoLogin = () => navigate('/dashboard');

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">ChhumChhum</div>
        <div className="login-brand-sub">Admin Panel</div>
        <form onSubmit={handleSubmit}>
          <input className="login-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <button className="login-demo-btn" onClick={handleDemoLogin}>Demo Login (No Auth)</button>
      </div>
    </div>
  );
}
