import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

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
      setIsError(false);
      setMessage('Complaint raised successfully!');
      setTimeout(() => navigate('/my-complaints'), 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Failed to raise complaint');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Raise a Complaint</h2>

        {message && (
          <p style={{ ...styles.msg, ...(isError ? styles.msgError : styles.msgSuccess) }}>
            {isError ? <FiAlertCircle /> : <FiCheckCircle />} {message}
          </p>
        )}

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
            style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            placeholder="Describe your complaint..."
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />

          <label style={styles.label}>Upload Photo (optional)</label>
          <label style={styles.fileInput}>
            <FiUpload size={16} />
            <span>{photo ? photo.name : 'Choose a file'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPhoto(e.target.files[0])}
              style={styles.fileInputHidden}
            />
          </label>

          <button style={styles.button} type="submit">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', padding:'2rem', background:'#f9fafb', minHeight:'100vh', fontFamily:"'Inter', system-ui, sans-serif" },
  card: { background:'#fff', padding:'2rem', borderRadius:'14px', width:'460px', border:'1px solid #f0f1f3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', height:'fit-content' },
  title: { marginBottom:'1.5rem', color:'#111827', fontWeight:600, letterSpacing:'-0.01em' },
  input: { width:'100%', padding:'10px 12px', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #e5e7eb', boxSizing:'border-box', fontSize:'0.9rem', color:'#374151', outline:'none' },
  label: { display:'block', marginBottom:'0.5rem', color:'#6b7280', fontSize:'0.85rem' },
  fileInput: { display:'flex', alignItems:'center', gap:'8px', width:'100%', padding:'10px 12px', marginBottom:'1.25rem', borderRadius:'8px', border:'1px dashed #d1d5db', boxSizing:'border-box', fontSize:'0.85rem', color:'#6b7280', cursor:'pointer' },
  fileInputHidden: { display:'none' },
  button: { width:'100%', padding:'11px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:500, fontSize:'0.92rem' },
  msg: { display:'flex', alignItems:'center', gap:'6px', marginBottom:'1rem', fontSize:'0.85rem', padding:'8px 12px', borderRadius:'8px' },
  msgSuccess: { color:'#16a34a', background:'#f0fdf4' },
  msgError: { color:'#dc2626', background:'#fef2f2' },
};