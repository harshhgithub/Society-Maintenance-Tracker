import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { BsPinAngleFill } from 'react-icons/bs';

export default function PostNotice() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ content: '', isImportant: false, isPinned: false });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notices', form);
      setIsError(false);
      setMessage('Notice posted successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setIsError(true);
      setMessage('Failed to post notice');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a Notice</h2>

        {message && (
          <p style={{ ...styles.msg, ...(isError ? styles.msgError : styles.msgSuccess) }}>
            {isError ? <FiAlertCircle /> : <FiCheckCircle />} {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            style={{ ...styles.input, height:'120px', resize:'vertical' }}
            placeholder="Write your notice here..."
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
          />

          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              onChange={e => setForm({ ...form, isImportant: e.target.checked })}
            />
            <FiAlertCircle size={15} /> Mark as Important (sends email to all residents)
          </label>

          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              onChange={e => setForm({ ...form, isPinned: e.target.checked })}
            />
            <BsPinAngleFill size={13} /> Pin to top of notice board
          </label>

          <button style={styles.button} type="submit">
            <FiSend size={16} /> Post Notice
          </button>
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
  checkLabel: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.9rem', color:'#374151', fontSize:'0.88rem' },
  checkbox: { width:'15px', height:'15px', cursor:'pointer' },
  button: { display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'11px', background:'#111827', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:500, fontSize:'0.92rem', marginTop:'0.5rem' },
  msg: { display:'flex', alignItems:'center', gap:'6px', marginBottom:'1rem', fontSize:'0.85rem', padding:'8px 12px', borderRadius:'8px' },
  msgSuccess: { color:'#16a34a', background:'#f0fdf4' },
  msgError: { color:'#dc2626', background:'#fef2f2' },
};