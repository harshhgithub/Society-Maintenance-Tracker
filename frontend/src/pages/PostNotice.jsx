import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function PostNotice() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ content: '', isImportant: false, isPinned: false });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notices', form);
      setMessage('Notice posted successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setMessage('Failed to post notice');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a Notice</h2>
        {message && <p style={styles.msg}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            style={{ ...styles.input, height:'120px' }}
            placeholder="Write your notice here..."
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
          />
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              onChange={e => setForm({ ...form, isImportant: e.target.checked })}
            /> Mark as Important (sends email to all residents)
          </label>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              onChange={e => setForm({ ...form, isPinned: e.target.checked })}
            /> Pin to top of notice board
          </label>
          <button style={styles.button} type="submit">Post Notice</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', padding:'2rem', background:'#f0f2f5', minHeight:'100vh' },
  card: { background:'#fff', padding:'2rem', borderRadius:'10px', width:'460px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', height:'fit-content' },
  title: { marginBottom:'1.5rem', color:'#333' },
  input: { width:'100%', padding:'10px', marginBottom:'1rem', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box' },
  checkLabel: { display:'block', marginBottom:'0.8rem', color:'#555' },
  button: { width:'100%', padding:'10px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', marginTop:'0.5rem' },
  msg: { color:'green', marginBottom:'1rem', textAlign:'center' }
};