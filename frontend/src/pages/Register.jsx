import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'resident' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Full Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <select
            style={styles.input}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="resident">Resident</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'#fff', padding:'2rem', borderRadius:'10px', width:'360px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'1.5rem', color:'#333' },
  input: { width:'100%', padding:'10px', marginBottom:'1rem', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box' },
  button: { width:'100%', padding:'10px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  error: { color:'red', marginBottom:'1rem', textAlign:'center' },
  link: { textAlign:'center', marginTop:'1rem' }
};