import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('category', form.category);
      formData.append('description', form.description);
      if (photo) formData.append('photo', photo);

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Complaint raised successfully!');
      setTimeout(() => navigate('/my-complaints'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to raise complaint');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Raise a Complaint</h2>
        {message && <p style={styles.msg}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <select
            style={styles.input}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
          <textarea
            style={{ ...styles.input, height: '100px' }}
            placeholder="Describe your complaint..."
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
          <label style={styles.label}>Upload Photo (optional)</label>
          <input
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files[0])}
          />
          <button style={styles.button} type="submit">Submit Complaint</button>
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
  label: { display:'block', marginBottom:'0.5rem', color:'#555', fontSize:'0.9rem' },
  button: { width:'100%', padding:'10px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  msg: { color:'green', marginBottom:'1rem', textAlign:'center' }
};