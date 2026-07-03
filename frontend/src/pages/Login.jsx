import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { FiMail, FiLock, FiAlertCircle, FiHome } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      data.user.role === 'admin' ? navigate('/admin') : navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}><FiHome size={18} /></div>
        <span style={styles.brandName}>Society Maintainenace Tracker</span>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Welcome back, enter your details</p>

        {error && (
          <p style={styles.error}><FiAlertCircle /> {error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrap}>
            <FiMail style={styles.inputIcon} size={16} />
            <input
              style={styles.input}
              placeholder="Email"
              type="email"
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.inputWrap}>
            <FiLock style={styles.inputIcon} size={16} />
            <input
              style={styles.input}
              placeholder="Password"
              type="password"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button style={styles.button} type="submit">Login</button>
        </form>

        <p style={styles.link}>Don't have an account? <Link to="/register" style={styles.linkText}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f9fafb', fontFamily:"'Inter', system-ui, sans-serif", padding:'2rem 1rem' },
  brand: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' },
  brandIcon: { width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', background:'#111827', color:'#fff', borderRadius:'8px' },
  brandName: { fontSize:'1.05rem', fontWeight:700, color:'#111827', letterSpacing:'-0.01em' },
  card: { background:'#fff', padding:'2.25rem', borderRadius:'14px', width:'360px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' },
  title: { textAlign:'center', marginBottom:'0.35rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  subtitle: { textAlign:'center', marginBottom:'1.5rem', color:'#9ca3af', fontSize:'0.85rem' },
  inputWrap: { position:'relative', marginBottom:'1rem' },
  inputIcon: { position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#9ca3af' },
  input: { width:'100%', padding:'10px 12px 10px 38px', borderRadius:'8px', border:'1px solid #e5e7eb', boxSizing:'border-box', fontSize:'0.9rem', color:'#374151', outline:'none' },
  button: { width:'100%', padding:'11px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:500, fontSize:'0.92rem', marginTop:'0.25rem' },
  error: { display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', color:'#dc2626', background:'#fef2f2', padding:'8px 12px', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.85rem' },
  link: { textAlign:'center', marginTop:'1.25rem', color:'#6b7280', fontSize:'0.88rem' },
  linkText: { color:'#111827', fontWeight:500, textDecoration:'none' },
};